const Course = require('../models/course')
const User = require('../models/user')
const Food = require('../models/food')
const Order = require('../models/order')


class CourseController {
    // [GET]  /me/stored/courses
    storedCourse(req,res,next){
        Promise.all([Course.find({}).lean().sortable(req), Course.countDocumentsDeleted()])
            .then(([courses, deleteCount])=>{
                res.render('./me/storeCourse', {courses, deleteCount, hidden: 'none'})
            })
            .catch(next)

    }
    // [GET]  /me/info
    profile(req,res,next){
        var usernameSession = req.session.username
        var passwordSession = req.session.password
        User.findOne({username: usernameSession, password: passwordSession})
            .lean()
            .then(user=>{
                res.render('./me/profile', {user})
            })  

    }



    // [GET]  /me/trash/courses
    getTrashCourse(req,res,next){
        Promise.all([Course.findDeleted({}).lean(), Course.countDocuments()])
        .then(([courses, countDocument]) => res.render('./me/trashCourse', {courses, countDocument,hidden: 'none'}))
        .catch(next)
    }

    // [GET]  /me/stored/foods
    storedFood(req,res,next){
        var usernameSession = req.session.username
        var passwordSession = req.session.password
        User.findOne({username: usernameSession, password: passwordSession})
            .lean()
            .then(user=>{
                Promise.all([Food.find({idUser: user._id}).lean().sortable(req), Food.countDocumentsDeleted({idUser: user._id})])
                    .then(([foods, deleteCount])=>{
                        res.render('./me/storeFood', {foods, deleteCount, hidden: 'none'})
                    })
                    .catch(next)
            })
    }

    // [GET]  /me/trash/foods
    getTrashFood(req,res,next){
        var usernameSession = req.session.username
        var passwordSession = req.session.password
        User.findOne({username: usernameSession, password: passwordSession})
            .lean()
            .then(user=>{
                Promise.all([Food.findDeleted({idUser: user._id}).lean().sortable(req), Food.countDocuments({idUser: user._id}).lean()])
                    .then(([foods, countDocument]) => res.render('./me/trashFood', {foods, countDocument,hidden: 'none'}))
                    .catch(next)
            })
    }
    // [GET]  /me/stored/message
    storedOrder(req,res,next){
        var usernameSession = req.session.username
        var passwordSession = req.session.password
        User.findOne({username: usernameSession, password: passwordSession})
            .lean()
            .then(user=>{
                Order.find({idUser: user._id}).lean()
                    .sort({createdAt: 'desc'})
                    .then(orders=>{
                        res.render('./me/storedOrder', {user,orders,hidden: 'none'})
                    })
            })  
    }

    // [GET]  /me/stored/restaurant
    restaurantInfo(req,res,next){
        var usernameSession = req.session.username
        var passwordSession = req.session.password
        var foods;
        var countUserVote = 0;
        var countStarVote = 0;
        var foodNameMaxVoteStar =''
        User.findOne({username: usernameSession, password: passwordSession})
            .lean()
            .then(user=>{
                Food.find({idUser: user._id}).lean()
                    .then(Foods=>{
                        foods=Foods
                        var maxVoteStarFood = 0
                        for(var i = 0; i < foods.length; i++){
                            if(foods[i].userVote){
                                countUserVote+= foods[i].userVote.length
                                var countStarFood = 0
                                for(var j = 0; j < foods[i].userVote.length; j++){
                                    countStarVote+= parseInt(foods[i].userVote[j].vote)
                                    countStarFood+= parseInt(foods[i].userVote[j].vote)
                                }
                                var voteStarFood=0
                                if(foods[i].userVote.length>0){
                                    voteStarFood = countStarFood/foods[i].userVote.length
                                }
                                if(voteStarFood>maxVoteStarFood){
                                    maxVoteStarFood=voteStarFood
                                    foodNameMaxVoteStar= foods[i].foodName
                                }
                            }
                        }
                    })
                    .then(()=>{
                        var voteStar = 0;
                        if(countUserVote>0){
                            voteStar = Math.round((countStarVote/countUserVote) * 100) / 100
                        }
                        res.render('./me/restaurant/restaurantInfo', {user,foods,voteStar,foodNameMaxVoteStar,hidden: 'none'})
                    })
            })  
            .catch(next)
    }


}

module.exports = new CourseController();
