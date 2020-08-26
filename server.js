const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000

// All static assets we want express to serve will be stored in '/public'
app.use(express.static(__dirname + '/public'))

// Serve the initial HTML file
app.get('/', (req, res) => res.sendFile(__dirname + '/public/index.html'))

const server = app.listen(PORT)
console.log('Server started on port ' + PORT)

const io = require('socket.io')(server)
io.on('connection', (socket) => {
  socket.on('send-message', (data) => {
    socket.broadcast.emit('message', { ...data })
  })
})