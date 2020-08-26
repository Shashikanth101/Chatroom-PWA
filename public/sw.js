const cacheName = 'chat'
const staticAssets = [
  './index.html',
  './src/index.js',
  './src/userName.js',
  './src/chat.js',
  './styles/index.css',
  './styles/mobile.css'
]

// Installing service worker
self.addEventListener('install', (event) => {
  console.log('SW: Installed')
})

// Activating service worker
self.addEventListener('activate', (event) => {
  console.log('SW: Activated')

  // Tells the browser not to terminate the SW until the passed promised is resolved
  event.waitUntil(

    // Open the cache folder
    caches.open(cacheName).then(cache => {

      // Cache static assets
      cache.addAll(staticAssets).then(() => console.log('Files cached successfully'))
      .catch(err => console.log(err))

      // Skip waiting
    }).then(() => self.skipWaiting())
  )
})

// Make offline available
self.addEventListener('fetch', (event) => {
  event.respondWith(

    // Intercepts any fetch request
    // If the device is offline, the promise rejects into catch block
    // Then, the file is served from the cache storage
    caches.match(event.request).then(res => {
      if (res) return res
      else return fetch(event.request)
    })
  )
})