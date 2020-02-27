const db = require('../db')
const server = require('http').createServer()
const io = require('socket.io')(server)
const events = require('./events')

// Initiate socket cache
const socketCache = {}

module.exports = () => {
  return new Promise(resolve => {
    io.on('connection', socket => {
      global.log.debug('Initialised connection. Waiting for room join...', { socket: socket.id })

      // Add socket to cache
      socketCache[socket.id] = { hasJoined: false }

      setTimeout(() => {
        // Check if socket is still hanging without having joined a room after grace period
        const potentiallyDormantSocket = socketCache[socket.id]
        if (potentiallyDormantSocket && !potentiallyDormantSocket.hasJoined) {
          global.log.warn('Did not join room within grace period, disconnecting.', { socket: socket.id })
          socket.emit('error', { message: 'Did not join room within grace period' })
          socket.disconnect()
        }
      }, 3000)

      // Define shared state across all event handlers
      const globalState = { socket, socketCache, db }

      // Register event handlers
      for (const event in events) {
        const handler = events[event]
        socket.on(event, eventParams => handler({ eventParams, ...globalState }))
      }
    })

    const port = 3000
    server.listen(port, () => {
      global.log.info(`WebSocket server started on http://localhost:${port}.`)
      resolve()
    })
  })
}
