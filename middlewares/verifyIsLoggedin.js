const userProfileModel = require('../models/userProfile')
const jwt = require('jsonwebtoken')
const jwt_decode = require('jwt-decode')
const { jwt_saltkey, unAuthorizedMessage } = require('../utils/constant')

const verifyIsLoggedin = async (req, res, next) => {
    const authHeader = req.headers['authorization']
    if (authHeader) {
        const token = authHeader?.split(' ')[1]
        jwt.verify(token, jwt_saltkey, async (err, user) => {
            if (err)
                res.status(401).json(unAuthorizedMessage)
            else {
                const { username } = jwt_decode(token)
                const user = await userProfileModel.findOne({ username: username })
                if (user) {
                    const isTokenAvailable = user.access_token.find(item => item === token)
                    if (isTokenAvailable)
                        next()
                    else
                        res.status(401).json(unAuthorizedMessage)
                }
                else
                    res.status(401).json(unAuthorizedMessage)
            }
        })

    }
    else {
        res.status(401).json(unAuthorizedMessage)
    }

}

module.exports = verifyIsLoggedin