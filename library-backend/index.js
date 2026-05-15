require('dotenv').config()

const startServer = require('./server')
const connectToDatabase = require('./db')
const PORT = process.env.PORT || 4000
const MONGO_DB_URI = process.env.MONGO_DB_URI

const main = async()=> {
  await connectToDatabase(MONGO_DB_URI)
  startServer(PORT)
}

main()