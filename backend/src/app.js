require('dotenv').config()
require('./strategies/discord')

const express = require('express')
const passport = require('passport')
const mongoose = require('mongoose')
const session = require('express-session')
const mongoStore = require('connect-mongo')(session)

const app = express()
const PORT = process.env.PORT || 3002
const routes = require('./routes')

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
mongoose.set('useCreateIndex', true)

app.use(
  session({
    secret: 'secret',
    cookie: {
      maxAge: 60000 * 60 * 24,
    },
    resave: false,
    saveUninitialized: false,
    store: new Store({ mongooseConnection: mongoose.connection }),
  })
)

app.use(passport.initialize())
app.use(passport.session())
app.use('/api', routes)

app.listen(PORT, () => console.log(`Running on Port ${PORT}`))
