// Load environment variables and global libraries
require('dotenv-safe').config()
require('colors')

const checkDbConnection = require('./src/startup/checkDbConnection')

// Startup sequence
;(async () => {
  try {
    await checkDbConnection()
  } catch (err) {
    console.error(`Startup failed: ${err}`.red)
    process.exit(1)
  }
})()
