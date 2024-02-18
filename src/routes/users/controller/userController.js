import { createUserService, getAllUserService, getUserByIdService, updateUserService } from '../service/userService.js'

import { msg } from '../../../config/responseMessages.js'

export const getAllUsersController = async (req, res, next) => {
  try {
    const users = await getAllUserService()
    msg.body = users
    return res.status(200).json(msg)
  } catch (error) {
    next()
  }
}

// Obtener un usuario por su ID
export const getUserByIdController = async (req, res, next) => {
  try {
    const user = await getUserByIdService(parseInt(req.params.id))
    if (!user) {
      msg.title = 'Usuario no encontrado'
      msg.status = 404
      msg.icon = 'error'

      return res.status(404).json(msg)
    }
    msg.title = ''
    msg.icon = 'success'
    msg.body = user
    res.json(msg)
  } catch (error) {
    console.log(error)
    next()
  }
}

// Crear un nuevo usuario
export const createUserController = async (req, res, next) => {
  try {
    const newUser = await createUserService(req.body)
    msg.body = newUser
    msg.icon = 'success'
    msg.title = 'Usuario creado con éxito'
    return res.json(msg)
  } catch (error) {
    next()
  }
}

// Actualizar un usuario por su ID
export const updateUserByIdController = async (req, res, next) => {
  try {
    const updatedUser = await updateUserService(req.params.id, req.body)
    if (!updatedUser) {
      msg.title = 'Usuario no encontrado'
      msg.icon = 'error'
      return res.status(404).json(msg)
    }
    msg.title = 'Usuario actualizado con éxito'
    msg.body = updatedUser
    msg.icon = 'success'
    res.json(msg)
  } catch (error) {
    console.log(error)
    next()
  }
}

// // Eliminar un usuario por su ID
// export const deleteUserById = async (req, res, next) => {
//   try {
//     const deletedUser = await User.findByIdAndDelete(req.params.id)
//     if (!deletedUser) {
//       return res.status(404).json({ msg: 'Usuario no encontrado' })
//     }
//     res.json({ msg: 'Usuario eliminado correctamente' })
//   } catch (error) {
//     next()
//   }
// }
