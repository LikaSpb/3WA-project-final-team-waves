import { Request, Response } from 'express'
import { AuthService } from '../services/auth.services'
import { LoginUserDto, UserDto } from '../dtos/users.dto'
import { RequestWithUser } from 'middlewares/validations.middleware'
import { CODERESPONSE } from '../constants/CodeResponse'

export class AuthController {
  private authService = new AuthService()

  public readonly login = async (req: Request, res: Response) => {
    try {
      const loginData: LoginUserDto = req.body

      const { user, token } = await this.authService.login(loginData, req)

      res.cookie('Authorization', `Bearer ${token}`, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: true,
      })

      res.status(CODERESPONSE.OK).json(user)
    } catch (error) {
      res.status(CODERESPONSE.BAD_REQUEST).json({ error: error.message })
    }
  }

  public readonly register = async (req: Request, res: Response) => {
    try {
      const registerData: UserDto = req.body

      const newUser = await this.authService.createUser(registerData)

      const loginData: LoginUserDto = {
        email: newUser.email,
        password: req.body.password,
      }
      const { user, token } = await this.authService.login(loginData, req)

      res.cookie('Authorization', `Bearer ${token}`, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: true,
      })

      res.status(CODERESPONSE.OK).json(user)
    } catch (error) {
      res.status(CODERESPONSE.BAD_REQUEST).json({ error: error.message })
    }
  }

  public readonly logout = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      this.authService.logout(req.body.id)
      res.clearCookie('Authorization')

      res.end()
    } catch (error) {
      res.status(CODERESPONSE.BAD_REQUEST).json({ error: error.message })
    }
  }

  async saveAgent(req: RequestWithUser, res: Response): Promise<void> {
    try {
      const userId = req.user?._id as unknown as string
      const agent = req.headers['user-agent'] as string

      await this.authService.saveAgent(userId, agent)

      res.status(CODERESPONSE.OK).json({ message: 'Agent saved successfully' })
    } catch (error) {
      res.status(CODERESPONSE.BAD_REQUEST).json({ error: error.message })
    }
  }
}
