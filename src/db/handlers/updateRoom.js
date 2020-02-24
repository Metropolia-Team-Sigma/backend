const roomExists = require('./roomExists')

module.exports = (db, collection) => {
  return async (id, toUpdate) => {
    if (!roomExists()) throw new Error(`Room ${id} does not exist`)
    else return collection.update(id, toUpdate)
  }
}
