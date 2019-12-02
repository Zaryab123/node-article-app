const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const session = require('express-session')
const article = require('./routes/articles')
const user = require('./routes/users')
const env = require('./config/env')
const passport = require('passport')
const cookieParser = require('cookie-parser')
const app = express()

//Including Bodyparser
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

//Static directory
app.use(express.static(path.join(__dirname, 'public')))

//setting up view engine
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

//MongoDB connection
mongoose.connect(env.database,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('Connected to mongoDB')
});

//Express Session Middleware
app.use(session({
    secret: env.secretKey,
    resave: true,
    saveUninitialized: true
  }))


//including passport config file and initializing passport & session
require('./config/passport')(passport)
app.use(passport.initialize());
app.use(passport.session());

//checking whether user is login or not
app.get('*',(req,res,next) => {
    res.locals.user = (req.user)?req.user:null
    next()
})


//Express Messaging Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});  

//Using route
app.use('/article',article)
app.use('/users',user)

app.listen(3000, () => {
    console.log("Listening to 3000")
})