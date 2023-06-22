
const express = require('express')
const router = express.Router()
const verifyIsLoggedin = require('../middlewares/verifyIsLoggedin')
const verifyIsAdmin = require('../middlewares/verifyIsAdmin')
const userProfileControllers = require('../controllers/userProfile')

router.post('/register', userProfileControllers.createUser)
router.post('/login', userProfileControllers.userLogin)
router.get('/users', verifyIsLoggedin, verifyIsAdmin, userProfileControllers.getUsers)

module.exports = router
