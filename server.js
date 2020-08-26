const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000

// All static assets we want express to serve will be stored in '/public'
app.use(express.static(__dirname + '/public'))

// Serve the initial HTML file
app.get('/', (req, res) => res.sendFile(__dirname + '/public/index.html'))

// Start the srever to listen for requests
const server = app.listen(PORT)

// Web socket server
const io = require('socket.io')(server)
io.on('connection', (socket) => {

  // When a user sends a message
  socket.on('send-message', data => socket.broadcast.emit('message', { ...data }))

  // When a certain user is typing the message
  socket.on('typing', user => socket.broadcast.emit('typing', { ...user }))
})