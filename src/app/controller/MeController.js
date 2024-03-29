const Course = require('../models/course')
const User = require('../models/user')
const Food = require('../models/food')
const Order = require('../models/order')
const order = require('../models/order')


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

    // [GET]  /me/restaurant/info
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

    // [GET]  /me/restaurant/prepare
    restaurantPrepare(req,res,next){
        var usernameSession = req.session.username
        var passwordSession = req.session.password
        User.findOne({username: usernameSession, password: passwordSession})
            .lean()
            .then(user=>{
                Order.find({idAuthor: user._id, state:'prepare'}).lean()
                    .sort({createdAt: 'asc'})
                    .then(orders=>{
                        var page = 'Đơn hàng đang chuẩn bị'
                        var activePrepare = 'activeLi'
                        res.render('./me/restaurant/order', {user,orders,page,activePrepare, hidden: 'none'})
                    })
            })  
    }

    // [GET]  /me/restaurant/shipping
    restaurantShipping(req,res,next){
        var usernameSession = req.session.username
        var passwordSession = req.session.password
        User.findOne({username: usernameSession, password: passwordSession})
            .lean()
            .then(user=>{
                Order.find({idAuthor: user._id, state:'shipping'}).lean()
                    .sort({createdAt: 'asc'})
                    .then(orders=>{
                        var page = 'Đơn hàng đang giao'
                        var activeShipping = 'activeLi'
                        res.render('./me/restaurant/order', {user,orders,page,activeShipping, hidden: 'none'})
                    })
            })  
    }


    // [GET]  /me/restaurant/sold
    restaurantSold(req,res,next){
        var usernameSession = req.session.username
        var passwordSession = req.session.password
        User.findOne({username: usernameSession, password: passwordSession})
            .lean()
            .then(user=>{
                Order.find({idAuthor: user._id, state:'sold'}).lean()
                    .sort({createdAt: 'desc'})
                    .then(orders=>{
                        var page = 'Đơn hàng đã bán'
                        var activeSold = 'activeLi'
                        res.render('./me/restaurant/order', {user,orders,page,activeSold, hidden: 'none'})
                    })
            })  
    }

    // [GET]  /me/restaurant/cancelled
    restaurantCancelled(req,res,next){
        var usernameSession = req.session.username
        var passwordSession = req.session.password
        User.findOne({username: usernameSession, password: passwordSession})
            .lean()
            .then(user=>{
                Order.find({idAuthor: user._id, state:'cancelled'}).lean()
                    .sort({createdAt: 'desc'})
                    .then(orders=>{
                        var page = 'Đơn hàng đã hủy'
                        var activeCancelled = 'activeLi'
                        res.render('./me/restaurant/order', {user,orders,page,activeCancelled, hidden: 'none'})
                    })
            })  
    }

    // [GET]  /me/restaurant/Statistical
    restaurantStatistical(req,res,next){
        var usernameSession = req.session.username
        var passwordSession = req.session.password
        User.findOne({username: usernameSession, password: passwordSession})
            .lean()
            .then(user=>{
                Order.find({idAuthor: user._id}).lean()
                    .then(orders=>{
                        var countOrderPrepare = 0
                        var countOrderShipping = 0
                        var countOrderSold = 0
                        var countOrderCancelled = 0
                        var turnover = 0 
                        var idUserArray=[];
                        for(var i = 0; i< orders.length; i++){
                            if(orders[i].state=='prepare'){
                                countOrderPrepare++
                            }
                            else if(orders[i].state=='shipping'){
                                countOrderShipping++
                            }
                            else if(orders[i].state=='sold'){
                                countOrderSold++
                                turnover+=parseInt(orders[i].cost)
                                if(!idUserArray.includes(orders[i].idUser)){
                                    idUserArray.push(orders[i].idUser)
                                }
                            }
                            else if(orders[i].state=='cancelled'){
                                countOrderCancelled++
                            }
                        }
                        var countUserOrder = idUserArray.length
                        res.render('./me/restaurant/statistical', 
                            {
                                user,orders, hidden: 'none', turnover,
                                countOrderPrepare, countOrderShipping,
                                countOrderSold, countOrderCancelled,
                                countUserOrder,
                            })
                    })
            })  
    }
}

module.exports = new CourseController();
