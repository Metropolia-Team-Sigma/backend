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

      /*
        We have to use this kind of "event ping-pong" here because the server-level
        'connection' event doesn't have way to require event reception acknowledgement.
        Acks can only be required on socket-level events, which this is not.
      */

      // Add socket to cache
      socketCache[socket.id] = { room: null }

      setTimeout(() => {
        // Check if socket is still hanging without having joined a room after grace period
        const potentiallyDormantSocket = socketCache[socket.id]
        if (potentiallyDormantSocket && !potentiallyDormantSocket.room) {
          global.log.warn('Did not join room within grace period, disconnecting.', { socket: socket.id })
          socket.emit('error', { message: 'Did not join room within grace period' })
          socket.disconnect()
        }
      }, 3000)

      // Define shared state across all event handlers
      const globalState = { socket, socketCache, db }

      // Register local event handlers
      for (const event in events) {
        const handler = events[event]
        socket.on(event, eventParams => handler({ eventParams, ...globalState }))
      }

      // Event rebroadcaster to emit certain events to all non-sender clients in the room
      const globalEvents = [
        'chat_join',
        'chat_leave',
        'broadcast_key',
        'message'
      ]

      for (const event of globalEvents) {
        socket.on(event, eventParams => {
          global.log.debug(`Rebroadcasting global event ${event}.`)
          const { room } = socketCache[socket.id]
          socket.to(room).emit(event, eventParams)
        })
      }
    })

    const port = 3000
    server.listen(port, () => {
      global.log.info(`WebSocket server started on http://localhost:${port}.`)
      resolve()
    })
  })
}
