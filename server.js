// modules and enviroment variables.

if (process.env.NODE_ENV !== 'production') {
    console.log('env-variables')
    require('dotenv').config()
}

//npm modules

const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const partials = require('./middleware/getPartials')
const app = express()
const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(server)
module.exports = io
const sockets = require('./sockets')
// server routes.

io.on('connection',sockets.quer)
io.on('connection',sockets.results)

const adminRoute = require('./routes/adminRo')
const authRoute = require('./routes/authRo')
const documentRoute = require('./routes/documentRo')
const homeRoute = require('./routes/homeRo')

// server uses and sets and database.

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }))
app.use(express.json())
app.use(cookieParser())

mongoose.connect(process.env.DATABASE_URL, { 
    useNewUrlParser: true,
    useUnifiedTopology: true
})
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))

// launch server and set ends.

app.use(partials.isAdmin,partials.selectLang)

app.use('/a', adminRoute)
app.use('/o', authRoute)
app.use('/d', documentRoute)
app.use('/', homeRoute)
app.use('/all/:name',homeRoute)

server.listen(process.env.PORT || 3000)