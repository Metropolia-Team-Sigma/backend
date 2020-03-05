const express = require('express')
const helmet = require('helmet')
const router = require('./router')

const app = express()

// Setup middleware
app.use(express.json())
app.use(helmet({ noCache: true }))
app.use('/rooms', router)

module.exports = () => {
  return new Promise(resolve => {
    app.listen(process.env.HTTP_PORT, () => {
      global.log.info(`HTTP server started on http://localhost:${process.env.HTTP_PORT}.`)
      resolve()
    })
  })
}
