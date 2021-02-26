const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
var methodOverride = require('method-override')

const route = require('./router/indexRoute');
const db    = require('./config/db/indexDB')

const app = express();
const port = 3000;

// Connect DB
db.connect();

// override with POST having ?_method=DELETE
app.use(methodOverride('_method'))

// static file sử dụng public
app.use(express.static(path.join(__dirname, 'public')));

// sử dụng dữ liệu trong phương thức post
app.use(
    express.urlencoded({
        extended: true,
    }),
);
app.use(express.json());

// HTTP logger
//app.use(morgan('combined'))

// Template engine
app.engine(
    '.hbs', 
    exphbs({ 
        extname: '.hbs' ,
        helpers: {
            sum: (a,b) => a+b,
        }
    })
);
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'resource/views'));

// router init
route(app);

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
