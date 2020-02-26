const winston = require('winston')

const generatePrefix = info => {
  let prefix

  if (info.socket) prefix = `[socket ${info.socket}]`
  else prefix = '[sigma-backend]'

  return `${prefix} ${info.level}: ${info.message}`
}

let level

switch (process.env.NODE_ENV) {
  case 'debug': level = 'debug'; break
  case 'silly': level = 'silly'; break
  default: level = 'info'
}

const logger = winston.createLogger({
  level,
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
