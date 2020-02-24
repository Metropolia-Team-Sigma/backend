const fs = require('fs-extra')
const path = require('path')
const db = require('arangojs')(process.env.ARANGO_URI)

db.useDatabase(process.env.ARANGO_DATABASE)
db.useBasicAuth(process.env.ARANGO_USER, process.env.ARANGO_PASS)

// Define this here as it is shared across handlers
const collection = db.collection('rooms')

const handlers = fs.readdirSync(path.join(__dirname, 'handlers'))

for (const handler of handlers) {
  module.exports[handler.split('.')[0]] = require(path.join(__dirname, 'handlers', handler))(db, collection)
}
