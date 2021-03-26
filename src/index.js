const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
const methodOverride = require('method-override')
const cookieSession = require('cookie-session')
const cookieParser = require('cookie-parser')
// thư viện xử lý ảnh
const Jimp = require('jimp');


const route = require('./router/indexRoute');
const db    = require('./config/db/indexDB')
const Chat = require('./app/models/chat')
const User = require('./app/models/user')
const Food = require('./app/models/food')
const Notification = require('./app/models/notification')
const sortMiddleware = require('./app/middlewares/sortMiddleware');

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



// hàm resize ảnh

async function resize(linkImage, filename, date) {
    // Read the image.
    const image = await Jimp.read(linkImage);
    // Resize the image to width 1200 and heigth 800.
    await image.resize(315, 315);
    // Save and overwrite the image
    await image.writeAsync(`./src/public/uploads/profile/${date}-quangtao-${filename}`);
}


//Tạo socket và gửi message
io.on('connection', function(client){
    client.on('join', function(data){
        console.log('Đã kết nối được với client')
    })

    client.on('messages', function(data, idUserFrom, idUserTo, idFood){
        // thông báo cho client
        client.emit('thread', data, idUserFrom, idUserTo, idFood)
        // thông báo cho các client khác
        client.broadcast.emit('thread', data, idUserFrom, idUserTo, idFood)

        // thông báo cho client
        client.emit('header', idUserTo)
        // thông báo cho các client khác
        client.broadcast.emit('header', idUserTo)


        //save chat to the database
        let chatMessage = new Chat({text: data, idUserFrom: idUserFrom, idUserTo: idUserTo, idFood: idFood});
        chatMessage.save();

        // lưu thông báo
        Notification.findOne({type: 'message', idUserTo: idUserTo})
            .lean()
            .then(notification=>{
                if(notification==null){
                    let newNotification= new Notification({
                        type: 'message', idUserTo: idUserTo, content: '1'
                    })
                    newNotification.save()
                }
                else {
                    var content = notification.content
                    content = parseInt(content)
                    content++
                    Notification.findOneAndUpdate(
                        {type: 'message', idUserTo: idUserTo},
                        {content: content}
                    )
                        .lean()
                        .then()
                }
            })

            // type: 'message', idUser: idUserTo, idUserFrom: idUserFrom, idFood: idFood
    })

    client.on('changeNotificationMessageToZero',function(idUser){
        Notification.findOneAndDelete({type: 'message', idUserTo: idUser})
            .lean()
            .then()
    })


    //save thông tin profile
    client.on('saveInfoUser', function(userID, firstname, lastname, phone, gender){
        User.updateOne(
            {_id: userID},
            { firstname: firstname, lastname: lastname, phone: phone, gender: gender}
        )
        .then()
    })

    // resize ảnh
    client.on('previewFileProfile', function(userID, file, filename){
        var date = Date.now()
        resize(file, filename, date)
        User.updateOne(
            {_id: userID},
            { image: `/uploads/profile/${date}-quangtao-${filename}`}
        )
        .then()        
    })

    // save new password
    client.on('saveNewPassword', function(newPassword, userID){
        User.updateOne(
            {_id: userID},
            {password: newPassword}
        )
        .then()        
    })
    //add newAddress
    client.on('addAddressUser', function(UserID, newAddress){
        User.findById(UserID)
            .lean()
            .then(user=>{
                var address = user.address
                if(!address){
                    address=[{address: newAddress}]
                }
                else{
                    var a = {address: newAddress}
                    address.push(a)
                }
                User.updateOne({_id: UserID}, {address: address})
                    .then(()=>{
                        User.findById(UserID)
                            .then(user=>{
                                var count = user.address.length-1
                                client.emit('newIdAddress', user.address[count]._id)
                            })
                    })
            })      
    })

    //delete address
    client.on('deleteAddress', function(UserID, addressID){
        User.findById(UserID)
            .lean()
            .then(user=>{
                var kt = -1;
                var address = user.address
                for(var i = 0; i < address.length; i++){
                    if(address[i]._id==addressID){
                        kt=i 
                        break
                    }
                }
                if(kt!=-1){
                    address.splice(i,1)
                    User.updateOne({_id: UserID}, {address: address}).then()
                }
            })      
    })

    // update address
    client.on('updateAddress', function(UserID, addressID, text){
        User.findById(UserID)
            .lean()
            .then(user=>{
                var kt = -1;
                var address = user.address
                for(var i = 0; i < address.length; i++){
                    if(address[i]._id==addressID){
                        kt=i 
                        break
                    }
                }
                if(kt!=-1){
                    address[kt].address = text
                    User.updateOne({_id: UserID}, {address: address}).then()
                }
            })  
    })

    // vote star food
    client.on('userVote', function(userID, vote, foodID){
        Food.findById(foodID)
            .lean()
            .then(food=>{
                var userVote = food.userVote
                if(userVote){
                    var kt=0;
                    for(var i = 0; i < userVote.length; i++){
                        if(userVote[i].userId==userID) {
                            kt=1; 
                            userVote[i].vote = vote
                            break;
                        }
                    }
                    if(kt){
                        Food.updateOne({_id: foodID}, {userVote: userVote})
                        .then()
                    }
                    else{
                        userVote.push({userId: userID, vote: vote})
                        Food.updateOne({_id: foodID}, {userVote: userVote})
                            .then()
                    }
                }
                else{
                    var UserVote = []
                    UserVote.push({userId: userID, vote: vote})
                    Food.updateOne({_id: foodID}, {userVote: UserVote})
                        .then()
                }
            })
    })




})






server.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
