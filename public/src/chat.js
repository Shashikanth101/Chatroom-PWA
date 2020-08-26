const socket = io.connect('/')

const form = document.getElementsByClassName('form')[0]
const textInput = document.getElementsByClassName('text-input')[0]
const messageList = document.getElementsByClassName('messageList')[0]
const typingIndicator = document.getElementsByClassName('typing-indicator')[0]

let lastSender = ''
let currentSender = ''
let name = ''

function updateScroll() {
  const messageContainer = document.getElementsByClassName('chatbox')[0]
  messageContainer.scrollTop = messageContainer.scrollHeight
}

textInput.addEventListener('keyup', (event) => {

  // GET the stored name
  if (name === '') name = localStorage.getItem('NAME')
  if (name === null) name = 'Anonymous'

  // Emit a typing event if the input is not blank
  if (event.target.value !== '') {
    socket.emit('typing', { author: name, typing: true })
  } else {
    socket.emit('typing', { author: name, typing: false })
  }
})

form.addEventListener('submit', (event) => {
  // Prevent Tab reloading due to form submit
  event.preventDefault()

  // GET the stored name
  if (name === '') name = localStorage.getItem('NAME')
  if (name === null) name = 'Anonymous'

  // Entered message
  const message = textInput.value
  if (message === '') return

  // Send it to through web sockets
  socket.emit('send-message', { message, author: name })

  // Emit typing stopped event
  socket.emit('typing', { author: name, typing: false })

  // Update UI
  appendMessage(message, 'sent-text', '')
  textInput.value = ''
})

function appendMessage(message, style, from) {
  const sender = document.createElement('span')
  const newMessage = document.createElement('span')
  currentSender = from

  // New message
  sender.innerText = currentSender === lastSender ? '' : from
  newMessage.innerText = message

  // Add styles
  sender.setAttribute('class', 'author')
  newMessage.setAttribute('class', `${style} text`)

  // Update UI
  sender.innerText !== '' && messageList.appendChild(sender)
  messageList.appendChild(newMessage)
  updateScroll()
  lastSender = from
}

// Received message event
socket.on('message', ({ message, author }) => {
  appendMessage(message, 'received-text', author)
})

// Typing event
socket.on('typing', ({ author, typing }) => {
  if (typing) {
    typingIndicator.innerText = `${author} is typing...`
  } else {
    typingIndicator.innerText = ''
  }
})