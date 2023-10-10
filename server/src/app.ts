import express, { Express } from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import authRoutes from './router/auth.routes'
import usersRoutes from './router/user.routes'
import cookieParser from 'cookie-parser'
import connectDB from './config/db'
import { Server } from 'socket.io'
import postRoutes from './router/post.routes'
import process from 'process'
import commentRoutes from './router/comment.routes'
import { errorHandler } from './middlewares/errorHandler.middleware'
import { CODERESPONSE } from './constants/CodeResponse'
import path from 'path'

dotenv.config()

const { ORIGINS } = process.env

export class App {
  public app: Express
  public port: number
  socket: any
  io: Server

  constructor() {
    this.app = express()
    connectDB().then(() => console.log('💾 Connected to MongoDB'))
    this.initializeMiddlewares()
    this.initRouter()
    this.initHandlerError()
  }

  private initializeMiddlewares() {
    this.app
      .use(express.json())
      .use(express.urlencoded({ extended: true }))
      .use(cors({ origin: ORIGINS, credentials: true }))
      .use(cookieParser())
  }

  private initRouter() {
    this.app.use('/auth', authRoutes)
    this.app.use('/users', usersRoutes)
    this.app.use('/pictures', express.static('public/uploads'))
    this.app.use('/uploads', express.static('public/uploads'))

    this.app.use('/posts', postRoutes)
    this.app.use('/comments', commentRoutes)
  }

  private initHandlerError() {
    this.app.use((req, res, next) => {
      res.status(CODERESPONSE.BAD_REQUEST).json({ error: 'Invalid request' })
    })
    this.app.use(errorHandler)
  }

  public getServer() {
    return this.app
  }
}
