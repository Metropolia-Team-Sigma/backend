module.exports = (db, collection) => {
  return async room => {
    const getRoomByHRI = require('./getRoomByHRI')(db, collection)
    return !!getRoomByHRI(room)
  }
}
