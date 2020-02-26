module.exports = (err, socket) => {
  global.log.error(`Encountered error: ${err.message}`, { socket: socket.id })
}
