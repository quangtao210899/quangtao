
const Course = require('../models/course')
const User = require('../models/user')
const {mutilMongooseToObject} = require('../../until/mongoose')
class SiteController {
    // [GET] /home
    home(req, res, next) {
        // callback
        // Course.find({}, function(err, Courses){
        //     if(!err){
        //         res.json(Courses)
        //     }
        //     else {
        //         next(err);
        //     }
        // })

        // promise
        Course.find({})
            .lean()  // clean lại course trc khi render
            .then(courses => res.render('home', {courses,}))
            .catch(next)
    }

    // [GET] /search
    search(req, res) {
        res.render('search');
    }

    // [POST] /search
    searchPost(req, res) {
        console.log(req.body);
        res.send('Đã gửi thành công!');
    }

    // [GET] /login
    login(req, res, next) {
        if(req.query.username!=null&&req.query.password!=null){
            User.findOne({username: req.query.username, password: req.query.password})
                .lean()
                .then(user=>{
                    if(user==null){
                        res.render('login', {
                            messageLogin : 'tài khoản mật khẩu không đúng'
                        })
                    }
                    else {
                        res.redirect('/')
                    }
                })
                .catch(next)
        }
        else {
            res.render('login', {layout: false})
        }
    }

}

module.exports = new SiteController();
