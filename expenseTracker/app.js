require('dotenv').config()
require('express-async-errors')

const express = require('express')
const app = express()

const connectDB = require('./db/connect')
const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware =require('./middleware/error-handler')

//routes
const expenseRoutes = require('./routes/expenses')
const authRoutes = require('./routes/authRoutes')

//middleware
app.use(express.static('./public'))

//middleware to parse JSON
app.use(express.json())

//base routes
app.use('/api/v1/expenses', expenseRoutes)
app.use('/api/v1', authRoutes)

//middleware handling errors
app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 3000

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)

        app.listen(port, console.log(`Server is listening on port ${port}...`))
    } catch (error) {
        console.log(error)
    }
}

start()