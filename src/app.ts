import express, { Application, RequestHandler } from 'express'
import http from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import { handleError } from './utils/errorHandler'
import userRoutes from './routes/userRoutes'
import propertyRoutes from './routes/propertyRoutes'
import { getPresignedUrl, removeFile } from './utils/fileUpload'

dotenv.config()

const app: Application = express()
const server = http.createServer(app)
const requestLogger: RequestHandler = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`)
  next()
}

app.use(requestLogger)

app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'archination.netlify.app',
      'https://schoolingsocial.com',
      'https://schooling-client-v1.onrender.com',
    ],
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'socket-id'],
  })
)

const io = new Server(server, {
  cors: {
    origin: [
      'http://localhost:3001',
      'https://schoolingsocial.netlify.app',
      'https://schoolingsocial.com',
    ],
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ['websocket', 'polling'],
})

io.on('connection', (socket) => {
  console.log(`✅ User connected: ${socket.id}`)

  socket.on('message', async (data) => {
    switch (data.to) {
      case 'chat':
        break

      default:
        break
    }
  })

  socket.on('disconnect', () => {
    console.log(`❌ User disconnected.: ${socket.id}`)
  })
})

app.use(bodyParser.json())
app.use('/api/v1/s3-delete-file', removeFile)
app.use('/api/v1/s3-presigned-url', getPresignedUrl)
app.use('/api/v1/users', userRoutes)
app.use('/api/v1/properties', propertyRoutes)
app.get('/api/v1/user-ip', (req, res) => {
  let ip: string | undefined

  const forwarded = req.headers['x-forwarded-for']

  if (typeof forwarded === 'string') {
    ip = forwarded.split(',')[0]
  } else if (Array.isArray(forwarded)) {
    ip = forwarded[0]
  } else {
    ip = req.socket?.remoteAddress || undefined
  }
  if (ip?.startsWith('::ffff:')) {
    ip = ip.replace('::ffff:', '')
  }
  res.json({ ip })
})
app.get('/api/v1/network', (req, res) => {
  try {
    res.status(200).json({ message: `network` })
  } catch (error) {
    res.status(400).json({ message: `no network` })
  }
})

app.use((req, res, next) => {
  handleError(res, 404, `Request not found: ${req.method} ${req.originalUrl}`)
  next()
})

export { app, server, io }
