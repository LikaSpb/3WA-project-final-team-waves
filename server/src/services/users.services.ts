import { HydratedDocument, MongooseError } from 'mongoose'
import UserModel from '../models/User.model'
import { IUser } from 'interfaces/users.interface'
import { UserDto } from 'dtos/users.dto'
import * as fs from 'fs'

class UsersService {
  usersModel = UserModel
  
  findUserByEmail = async (email: string) => {
    const user = await this.usersModel.findOne({ email })
    return user
  }

  addUser = async (userData: UserDto) => {
    try {
      const newUser = await this.usersModel.create(userData)
      return newUser
    } catch (err) {
      const error = err as MongooseError
      throw new Error(error.message)
    }
  }

  getAllUsers = async () => {
    try {
      const users = await UserModel.find()
        .select('firstname lastname profilePicture connected')
        .sort({ lastname: 1, connected: -1 })
      return users
    } catch (err) {
      throw new Error(err.message)
    }
  }

  getAllUsersConnected = async () => {
    try {
      const users = await UserModel.find({ connected: true }).select(
        'firstname lastname profilePicture',
      )
      return users
    } catch (err) {
      throw new Error(err.message)
    }
  }

  getOneUser = async (userId: string) => {
    if (!userId) throw new Error('Id not found')
    return UserModel.findById(userId)
  }

  editUser = async (id: string, userData: Partial<IUser>) => {
    try {
      const updatedUser = await UserModel.findByIdAndUpdate(id, userData, {
        new: true,
      })

      if (!updatedUser) {
        throw new Error('User not found')
      }

      return updatedUser
    } catch (err) {
      throw new Error(err.message)
    }
  }

  editPassword = async (userId: string, newPassword: string) => {
    try {
      const user = await UserModel.findById(userId)
      if (!user) throw new Error('User not found')

      //TODO CHECK IF OLD PASSWORD IS GOOD ELSE RETURN AN ERROR PASSWORD

      user.password = newPassword
      const updatedUser = await user.save()

      if (!updatedUser) {
        throw new Error('Utilisateur non trouvé')
      }

      return updatedUser
    } catch (error) {
      throw new Error(
        "Erreur lors de la mise à jour du mot de passe de l'utilisateur",
      )
    }
  }

  editProfilePhoto = async (userId: string, pictureFileName: string) => {
    try {
      const user = await UserModel.findById(userId)

      if (!user) {
        throw new Error('Utilisateur non trouvé')
      }

      const currentPicture = user.profilePicture

      if (currentPicture) {
        if (fs.existsSync(`public/uploads/${user.profilePicture}`)) {
          fs.unlinkSync(`public/uploads/${user.profilePicture}`)
        }
      }

      user.profilePicture = pictureFileName

      const updatedUser = await user.save()

      if (!updatedUser) {
        throw new Error(
          "Erreur lors de la mise à jour de la photo de profil de l'utilisateur",
        )
      }

      return updatedUser
    } catch (error) {
      throw new Error(error.message)
    }
  }

  deleteUser = async (userId: string) => {
    try {
      const deletedUser = await UserModel.findByIdAndDelete(userId)
      if (!deletedUser) {
        throw new Error('Utilisateur non trouvé')
      }
    } catch (err) {
      const error = err as MongooseError
      throw new Error(error.message)
    }
  }
}

export { UsersService }
