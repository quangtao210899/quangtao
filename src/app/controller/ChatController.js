const Chat = require('../models/chat')

class ChatController {
    //[GET] /
    chat(req, res,next) {
        Chat.find({})
        .lean()
        .then(chats => res.render('chat',{chats}))
        .catch(next)
    }


}

module.exports = new ChatController();
