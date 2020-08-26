window.addEventListener('load', () => {
  registerSW()
})

async function registerSW() {
  if ('serviceWorker' in navigator) {
    try {
      const result = await navigator.serviceWorker.register('../service-worker.js')
      console.log('service worker registered')
    } catch (err) {
      console.log(err)
      console.log('Service worker registration failed!')
    }
  }
}