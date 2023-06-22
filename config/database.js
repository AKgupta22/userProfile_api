const mongoose = require('mongoose')
const { db_url } = require('../utils/constant')

const connectDatabase = async () => {
    mongoose.set('strictQuery', true)
    try {
        await mongoose.connect(db_url)
        console.log('database is connected');
    }
    catch (e) {
        console.log('Error while connecting database');
    }
}

module.exports = connectDatabase