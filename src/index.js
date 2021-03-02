const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
const methodOverride = require('method-override')
var cookieSession = require('cookie-session')
const cookieParser = require('cookie-parser')


const route = require('./router/indexRoute');
const db    = require('./config/db/indexDB')
const Chat = require('./app/models/chat')
const sortMiddleware = require('./app/middlewares/sortMiddleware')

const app = express();
const port = 3000;


var  server = require('http').createServer(app)
var io = require('socket.io')(server)



// Connect DB
db.connect();
// session cookie
app.set('trust proxy', 1)
app.use(cookieSession({
    name: 'session',
    keys: ['key1', 'key2']
}))

//Khai báo sử dụng middleware cookieParse()
app.use(cookieParser())

// custom middleware
app.use(sortMiddleware)
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

// hiển thị json
app.use(express.json());

// HTTP logger
//app.use(morgan('combined'))

// Template engine
app.engine(
    '.hbs', 
    exphbs({ 
        extname: '.hbs' ,
        helpers: require('./helpers/handlebar')
    })
);
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'resource/views'));

// router init
route(app);


//Tạo socket và gửi message
io.on('connection', function(client){
    client.on('join', function(data){
        console.log('Đã kết nối được với client')
    })

    client.on('messages', function(data, idPerson){
        // thông báo cho client
        client.emit('thread', data, idPerson)
        // thông báo cho các client khác
        client.broadcast.emit('thread', data, idPerson)
        //save chat to the database
        let chatMessage = new Chat({text: data, idPerson: idPerson});
        chatMessage.save();
    })
    
})


server.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
