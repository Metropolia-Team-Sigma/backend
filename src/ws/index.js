const db = require('../db')
const server = require('http').createServer()
const io = require('socket.io')(server)
const handlers = require('./handlers')

// Initiate socket cache
const socketCache = {}

module.exports = () => {
  return new Promise(resolve => {
    io.on('connection', socket => {
      global.log.debug('Initialised connection. Requesting identification...', { socket: socket.id })

      // Add socket to cache
      socketCache[socket.id] = { hasIdentified: false }

      // Request identification for what room to join
      socket.emit('request_identify', {})

      setTimeout(() => {
        // Check if socket is still hanging without having identified after grace period
        const potentiallyDormantSocket = socketCache[socket.id]
        if (potentiallyDormantSocket && !potentiallyDormantSocket.hasIdentified) {
          global.log.warn('Did not identify within grace period, disconnecting.', { socket: socket.id })
          socket.emit('error', { message: 'Did not identify within timeout period' })
          socket.disconnect()
        }
      }, 3000)

      // Register event handlers
      socket.on('identify', async data => handlers.identify(data, socket, db))
      socket.on('error', err => handlers.error(err, socket))
      socket.on('disconnect', reason => handlers.disconnect(reason, socket, socketCache))
    })

    const port = 3000
    server.listen(port, () => {
      global.log.info(`WebSocket server started on http://localhost:${port}.`)
      resolve()
    })
  })
}
