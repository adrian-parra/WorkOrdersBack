import { handleLogout } from './controller/authController.js'
import { Router } from 'express'

const router = Router()

router.post(
  '/user/logout',
  handleLogout
)
export default router
