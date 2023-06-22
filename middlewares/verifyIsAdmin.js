const userProfileModel = require('../models/userProfile')
const jwt = require('jsonwebtoken')
const jwt_decode = require('jwt-decode')
const { jwt_saltkey, unAuthorizedMessage } = require('../utils/constant')

const verifyIsAdmin = async (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader?.split(' ')[1]
    const { username } = jwt_decode(token)
    const user = await userProfileModel.findOne({ username: username })
    if (user.role === 'admin')
        next()
    else
        res.status(401).json(unAuthorizedMessage)
}

module.exports = verifyIsAdmin