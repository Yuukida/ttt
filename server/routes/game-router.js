const express = require('express')
const GameController = require('../controllers/game-controller')
const UserController = require('../controllers/user-controller')
const router = express.Router()

const auth = (req, res, next) => {
    res.setHeader('X-CSE356', '6306cc6d58d8bb3ef7f6b85b');
    if (req.session.user){
        next()
    }else{
        return res
            .status(200)
            .send(JSON.stringify({
                status: 'ERROR',
                errorMessage: 'unauthorized'
            }))
    }
}

router.get('/', GameController.basePage)
router.get('/ttt', auth, GameController.tttPage)
router.post('/ttt/play', auth, GameController.playGame)
router.post('/listgames', auth, GameController.listgames)
router.post('/getgame', auth, GameController.getgame)
router.post('/getscore', auth, GameController.getscore)


router.get('/adduser', UserController.registerPage)
router.post('/adduser', UserController.registerUser)
router.get('/verify', UserController.verifyUser)
router.get('/login', UserController.loginPage)
router.post('/login', UserController.login)
router.post('/logout', auth, UserController.logout)

module.exports = router