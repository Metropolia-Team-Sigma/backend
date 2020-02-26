const winston = require('winston')

const generatePrefix = info => {
  let prefix

  if (info.socket) prefix = `[socket ${info.socket}]`
  else prefix = '[sigma-backend]'

  return `${prefix} ${info.level}: ${info.message}`
}

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'debug' ? 'silly' : 'info',
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.simple(),
    winston.format.printf(info => generatePrefix(info))
  ),
  transports: [
    new winston.transports.Console()
  ]
})

global.log = logger
