import { Router } from 'express'
import { AuthController } from '../controllers/auth.controller'
import { UserDto } from '../dtos/users.dto'
import {
  validationMiddleware,
  authMiddleware,
  RequestWithUser,
} from '../middlewares/validations.middleware'
import { LoginUserDto } from '../dtos/users.dto'
import { CODERESPONSE } from '../constants/CodeResponse'

const router = Router()

const authController = new AuthController()

router.post('/login', validationMiddleware(LoginUserDto), authController.login)

router.post('/register', validationMiddleware(UserDto), authController.register)

router.post('/logout', authMiddleware, authController.logout)

router.get('/token', authMiddleware, (req: RequestWithUser, res) =>
  res.status(CODERESPONSE.OK).json(req.user),
)

router.post('/agent', authMiddleware, authController.saveAgent)

export default router
