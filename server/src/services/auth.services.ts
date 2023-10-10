import { LoginUserDto, UserDto } from '../dtos/users.dto'
import { IUser } from '../interfaces/users.interface'
import UserModel from '../models/User.model'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { HydratedDocument } from 'mongoose'
import { Request } from 'express'
import { io } from '../server'

export class AuthService {
  socket = io

  login = async (loginData: LoginUserDto, req: Request) => {
    const user: HydratedDocument<IUser> = await UserModel.findOne({
      email: loginData.email,
    })

    if (!user) {
      throw new Error("L'utilisateur n'existe pas.")
    }

    const isPasswordValid = await bcrypt.compare(
      loginData.password,
      user.password,
    )

    if (!isPasswordValid) {
      throw new Error('Mot de passe incorrect.')
    }

    user.agent = req.headers['user-agent']
    user.markModified('agent')
    await user.save()

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        agent: req.headers['user-agent'],
      },
      process.env.SECRET_KEY,
    )

    return {
      user: {
        _id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        role: user.role,
      },
      token,
    }
  }

  createUser = async (userData: UserDto): Promise<IUser> => {
    const hashedPassword = await bcrypt.hash(userData.password, 10)
    const newUser = new UserModel({
      ...userData,
      password: hashedPassword,
    })

    try {
      const savedUser = await newUser.save()
      return savedUser
    } catch (error) {
      throw new Error('Error creating user: ' + error.message)
    }
  }

  logout = async (userId: string): Promise<void> => {
    try {
      await UserModel.findByIdAndUpdate(userId, {
        connected: false,
        agent: '',
        socketId: '',
      })
    } catch (error) {
      throw new Error('Erreur lors de la déconnexion : ' + error.message)
    }
  }

  saveAgent = async (userId: string, agent: string): Promise<void> => {
    try {
      const user: HydratedDocument<IUser> = await UserModel.findById(userId)
      if (user) {
        const hashedAgent = await bcrypt.hash(agent, 10)
        user.agent = hashedAgent
        await user.save()
      } else {
        throw new Error('User not found')
      }
    } catch (error) {
      throw new Error('Error saving agent: ' + error.message)
    }
  }
}
