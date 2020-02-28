const uuid = require('uuid/v4')
const bcrypt = require('bcrypt')

const hashPassword = async plaintext => {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(plaintext, salt)
}

module.exports = (db, collection) => {
  return async (owner, name, password) => {
    return collection.save({
      _key: uuid(),
      name: name,
      createdAt: new Date(),
      owner: owner,
      password: await hashPassword(password),
      members: [],
      bans: []
    }, { returnNew: true }).new
  }
}
