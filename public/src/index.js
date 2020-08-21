const firstTimePage = document.getElementById('firstTimePage')
const nameForm = document.getElementsByClassName('nameForm')[0]
const nameInput = document.getElementsByClassName('nameInput')[0]

nameForm.addEventListener('submit', (event) => {
  event.preventDefault()
  const enteredName = nameInput.value
  localStorage.setItem('NAME', enteredName)
  firstTimePage.setAttribute('class', 'firstPage')
  firstTimePage.style.display = 'none'
})

nameForm.addEventListener('reset', (event) => {
  event.preventDefault()
  nameInput.value = ''
})

const userName = localStorage.getItem('NAME')
if (userName === null) {
  firstTimePage.style.display = ''
}