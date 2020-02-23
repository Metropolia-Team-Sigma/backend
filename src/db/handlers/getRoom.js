module.exports = db => {
  return async id => {
    const collection = db.collection('rooms')
    const roomExists = await collection.documentExists(id)

    if (!roomExists) throw new Error(`Room ${id} does not exist`)
    else return collection.document(id)
  }
}
