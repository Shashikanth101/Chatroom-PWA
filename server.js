const http = require('http')
const fs = require('fs')
const path = require('path')
const PORT = process.env.PORT || 3000

const server = http.createServer((req, res) => {
  let filepath = `.${req.url}`
  if (filepath === './') {
    filepath = './index.html'
  }

  // Used to map Content-Type Header for the requested file
  const map = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.webmanifest': 'application/manifest+json',
    '.png': 'image/png'
  }
  const extension = path.extname(filepath)
  const contentType = map[extension]

  // Check if the requested file exists
  fs.exists(filepath, (file_existance) => {

    // If it does not exist, send a 404 error
    if (!file_existance) {
      res.writeHead(404)
      res.write('Error: File not found')
    } 

    // Else, look for the file
    else {
      fs.readFile(filepath, (err, data) => {

        // check for 'fs' module error
        if (err) {
          res.writeHead(500)
          res.write('Server error!')
        } else {
          res.writeHead(200, { 'Content-Type': contentType })
          res.write(data, 'utf-8')
        }

        res.end()
      })
    }
  })
})

server.listen(PORT, (err) => {
  if (err) {
    console.log(err)
  } else {
    console.log(`Server started on port ${PORT}...`)
  }
})

const io = require('socket.io')(server)
io.on('connection', (socket) => {
  socket.on('send-message', (data) => {
    socket.broadcast.emit('message', { ...data })
  })
})