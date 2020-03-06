const stringify = require('node-stringify')
const { roomExists, roomExistsHRI } = require('../../../db')

module.exports = async state => {
  const { eventParams, socket, socketCache } = state

  // Sanitise room to string in case other types of data were passed
  // Using external module as JSON.stringify(undefined) > undefined
  if (typeof eventParams.room !== 'string') eventParams.room = stringify(eventParams.room)

  global.log.debug(`Requested to join room ${eventParams.room}.`, { socket: socket.id })

  const isHRI = /\w+-\w+-\d+/.test(eventParams.room)

  // Check if room being joined exists
  const exists = isHRI ? await roomExistsHRI(eventParams.room) : await roomExists(eventParams.room)
  if (!exists) {
    global.log.warn(`Attempted to join non-existent room ${eventParams.room}, disconnecting.`, { socket: socket.id })
    socket.emit('error', { message: 'Room not found' })
    socket.disconnect()
  } else {
    socket.join(eventParams.room)
    socket.emit('room_join', {})
    socketCache[socket.id].room = eventParams.room
    global.log.info(`Joined room ${eventParams.room}.`, { socket: socket.id })
  }
}
