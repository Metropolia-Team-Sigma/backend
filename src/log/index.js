const winston = require('winston')

const logger = winston.createLogger({
  level: process.env.NODE_ENV !== 'production' ? 'silly' : 'info',
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.simple()
  ),
  transports: [
    new winston.transports.Console()
  ]
})

global.log = logger
