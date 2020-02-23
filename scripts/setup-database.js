require('dotenv-safe').config()

console.log('Running database setup...')

const driver = require('arangojs')(process.env.ARANGO_URI)
driver.useBasicAuth(process.env.ARANGO_USER, process.env.ARANGO_PASS)

driver.listDatabases().then(async databases => {
  if (databases.includes(process.env.ARANGO_DATABASE)) {
    console.log('Database exists, checking for collection "rooms"...')
    driver.useDatabase(process.env.ARANGO_DATABASE)

    return driver.listCollections()
  } else {
    console.log('Database does not exist, creating...')
    await driver.createDatabase(process.env.ARANGO_DATABASE)

    console.log('Database created, creating collection "rooms"...')
    driver.useDatabase(process.env.ARANGO_DATABASE)

    return driver.listCollections()
  }
}).then(async collections => {
  const collectionNames = collections.map(collection => collection.name)

  if (collectionNames.includes('rooms')) console.log('Collection "rooms" already exists.')
  else {
    await driver.collection('rooms').create()
    console.log('Collection "rooms" has been created.')
  }
})
