const stringify = require('node-stringify')

module.exports = async state => {
  const { eventParams, socket, socketCache, db } = state

  // Sanitise room to string in case other types of data were passed
  // Using external module as JSON.stringify(undefined) > undefined
  if (typeof eventParams.room !== 'string') eventParams.room = stringify(eventParams.room)

  global.log.debug(`Requested to join room ${eventParams.room}.`, { socket: socket.id })

  // Check if room being joined exists
  const roomExists = await db.roomExists(eventParams.room)
  if (!roomExists) {
    global.log.warn(`Attempted to join non-existent room ${eventParams.room}, disconnecting.`, { socket: socket.id })
    socket.emit('error', { message: 'Room not found' })
    socket.disconnect()
  } else {
    socket.join(eventParams.room)
    socket.emit('room_joined', {})
    socketCache[socket.id].hasJoined = true
    global.log.info(`Joined room ${eventParams.room}.`, { socket: socket.id })
  }
}
