module.exports = state => {
  const { eventParams, socket } = state
  const err = eventParams
  global.log.error(`Encountered error: ${err.message}`, { socket: socket.id })
}
