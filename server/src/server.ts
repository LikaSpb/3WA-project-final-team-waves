import { App } from './app'
import http from 'http'
import { Server } from 'socket.io'
import dotenv from 'dotenv'
import process from 'process'
import UserModel from 'models/User.model'

dotenv.config()

const { ORIGINS, PORT } = process.env,
  app = new App(),
  appServe = app.getServer(),
  server = http.createServer(appServe),
  io = new Server(server, { cors: { origin: ORIGINS } }),
  port = Number(PORT) || 9000

io.on('connection', socket => {
  socket.on('storeConnection', async data => {
    const { id } = data
    await UserModel.findOneAndUpdate(
      { _id: id },
      { socketId: socket.id, connected: true },
    )
  })
  socket.on('disconnect', async () => {
    await UserModel.findOneAndUpdate(
      { socketId: socket.id },
      { socketId: '', connected: false },
    )
  })
})
server.listen(port, () => console.log(`🛜 Server is running on port ${port}`))

export { io }
