require('dotenv').config()
require('express-async-errors')

//extra security packages
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");


const express = require('express')
const app = express()

//connect DB
const connectDB = require('./db/connect')

//error handler
const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware =require('./middleware/error-handler')

const verifyToken =require('./middleware/auth')

// extra packages
app.set('trust proxy', 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, //15 minutes
    max: 100, //limit each IP to 100 req. per sec
  })
);
app.use(helmet());
app.use(cors());
app.use(xss());

//routes
const expenseRoutes = require('./routes/expenses')
const authRoutes = require('./routes/authRoutes')

//middleware
app.use(express.static('./public'))
app.use(express.json())

app.use('/api/v1', authRoutes)
//base routes
app.use('/api/v1/expenses', verifyToken, expenseRoutes)


//middleware handling errors
app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 3000

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)

        app.listen(port,() => { console.log(`Server is listening on port ${port}...`);
    });
   } catch (error) {
        console.log(error)
    }
}

start()