const stringify = require('node-stringify')

module.exports = async (data, socket, db) => {
  // Sanitise room to string in case other types of data were passed
  // Using external module as JSON.stringify(undefined) > undefined
  const room = stringify(data.room)

  global.log.debug(`Requested to join room ${room}.`, { socket: socket.id })

  // Check if room being joined exists
  const roomExists = await db.roomExists(room)
  if (!roomExists) {
    global.log.warn(`Attempted to join non-existent room ${room}, disconnecting.`, { socket: socket.id })
    socket.emit('error', { message: 'Room not found' })
    socket.disconnect()
  } else {
    socket.join(room)
    socket.emit('room_joined', {})
    global.log.info(`Joined room ${room}.`, { socket: socket.id })
  }
}
