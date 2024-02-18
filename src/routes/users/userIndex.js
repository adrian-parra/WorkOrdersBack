import { createUserController, getAllUsersController, getUserByIdController, updateUserByIdController } from './controller/userController.js'
import { Router } from 'express'

const router = Router()

router.get(
  '/users',
  getAllUsersController
)

router.get(
    '/users/:id',
    getUserByIdController
)

router.post(
    '/users',
    createUserController
)

router.put(
    '/users/:id',
    updateUserByIdController
)

export default router
