module.exports = (db, collection) => {
  return async hri => {
    const findRoom = require('./findRoom')(db, collection)
    return findRoom('id', hri, true)
  }
}
