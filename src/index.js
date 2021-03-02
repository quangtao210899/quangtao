const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
const methodOverride = require('method-override')


const route = require('./router/indexRoute');
const db    = require('./config/db/indexDB')
const Chat = require('./app/models/chat')
const sortMiddleware = require('./app/middlewares/sortMiddleware')

const app = express();
const port = 3000;


var  server = require('http').createServer(app)
var io = require('socket.io')(server)

// app.get('/chat',function(req,res,ext){
//     res.sendFile(__dirname+'/resource/views/chat.hbs')
// })

// Connect DB
db.connect();

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

    client.on('messages', function(data){
        // thông báo cho client
        client.emit('thread',data)
        // thông báo cho các client khác
        client.broadcast.emit('thread',data)
        //save chat to the database
        let chatMessage = new Chat({text: data, idPerson: 'taonq'});
        chatMessage.save();
    })
    
})


server.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
