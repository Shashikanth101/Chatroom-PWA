const cacheName = 'chat'
const staticAssets = [
  './sw.js',
  './index.js',
  './userName.js',
  './chat.js',
  '../index.html',
  '../styles/index.css',
  '../styles/mobile.css'
]

// Installing service worker
self.addEventListener('install', (event) => {
  console.log('SW: Installed')

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

// Activating service worker
self.addEventListener('activate', (event) => {
  console.log('Activation')
  
  event.waitUntil(

    // Remove unwanted cache
    caches.keys().then(cacheNames => {

      // Loop through all cache folders in the browser
      return Promise.all(cacheNames.map(cache => {

        // Save only current cache
        if (cache !== cacheName) return caches.delete(cache)
      }))
    })
  )
})

// Make offline available
self.addEventListener('fetch', (event) => {
  console.log('Proxying any network request')
  console.log(event.request.url)

  event.respondWith(

    // Intercepts any fetch request
    // If the device is offline, the promise rejects into catch block
    // Then, the file is served from the cache storage
    caches.match(event.request).then(res => res)
  )
})