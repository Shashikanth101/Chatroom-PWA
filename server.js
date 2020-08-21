const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

const server = app.listen(PORT)
const io = require('socket.io')(server)
io.on('connection', (socket) => {
  socket.on('send-message', (data) => {
    socket.broadcast.emit('message', { ...data })
  })
})