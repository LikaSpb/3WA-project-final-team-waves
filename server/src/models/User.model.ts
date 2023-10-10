import mongoose, { Document, Schema } from 'mongoose'
import { IUser, IUserRole } from '../interfaces/users.interface'
import bcrypt from 'bcrypt'

const userSchema = new Schema<IUser>({
  firstname: {
    type: String,
    required: true,
    unique: true,
  },
  lastname: {
    type: String,
    required: true,
    unique: true,
  },
  profilePicture: {
    type: String,
    required: false,
  },
  dateOfBirth: {
    type: Date,
    required: false,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  jobTitle: {
    type: String,
    required: false,
  },
  company: {
    type: String,
    required: false,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: Number,
    default: IUserRole.AUTHENTIFICATED,
    enum: IUserRole,
  },
  agent: {
    type: String,
    required: false,
  },
  connected: {
    type: Boolean,
    default: false,
  },
  socketId: {
    type: String,
    required: false,
  },
})


userSchema.pre('save', async function (next) {
  if (!this.isModified('password') && !this.isModified('agent')) return next()

  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10)
  }

  if (this.isModified('agent')) {
    this.agent = await bcrypt.hash(this.agent, 10)
  }

  next()
})

userSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password)
}

export default mongoose.model('User', userSchema)
