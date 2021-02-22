const express = require('express')
const morgan  = require('morgan')
const exphbs  = require('express-handlebars')
const path    = require('path')


const route   = require('./router/indexRoute');


const app     = express()
const port    = 3000

// static file sử dụng public
app.use(express.static(path.join(__dirname,'public')))

// sử dụng dữ liệu trong phương thức post
app.use(express.urlencoded({
  extended: true
}))
app.use(express.json())

// HTTP logger
//app.use(morgan('combined'))

// Template engine
app.engine('.hbs', exphbs({extname: '.hbs'}));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'resource/views'));

// router init
route(app);


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})