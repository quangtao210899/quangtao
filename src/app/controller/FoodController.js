const Food = require('../models/food')
const User = require('../models/user')
const Chat = require('../models/chat')


class FoodController {
    // [GET]  /foods/:slug
    showFood(req,res,next){
        const username = req.session.username
        const password = req.session.password
        Promise.all([
                Food.findOne({slug: req.params.slug}).lean(),
                Chat.find({}).lean(),
                User.findOne({username: username, password : password}).lean(),
            ])
            .then(([food, chats, user]) => {
                // gắn thêm id của người gọi chat để phân biệt
                for(var i = 0; i<chats.length;i++){
                    chats[i].idUser = user._id
                }
                res.render('./foods/showFood',{food,chats, user})
            })
            .catch(next)
    }
}

module.exports = new FoodController();
