import mongoose from 'mongoose'

export interface IUserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>
}

export interface IUser extends mongoose.Document, IUserMethods {
  _id?: mongoose.Types.ObjectId
  firstname: string
  profilePicture: string
  lastname: string
  dateOfBirth?: Date
  email: string
  jobTitle?: string
  company?: string
  password: string
  role?: IUserRole
  token?: string
  agent?: string
  currentUser?: IUser
  connected?: boolean
  socketId?: string
}

export enum IUserRole {
  ADMIN = 2,
  AUTHENTIFICATED = 1,
  PUBLIC = 0,
}
