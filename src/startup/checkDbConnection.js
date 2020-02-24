module.exports = async () => {
  try {
    const db = require('arangojs')(process.env.ARANGO_URI)
    db.useDatabase(process.env.ARANGO_DATABASE)
    await db.login(process.env.ARANGO_USER, process.env.ARANGO_PASS)
  } catch (err) {
    throw new Error(`Could not connect to database: ${err}`)
  }
}
