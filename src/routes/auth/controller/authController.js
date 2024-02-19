
import { msg } from '../../../config/responseMessages.js'
import { updateUserService } from '../../users/service/userService.js'
import { checkIfUserExists, checkUserEqualsRefreshToken } from '../service/authService.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const handleLogin = async (req, res) => {
  try {
    const { usuario, password } = req.body
    if (!usuario || !password) {
      msg.title = 'Usuario y contraseña requeridos'
      msg.icon = 'error'

      return res
      .status(422)
      .json(msg)
    }

  // ! VERIFICAR SI EL USUARIO EXISTE EN LA BD
    const user = await checkIfUserExists(usuario)

  // ! SI NO EXISTE RETORNAR UNAUTHORIZED
    if (!user) {
      msg.title = 'Usuario no existe'
      msg.icon = 'error'
      return res.status(422).json(msg)
    }

  // ! SI EXISTE EVALUAR LA PASSWORD CON LA RECIBIDA (USANDO BCRYPT)
    const match = await bcrypt.compare(password, user.password)

  // ! SI LA PASSWORD NO COINCIDE RETORNAR UNAUTHORIZED
    if (!match) {
      msg.title = 'Contraseña incorrecta'
      msg.icon = 'error'
      return res.status(422).json(msg)
    }

    // ! SI LA PASSWORD COINCIDE GENERAR TOKEN (JWT)
    // create JWTs
    const accessToken = jwt.sign(
      { username: user.nombre_usuario, access_rol: user.autoridad.nivel_autoridad },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '60s' }
    )
    const refreshToken = jwt.sign(
      { username: user.nombre_usuario, access_rol: user.autoridad.nivel_autoridad },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '1d' }
    )

    // ! GUARDAR REFRESHTOKEN EN MODEL USER
    await updateUserService(user.id, {token: refreshToken})

  // ! PRODUCCIÓN
  // res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 })
  // ! DESARROLLO
    res.cookie('token', refreshToken, { maxAge: 24 * 60 * 60 * 1000 })
    const data = {
      token: accessToken,
      rol: user.autoridad.nivel_autoridad,
      rolDescripcion: user.autoridad.concepto
    }
    msg.icon = 'success'
    msg.body = data
    msg.title = ''
    return res.json(msg)
  } catch (error) {
    console.log(error)
  }
}

export const handleLogout = async (req, res) => {
  const cookies = req.cookies

  if (!cookies || !cookies.jwt) return res.sendStatus(204)
  const refreshToken = cookies.jwt

  const foundUser = await checkUserEqualsRefreshToken(refreshToken)

  if (!foundUser) {
    // ! PRODUCCIÓN
    // res.clearCookie('jwt', { httpOnly: false, sameSite: 'None', secure: false })
    // ! DESARROLLO
    res.clearCookie('jwt')

    return res.sendStatus(204)
  }

  await updateUserService(foundUser.id, {token: ''})
}

export const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies
  if (!cookies.jwt) { return res.status(401).json({ title: 'No autorizado', icon: 'error' }) }
  const refreshToken = cookies.jwt

  const foundUser = await checkUserEqualsRefreshToken(refreshToken)
  if (!foundUser) {
    // res.clearCookie('jwt', { httpOnly: false, sameSite: 'None', secure: false })
    res.clearCookie('jwt')
    return res
      .status(401)
      .json({
        title:
          'No tienes permiso para realizar esta acción o acceder a este recurso',
        icon: 'error'
      }) // Forbidden 403
  }
  // evaluate jwt
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        // El token ha expirado
        res.clearCookie('jwt')

        return res
          .status(401)
          .json({ icon: 'error', title: 'Su sesión ha expirado', status: '99' })
      } else if (err.name === 'JsonWebTokenError') {
        // Error en la firma del token
        return res
          .status(401)
          .json({ icon: 'error', title: 'Firma de token alterada' })
      } else if (err.name === 'NotBeforeError') {
        // El token aún no es válido
        return res
          .status(401)
          .json({ icon: 'error', title: 'El token aún no es válido' })
      } else if (err.name === 'TokenRevokedError') {
        // El token ha sido revocado
        return res
          .status(401)
          .json({ icon: 'error', title: 'El token ha sido revocado' })
      } else {
        return res
          .status(500)
          .json({ icon: 'error', title: 'error con token', body: err })
      }
    } else if (foundUser.nombre_usuario !== decoded.username) {
      return res
        .status(401)
        .json({
          title: 'No tienes permiso para realizar esta acción',
          icon: 'error'
        })
    }

    const accessToken = jwt.sign(
      {
        username: foundUser.nombre_usuario,
        access_rol: foundUser.nivel_autoridad
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '30s' }
    )

    res.json({
      title: '', // ? SE ACTUALIZO EL TOKEN
      icon: 'info',
      body: { token: accessToken }
    })
  })
}
