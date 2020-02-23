const uuid = require('uuid/v4')
const bcrypt = require('bcrypt')

const hashPassword = async plaintext => {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(plaintext, salt)
}

module.exports = db => {
  return async (owner, name, password) => {
    const collection = db.collection('rooms')
    return collection.save({
      _key: uuid(),
      name: name,
      createdAt: new Date(),
      owner: owner,
      password: await hashPassword(password),
      messages: [],
      members: [],
      bans: []
    }, { returnNew: true }).new
  }
}
