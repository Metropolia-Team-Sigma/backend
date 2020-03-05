const handlers = require('require-directory')(module)
const router = require('express').Router()

router.get('/:id', (req, res, next) => handlers.joinRoom(req, res, next))
router.post('/create', (req, res, next) => handlers.createRoom(req, res, next))

module.exports = router
