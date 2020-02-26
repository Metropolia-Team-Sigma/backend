// Load environment variables and global libraries
require('dotenv-safe').config()
require('colors')
require('./src/log')

const checkDbConnection = require('./src/startup/checkDbConnection')
const startWsServer = require('./src/ws')

// Startup sequence
;(async () => {
  try {
    await checkDbConnection()
    await startWsServer()
    global.log.info('Startup complete, Sigma is ready for business!')
  } catch (err) {
    global.log.error(`Startup failed: ${err}`.red)
    process.exit(1)
  }
})()
