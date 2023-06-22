const express = require('express')

const app = express()

const dotenv = require('dotenv')

dotenv.config()

const cors = require('cors')

app.use(cors())

app.use(express.json())

const connectDatabase = require('./config/database')
connectDatabase()

app.use(require('./routes/userProfile'))

const port = process.env.PORT || 8080
app.listen(port, () => {
    console.log(`Server is running at port no ${port}`);
})