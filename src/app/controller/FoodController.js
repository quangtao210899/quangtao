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
                User.findOne({username: username, password : password}).lean(),
            ])
            .then(([food, user]) => {
                Chat.find({
                    $or: [
                        {$and: [{idUserFrom: user._id}, {idUserTo: food.idUser}, {idFood: food._id}]},
                        {$and: [{idUserFrom: food.idUser}, {idUserTo: user._id}, {idFood: food._id}]},
                    ]})
                    .lean()
                    .then((chats)=>{
                        for(var i = 0; i<chats.length;i++){
                            chats[i].idUser = user._id
                        }
                        res.render('./foods/showFood',{food,chats,user})
                    })
                    .catch(next)
            })
            .catch(next)
    }

    // [GET]  /foods/create
    create(req, res, next){
        res.render('foods/create', {hidden: 'hidden'})
    }

    // [POST]  /foods/store
    store(req, res, next){
        const username = req.session.username
        const password = req.session.password
        User.findOne({username: username, password : password})
            .lean()
            .then(user=>{
                req.body.idUser = user._id;
                const food = new Food(req.body)
                food.save()
                    .then(()=> res.redirect('/'))
                    .catch(next)
            })
            .catch(next)
    }
}

module.exports = new FoodController();
