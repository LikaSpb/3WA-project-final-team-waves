import { set, connect } from 'mongoose'
import process from 'process'
import dotenv from 'dotenv'

dotenv.config()

const { MONGO_URI } = process.env

const connectDB = async () => {
  try {
    await connect(MONGO_URI)
    set('strictQuery', true)
  } catch (err) {
    process.exit(1)
  }
}

export default connectDB
