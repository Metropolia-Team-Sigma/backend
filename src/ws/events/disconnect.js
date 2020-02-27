module.exports = state => {
  const { eventParams, socket, socketCache } = state
  const reason = eventParams
  global.log.debug(`Disconnected, reason: ${reason}`, { socket: socket.id })

  // If socket is still in cache, delete
  if (socketCache[socket.id]) delete socketCache[socket.id]
  global.log.silly(socketCache[socket.id] ? 'Flushed from cache.' : 'Was not in cache, skipping purge.', { socket: socket.id })
}
