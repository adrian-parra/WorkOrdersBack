import jwt from 'jsonwebtoken'

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader) return res.status(401).json({ title: 'No estás autenticado o las credenciales proporcionadas son incorrectas', icon: 'error' })
  const token = authHeader.split(' ')[1]
  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    (err, decoded) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          // El token ha expirado
          return res.status(401).json({ icon: 'error', title: 'Su sesión ha expirado', status: '999' })
        } else if (err.name === 'JsonWebTokenError') {
          // Error en la firma del token
          return res.status(401).json({ icon: 'error', title: 'Firma de token alterada' })
        } else if (err.name === 'NotBeforeError') {
          // El token aún no es válido
          return res.status(401).json({ icon: 'error', title: 'El token aún no es válido' })
        } else if (err.name === 'TokenRevokedError') {
          // El token ha sido revocado
          return res.status(401).json({ icon: 'error', title: 'El token ha sido revocado' })
        } else {
          return res.status(500).json({ icon: 'error', title: 'error con token', body: err })
        }
      } else {
        req.access_rol = decoded.access_rol
        req.access_username = decoded.username
        next()
      }
    }
  )
}
export default verifyJWT
