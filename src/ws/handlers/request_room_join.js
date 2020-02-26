module.exports = async (data, socket, db) => {
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
    global.log.info(`Joined room ${data.room}.`, { socket: socket.id })
  }
}
