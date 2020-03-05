const uuid = require('uuid/v4')
const bcrypt = require('bcrypt')
const { hri } = require('human-readable-ids')

const hashPassword = async plaintext => {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(plaintext, salt)
}

const getUniqueHRI = async (db, collection) => {
  const findRoom = require('./findRoom')(db, collection)
  const humanReadableId = hri.random()
  const idIsTaken = await findRoom('id', humanReadableId).length > 0

  if (idIsTaken) global.log.warn('Generated duplicate HRI, re-rolling...')

  // Re-run until unique ID is reached
  return !idIsTaken ? humanReadableId : getUniqueHRI(db, collection)
}

module.exports = (db, collection) => {
  return async (owner, name, password) => {
    const room = await collection.save({
      _key: uuid(),
      name: name,
      id: await getUniqueHRI(db, collection),
      createdAt: Date.now(),
      owner: owner,
      password: await hashPassword(password),
      members: [],
      bans: []
    }, { returnNew: true })
    return room.new
  }
}
