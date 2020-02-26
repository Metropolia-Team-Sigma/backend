const db = require('../db')
const server = require('http').createServer()
const io = require('socket.io')(server)

// Initiate socket cache
const sockets = {}

module.exports = () => {
  return new Promise(resolve => {
    io.on('connection', socket => {
      global.log.debug(`Socket ${socket.id} initialised connection. Requesting identification...`)

      // Add socket to cache
      sockets[socket.id] = { hasIdentified: false }

      setTimeout(() => {
        // Check if socket is still hanging without having identified after grace period
        const potentiallyDormantSocket = sockets[socket.id]
        if (potentiallyDormantSocket && !potentiallyDormantSocket.hasIdentified) {
          global.log.warn(`Socket ${socket.id} did not identify within grace period, disconnecting.`)
          socket.emit('error', { message: 'Did not identify within timeout period' })
          socket.disconnect()
        }
      }, 3000)

      // Request identification for what room to join
      socket.emit('request_identify', {})

      socket.on('identify', async data => {
        global.log.debug(`Socket ${socket.id} identified for joining room ${data.room}.`)

        // Check if room being joined exists
        const roomExists = await db.roomExists(data.room)
        if (!roomExists) {
          global.log.warn(`Socket ${socket.id} attempted to join non-existent room ${data.room}, disconnecting.`)
          socket.emit('error', { message: 'Room not found' })
          socket.disconnect()
        } else {
          socket.join(data.room)
          socket.emit('room_connected', {})
          global.log.info(`Socket ${socket.id} joined room ${data.room}.`)
        }
      })

      socket.on('error', err => {
        global.log.error(`Socket ${socket.id} encountered error: `, err)
      })

      socket.on('disconnect', reason => {
        global.log.debug(`Socket ${socket.id} disconnected, reason: ${reason}`)
        // If socket is still in cache, delete
        if (sockets[socket.id]) delete sockets[socket.id]

        sockets[socket.id]
          ? global.log.silly(`Socket ${socket.id} flushed from cache.`)
          : global.log.silly(`Socket ${socket.id} was not in cache, skipping purge.`)
      })
    })

    const port = 3000
    server.listen(port, () => {
      global.log.info(`WebSocket server started on http://localhost:${port}.`)
      resolve()
    })
  })
}
