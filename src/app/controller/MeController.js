const Course = require('../models/course')
const User = require('../models/user')
const Food = require('../models/food')


class CourseController {
    // [GET]  /me/stored/courses
    storedCourse(req,res,next){
        Promise.all([Course.find({}).lean().sortable(req), Course.countDocumentsDeleted()])
            .then(([courses, deleteCount])=>{
                res.render('./me/storeCourse', {courses, deleteCount, hidden: 'hidden'})
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
        .then(([courses, countDocument]) => res.render('./me/trashCourse', {courses, countDocument,hidden: 'hidden'}))
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
                        res.render('./me/storeFood', {foods, deleteCount, hidden: 'hidden'})
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
                    .then(([foods, countDocument]) => res.render('./me/trashFood', {foods, countDocument,hidden: 'hidden'}))
                    .catch(next)
            })
    }


}

module.exports = new CourseController();
