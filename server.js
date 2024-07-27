import path from "path";
import { createServer } from "http";
import express from "express";
import { Server } from "socket.io";

import formatMessage from "./utils/messages.js";
import { currentUser, userJoin, roomUsers, userLeft } from "./utils/users.js";

const app = express()

const __dirname = path.resolve()
app.use(express.static(path.join(__dirname, 'public')))

const server = createServer(app)
const io = new Server(server);

const admin = "Admin"
io.on('connection', (socket) => {
    socket.on('joinRoom', ({ username, room }) => {

        const user = userJoin(socket.id, username, room)
        socket.join(user.room)

        // socket.emit('message', formatMessage(admin, `Welcome message for ${user.username}`))

        socket.broadcast.to(user.room)
        .emit('message', formatMessage(admin, `${user.username} has joined`))

        io.to(user.room).emit('roomUsers', {
            room:user.room,
            users:roomUsers(user.room)
        })
    })

    socket.on('chatMsg', (msg) => {
        const user = currentUser(socket.id)
        io.to(user.room).emit('message', formatMessage(`${user.username}`, msg))
    })
    socket.on('disconnect', () => {
        const user = userLeft(socket.id)
        if(user){
            io.to(user.room)
            .emit('message', formatMessage(admin, `${user.username} has been disconnected`))

            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: roomUsers(user.room)
            })
        }
        
    })

})

server.listen(3000, () => {
    console.log("Server running")
})