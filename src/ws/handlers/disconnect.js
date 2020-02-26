module.exports = (reason, socket, socketCache) => {
  global.log.debug(`Disconnected, reason: ${reason}`, { socket: socket.id })
  // If socket is still in cache, delete
  if (socketCache[socket.id]) delete socketCache[socket.id]

  socketCache[socket.id]
    ? global.log.silly('Flushed from cache.', { socket: socket.id })
    : global.log.silly('Was not in cache, skipping purge.', { socket: socket.id })
}
