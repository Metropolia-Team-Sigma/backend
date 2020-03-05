const bcrypt = require('bcrypt')
const { roomExists, getRoom, findRoom } = require('../../../db')

module.exports = async (req, res, next) => {
  try {
    const isHRI = /\w+-\w+-\d+/.test(req.params.id)

    const exists = isHRI
      ? !await findRoom('id', req.params.id).length > 0
      : !await roomExists(req.params.id)

    if (!exists) {
      res.status(404).send({ message: 'Not Found' })
    } else {
      const { password } = isHRI ? await findRoom('id', req.params.id, true) : await getRoom(req.params.id)
      const passwordIsCorrect = await bcrypt.compare(req.query.p, password)

      if (passwordIsCorrect) res.status(200).send({ message: 'OK', address: `http://${process.env.WS_HOST}:${process.env.WS_PORT}` })
      else res.status(401).send({ message: 'Unauthorized' })
    }
  } catch (err) {
    global.log.error(`Could not join room ${req.params.id}: ${err}`)
    res.status(500).send({ message: 'Internal Server Error' })
  }
}
