module.exports = (db, collection) => {
  const roomExists = require('./roomExists')(db, collection)

  return async id => {
    if (!roomExists(id)) throw new Error(`Room ${id} does not exist`)
    else return collection.remove(id)
  }
}
