const mongoose = require("mongoose")
require('dotenv').config()

const MONGO_DB_URL = process.env.MONGO_DB_URL

async function connnectToDb() {
    mongoose.connect(MONGO_DB_URL)

    mongoose.connection.on("connected", () => {
        (`Mongo Db Database Connected Succesfully`)
    })

    mongoose.connection.on("error", (err) => {
        (`Error connecting to the database`)
        (`${err}`)
    })
}

module.exports = connnectToDb 
