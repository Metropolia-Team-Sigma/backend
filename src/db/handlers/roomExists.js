module.exports = (db, collection) => {
  return async id => {
    return collection.documentExists(id)
  }
}
