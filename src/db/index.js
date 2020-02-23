const fs = require('fs-extra')
const path = require('path')
const db = require('arangojs')(process.env.ARANGO_URI)

db.useDatabase(process.env.ARANGO_DATABASE)
db.useBasicAuth(process.env.ARANGO_USER, process.env.ARANGO_PASS)

const handlers = fs.readdirSync(path.join(__dirname, 'handlers'))

for (const handler of handlers) {
  module.exports[handler.split('.')[0]] = require(path.join(__dirname, 'handlers', handler))(db)
}
