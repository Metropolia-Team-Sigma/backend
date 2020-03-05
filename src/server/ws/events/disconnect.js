const parseDisconnectReason = reason => {
  switch (reason) {
    case 'transport error': return 'Transport error'
    case 'server namespace disconnect': return 'Server-initiated manual disconnect'
    case 'client namespace disconnect': return 'Client-initiated manual disconnect'
    case 'transport close': return 'Client stopped sending data'
    case 'ping timeout': return 'Client did not respond within ping timeout period'
  }
}

module.exports = state => {
  const { eventParams, socket, socketCache } = state
  const reason = eventParams

  global.log.debug(`Disconnected, reason: ${parseDisconnectReason(reason)}`, { socket: socket.id })

  // If socket is still in cache, delete
  if (socketCache[socket.id]) delete socketCache[socket.id]
  global.log.silly(socketCache[socket.id] ? 'Flushed from cache.' : 'Was not in cache, skipping purge.', { socket: socket.id })
}
