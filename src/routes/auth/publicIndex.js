import { handleLogin, handleRefreshToken } from './controller/authController.js'
import { Router } from 'express'

const router = Router()

router.post(
    '/user/login',
    handleLogin
  )

router.post(
    '/user/token/refresh',
    handleRefreshToken
  )

export default router
