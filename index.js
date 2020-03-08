// Load environment variables and global libraries
require('colors')
require('./src/log')

try {
  require('dotenv-safe').config()
} catch (err) {
  global.log.error(`Loading of environment values failed: ${err}`)
  process.exit(1)
}

const checkDbConnection = require('./src/startup/checkDbConnection')
const startHttpServer = require('./src/server/http')
const startWebSocketServer = require('./src/server/ws')

// Startup sequence
;(async () => {
  try {
    await checkDbConnection()
    await startHttpServer()
    await startWebSocketServer()
    global.log.info('Startup complete, Sigma is ready for business!')
  } catch (err) {
    global.log.error(`Startup failed: ${err}`.red)
    process.exit(1)
  }
})()
