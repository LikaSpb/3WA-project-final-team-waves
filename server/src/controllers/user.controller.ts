import { Request, Response } from 'express'
import { UsersService } from '../services/users.services'
import { UserDto } from '../dtos/users.dto'
import { CODERESPONSE } from '../constants/CodeResponse'

export class UsersController {
  private usersService = new UsersService()

  public loginUser = async (req: Request, res: Response) => {
    try {
      const userData: UserDto = req.body

      if (!userData.picture) {
        // userData.picture = DEFAULT_PROFILE_PICTURE
      }

      const newUser = await this.usersService.addUser(userData)
      res.status(CODERESPONSE.CREATED).json(newUser)
    } catch (error) {
      res.status(CODERESPONSE.BAD_REQUEST).json({ error: error.message })
    }
  }

  public readonly registerUser = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body

      const user = await this.usersService.findUserByEmail(email)

      if (!user) {
        res
          .status(CODERESPONSE.BAD_REQUEST)
          .json({ error: 'User does not exist' })
        return
      }

      const isPasswordValid = await user.comparePassword(password)

      if (!isPasswordValid) {
        res
          .status(CODERESPONSE.UNAUTHORIZED)
          .json({ error: 'Invalid password' })
        return
      }

      res.status(CODERESPONSE.OK).json({ token: 'your_token_here', user })
    } catch (error) {
      res.status(CODERESPONSE.BAD_REQUEST).json({ error: error.message })
    }
  }

  public readonly getAllUsers = async (req: Request, res: Response) => {
    try {
      const users = await this.usersService.getAllUsers()
      res.status(CODERESPONSE.OK).json(users)
    } catch (error) {
      res.status(CODERESPONSE.BAD_REQUEST).json({ error: error.message })
    }
  }

  public getAllUsersConnected = async (req: Request, res: Response) => {
    try {
      const users = await this.usersService.getAllUsersConnected()
      res.status(CODERESPONSE.OK).json(users)
    } catch (error) {
      res.status(CODERESPONSE.BAD_REQUEST).json({ error: error.message })
    }
  }

  public readonly getOneUser = async (req: Request, res: Response) => {
    try {
      const user = await this.usersService.getOneUser(req.params.id)
      res.status(CODERESPONSE.OK).json(user)
    } catch (error) {
      res.status(CODERESPONSE.BAD_REQUEST).json({ error: error.message })
    }
  }

  public readonly editUser = async (req: Request, res: Response) => {
    try {
      const userId: string = req.params.id
      const userData: UserDto = req.body
      const updatedUser = await this.usersService.editUser(userId, userData)

      res.status(CODERESPONSE.OK).json(updatedUser)
    } catch (error) {
      res.status(CODERESPONSE.BAD_REQUEST).json({ error: error.message })
    }
  }

  public editPassword = async (req: Request, res: Response) => {
    try {
      const userId = req.params.id

      const { newPassword } = req.body

      const updatedUser = await this.usersService.editPassword(
        userId,
        newPassword,
      )

      return res.status(CODERESPONSE.OK).json({
        message: 'Mot de passe mis à jour avec succès',
        user: updatedUser,
      })
    } catch (error) {
      console.error('Erreur lors de la mise à jour du mot de passe :', error)
      return res
        .status(CODERESPONSE.BAD_REQUEST)
        .json({ error: 'Erreur lors de la mise à jour du mot de passe' })
    }
  }

  public readonly editProfilePhoto = async (req: Request, res: Response) => {
    try {
      const userId: string = req.params.userId
      const profilePicture: Express.Multer.File = req.file

      const updatedUser = await this.usersService.editProfilePhoto(
        userId,
        profilePicture.filename,
      )

      res.status(CODERESPONSE.OK).json(updatedUser)
    } catch (error) {
      res.status(CODERESPONSE.BAD_REQUEST).json({ error: error.message })
    }
  }
}
