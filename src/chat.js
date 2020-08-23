const socket = io.connect('/')

const form = document.getElementsByClassName('form')[0]
const textInput = document.getElementsByClassName('text-input')[0]
const messageList = document.getElementsByClassName('messageList')[0]

let lastSender = ''
let currentSender = ''

function updateScroll() {
  const messageContainer = document.getElementsByClassName('chatbox')[0]
  messageContainer.scrollTop = messageContainer.scrollHeight
}

form.addEventListener('submit', (event) => {
  // Prevent Tab reloading due to form submit
  event.preventDefault()

  // GET the stored name
  let name = localStorage.getItem('NAME')
  if (name === null) name = 'Anonymous'

  // Entered message
  const message = textInput.value
  if (message === '') return

  // Send it to through web sockets
  socket.emit('send-message', { message, author: name })

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

socket.on('message', ({ message, author }) => {
  appendMessage(message, 'received-text', author)
})