const db_url = process.env.db_url
const jwt_saltkey = process.env.saltkey
const excludedUserKeys = ['-password', '-access_token', '-authCode', '-__v']
const unAuthorizedMessage = { status: 0, message: "Unauthorized request" }

module.exports = {
    db_url,
    jwt_saltkey,
    excludedUserKeys,
    unAuthorizedMessage
}