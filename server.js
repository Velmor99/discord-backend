const express = require('express');
const http = require('http')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()

const socketServer = require('./socketServer')
const authRoutes = require('./routes/authRoutes')
const friendInvitationRoutes = require('./routes/friendInvitationRoutes')

const PORT = process.env.API_PORT;

const app = express()
app.use(express.json())
const allowedOrigins = ["http://localhost:3000/", "https://velmor99.github.io/"]
app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true, // Allow cookies & authentication headers
        methods: ["GET", "POST", "PUT", "DELETE"],
    })
)

app.use('/api/auth', authRoutes)
app.use('/api/friend-invitation', friendInvitationRoutes);

const server = http.createServer(app)
//тут мы непосредственно запускаем сервер на сокетах
socketServer.registerSocketServer(server)

const connection = async () => {
    try {
        const connected = await mongoose.connect(process.env.MONGODB_URL)
        if (connected) {
            console.log("Database connected")
        }
        await server.listen(PORT, () => {
            console.log(`Server is listening on port ${PORT}`)
        })
    } catch (error) {
        console.log(error)
    }
}

connection()
