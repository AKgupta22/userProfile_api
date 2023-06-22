const mongoose = require('mongoose')

const userProfileSchema = new mongoose.Schema({
    first_name: {
        type: String,
        default: ""
    },
    last_name: {
        type: String,
        default: ""
    },
    username: {
        type: String,
        default: "",
        unique: true,
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    phone_No: {
        type: String,
        unique: true,
        default: ""
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: "user"
    },
    authCode: {
        OTP: {
            type: String,
            default: ""
        },
        isExpired: {
            type: Boolean,
            default: true
        },
        generate_time: {
            type: String,
            default: ""
        }
    },
    access_token: {
        type: Array,
        default: []
    }
})

const userProfile = mongoose.model('userProfile', userProfileSchema)

module.exports = userProfile