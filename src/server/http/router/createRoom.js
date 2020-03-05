const { createRoom } = require('../../../db')

module.exports = async (req, res, next) => {
  try {
    const requiredParameters = [
      'owner',
      'name',
      'password'
    ]

    const missingParameters = []

    // Check that all mandatory parameters were supplied
    for (const param of requiredParameters) {
      if (!req.body[param]) missingParameters.push(param)
    }

    if (missingParameters.length > 0) {
      res.status(400).send({
        message: `Bad Request; missing body parameters ${missingParameters.join(', ')}`
      })
    } else {
      const room = await createRoom(req.body.owner, req.body.name, req.body.password)
      res.status(200).send({ message: 'OK', id: room._key, joinId: room.id, name: room.name })
    }
  } catch (err) {
    global.log.error(`Could not create room: ${err}`)
    res.status(500).send({ message: 'Internal Server Error' })
  }
}
