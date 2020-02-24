const db = require('../db')
const server = require('http').createServer()
const io = require('socket.io')(server)

server.listen(3000)

io.on('connection', socket => {
  console.debug(`Socket ${socket.id} initialised connection. Requesting identification...`.blue)

  // Request identification for what room to join
  socket.emit('request_identify', {})

  socket.on('identify', async data => {
    console.debug(`Socket ${socket.id} identified for joining room ${data.room}.`.blue)

    // Check if room being joined exists
    const roomExists = await db.roomExists(data.room)
    if (!roomExists) {
      console.warn(`Socket ${socket.id} attempted to join non-existent room ${data.room}, disconnecting.`.yellow)
      socket.emit('error', { code: 404, message: 'Room not found' })
      socket.disconnect()
    } else {
      socket.join(data.room)
      socket.emit('room_connected', {})
      console.log(`Socket ${socket.id} joined room ${data.room}.`)
    }
  })

  socket.on('error', err => {
    console.error(`Socket ${socket.id} encountered error: `.red, err)
  })

  socket.on('disconnect', reason => {
    console.debug(`Socket ${socket.id} disconnected, reason: ${reason}`.blue)
  })
})
