const userProfileModel = require('../models/userProfile')
const joi = require('joi')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { jwt_saltkey } = require('../utils/constant')
const { excludedUserKeys } = require('../utils/constant')

const postUserSchema = joi.object({
    email: joi.string()
        .email({ tlds: { allow: false } })
        .required()
        .messages({
            'string.email': 'Please enter a valid email address',
        }),
    password: joi.string()
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,30}$/)
        .required()
        .messages({
            'string.pattern.base': 'Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character',
        })
}).strict()

const createUser = async (req, res) => {
    const { error } = postUserSchema.validate(req.body)
    if (error) {
        res.status(500).json({ status: 0, message: error.details[0].message })
    }
    else {
        try {
            let access_token = ""
            const data = new userProfileModel(req.body)
            bcrypt.hash(req.body.password, 12, async function (err, hash) {
                if (err)
                    res.status(500).json({ status: 0, message: "Something went wrong while hashing password" })
                else {
                    data.username = req.body.email
                    data.password = hash
                    access_token = jwt.sign({ username: data.username, role: data.role }, jwt_saltkey, { expiresIn: '7d' })
                    data.access_token.push(access_token)
                    await data.save()
                    res.json({ status: 1, message: "User created successfully", data: { access_token: access_token } })
                }
            })
        }
        catch (e) {
            if (e.keyValue)
                res.status(403).json({ status: 0, message: "User already exist with similar details" })
            else
                res.status(500).json({ status: 0, message: "Something went wrong" })
        }
    }
}

const userLogin = async (req, res) => {
    const { error } = postUserSchema.validate(req.body)
    if (error) {
        res.status(500).json({ status: 0, message: error.details[0].message })
    }
    else {
        try {
            const { email, password } = req.body
            const user = await userProfileModel.findOne({ email: email })
            if (user) {

                bcrypt.compare(password, user.password, async (err, isCorrectPassword) => {
                    if (err)
                        res.status(500).json({ status: 0, message: "Something went wrong" })
                    else {
                        if (isCorrectPassword) {
                            const access_token = jwt.sign({ username: user.username, role: user.role }, jwt_saltkey, { expiresIn: '7d' })
                            user.access_token.push(access_token)
                            await user.save()
                            res.json({ status: 1, message: "login successfull", data: { access_token: access_token } })
                        }
                        else
                            res.status(401).json({ status: 0, message: "Invalid password" })
                    }
                })
            }
            else
                res.status(404).json({ status: 0, message: "Enter a valid email or password" })
        }
        catch (e) {
            res.status(500).json({ status: 0, message: "Something went wrong" })
        }
    }
}

const getUsers = async (req, res) => {
    try {
        const data = await userProfileModel.find().select(excludedUserKeys)
        res.json({ status: 1, message: "success", data: data })
    }
    catch (e) {
        res.status(500).json({ status: 0, message: "Something went wrong" })
    }
}

module.exports = {
    createUser,
    userLogin,
    getUsers
}