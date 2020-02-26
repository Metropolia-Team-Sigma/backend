const stringify = require('node-stringify')

module.exports = async (data, socket, socketCache, db) => {
  // Sanitise room to string in case other types of data were passed
  // Using external module as JSON.stringify(undefined) > undefined
  if (typeof data.room !== 'string') data.room = stringify(data.room)

  global.log.debug(`Requested to join room ${data.room}.`, { socket: socket.id })

  // Check if room being joined exists
  const roomExists = await db.roomExists(data.room)
  if (!roomExists) {
    global.log.warn(`Attempted to join non-existent room ${data.room}, disconnecting.`, { socket: socket.id })
    socket.emit('error', { message: 'Room not found' })
    socket.disconnect()
  } else {
    socket.join(data.room)
    socket.emit('room_joined', {})
    socketCache[socket.id].hasJoined = true
    global.log.info(`Joined room ${data.room}.`, { socket: socket.id })
  }
}
