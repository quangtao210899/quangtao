
const Course = require('../models/course')
const User = require('../models/user')
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
                            layout: false,
                            username: req.query.username,
                            messageLogin : 'Tài khoản mật khẩu không đúng'
                        })
                    }
                    else {
                        //lưu lại vào session
                        req.session.username = req.query.username
                        req.session.password = req.query.password
                        // lưu vào cookie
                        res.cookie('username', req.query.username,{ expires: new Date(Date.now() + 60*60*24*7*1000)})
                        res.cookie('password', req.query.password,{ expires: new Date(Date.now() + 60*60*24*7*1000)})
                        // console.log(req.cookie('username'))
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
