require('dotenv-safe').config()
require('colors')

console.log('Running database setup...'.green)

const driver = require('arangojs')(process.env.ARANGO_URI)
driver.useBasicAuth(process.env.ARANGO_USER, process.env.ARANGO_PASS)

const db = process.env.ARANGO_DATABASE
const coll = 'rooms'

driver.listDatabases().then(async databases => {
  if (databases.includes(db)) {
    console.log(`Database "${db}" exists, checking for collection "${coll}"...`.green)
    driver.useDatabase(db)

    return driver.listCollections()
  } else {
    console.log(`Database "${db}" does not exist, creating...`.yellow)
    await driver.createDatabase(db)
    console.log(`Database "${db}" created, creating collection "${coll}"...`.green)
    driver.useDatabase(process.env.ARANGO_DATABASE)

    return driver.listCollections()
  }
}).then(async collections => {
  const collectionNames = collections.map(collection => collection.name)

  if (collectionNames.includes(coll)) console.log(`Collection "${coll}" exists.`.green)
  else {
    console.log(`Collection "${coll}" does not exist, creating...`.yellow)
    await driver.collection(coll).create()
    console.log(`Collection "${coll}" created.`.green)
  }

  console.log('Finished!'.green)
})
