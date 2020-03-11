const {
  roomExists,
  getRoom,
  roomExistsHRI,
  getRoomByHRI,
  deleteRoom
} = require('../../../db')

module.exports = async (req, res, next) => {
  try {
    const isHRI = /\w+-\w+-\d+/.test(req.params.id)

    const exists = isHRI
      ? await roomExistsHRI(req.params.id)
      : await roomExists(req.params.id)

    if (!exists) {
      res.status(404).send({ message: 'Not Found' })
    } else {
      const { owner, _key } = isHRI ? await getRoomByHRI(req.params.id) : await getRoom(req.params.id)
      const isOwner = owner === req.body.owner

      if (isOwner) {
        await deleteRoom(_key)
        res.status(200).send({ message: 'OK', address: `http://${process.env.WS_HOST}:${process.env.WS_PORT}` })
      } else {
        res.status(401).send({ message: 'Unauthorized' })
      }
    }
  } catch (err) {
    global.log.error(`Could not join room ${req.params.id}: ${err}`)
    res.status(500).send({ message: 'Internal Server Error' })
  }
}
