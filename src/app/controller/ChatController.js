const Chat = require('../models/chat')
const User = require('../models/user')
class ChatController {
    //[GET] /
    chat(req, res,next) {
        const username = req.session.username
        const password = req.session.password
        Promise.all([User.findOne({username: username, password : password}).lean(), Chat.find({}).lean()])
            .then(([user,chats]) =>{
                // res.send('đã vào')
                for(var i = 0; i<chats.length;i++){
                    chats[i].idUser = user._id
                }
                res.render('chat',{user,chats,layout: false,})
            })
            .catch(next)
    }

    // save chat ở file index.js
}

module.exports = new ChatController();
