const express = require('express')
const GameController = require('../controllers/game-controller')
const UserController = require('../controllers/user-controller')
const router = express.Router()

router.get('/', GameController.basePage)
router.get('/ttt', GameController.tttPage)
router.post('/ttt/play', GameController.playGame)

module.exports = router