const User = require('../models/user')
const Notification = require('../models/notification')

module.exports = function checkSessionCookie(req,res,next){
    // lấy dữ liệu trong session
    const usernameSession = req.session.username
    const passwordSession = req.session.password
    res.locals.isLogin = 0
    // nếu có session
    if(usernameSession!=undefined&&passwordSession!=undefined){
        User.findOne({username : usernameSession, password : passwordSession})
        .lean()
        .then(user =>{
            // nếu session thỏa mãn
            if(user!=null){
                Notification.find({idUserTo: user._id})
                    .sort({updatedAt: 'desc'})
                    .lean()
                    .then(notification=>{
                        res.locals._notificationLocal= notification
                        res.locals._idUserLocal= user._id
                        res.locals._fullname = user.firstname +" "+ user.lastname
                        res.locals.isLogin = 1;
                        if(req.session.timeLogin==undefined){
                            var time = new Date().getTime()
                            req.session.timeLogin = user._id+'_'+time
                            res.locals.timeLogin = user._id+'_'+time
                        }
                        next()
                    })
            }
            else { // Nếu session không thỏa mãn
                // lấy cookie
                const usernameCookie = req.cookies.username
                const passwordCookie = req.cookies.password
                // nếu có cookie
                if(usernameCookie&&passwordCookie){
                    
                    User.findOne({username : usernameCookie, password : passwordCookie})
                    .lean()
                    .then(user =>{
                        // Nếu cookie thỏa mãn
                        if(user!=null){
                            Notification.find({idUserTo: user._id})
                                .sort({updatedAt: 'desc'})
                                .lean()
                                .then(notification=>{
                                    res.locals._idUserLocal= user._id
                                    res.locals._notificationLocal= notification
                                    res.locals._fullname = user.firstname +" "+ user.lastname
                                    res.locals.isLogin = 1;
                                    if(req.session.timeLogin==undefined){
                                        var time = new Date().getTime()
                                        req.session.timeLogin = user._id+'_'+time
                                        res.locals.timeLogin = user._id+'_'+time
                                    }
                                    next()
                                })
                        }
                        else{
                            // Nếu cookie không thỏa mãn
                            res.redirect('/login')
                        }
                    })   
                }
                else { // nếu không có cookie
                    res.redirect('/login')
                }
            }
        })
    }
    else { // Nếu không có session
        // lấy dữ liệu trong cookie
        const usernameCookie = req.cookies.username
        const passwordCookie = req.cookies.password
        // Nếu cookie có tồn tại
        if(usernameCookie&&passwordCookie){
            User.findOne({username : usernameCookie, password : passwordCookie})
            .lean()
            .then(user =>{
                // nếu cookie thỏa mãn
                if(user!=null){
                    // Lưu lại vào session
                    req.session.username = usernameCookie
                    req.session.password = passwordCookie 
                    if(req.session.timeLogin==undefined){
                        var time = new Date().getTime()
                        req.session.timeLogin = user._id+'_'+time
                        res.locals.timeLogin = user._id+'_'+time
                    }
                    req.session.timeLogin = req.query.username+time
                    Notification.find({idUserTo: user._id})
                        .sort({updatedAt: 'desc'})
                        .lean()
                        .then(notification=>{
                            res.locals._idUserLocal= user._id
                            res.locals._notificationLocal= notification
                            res.locals._fullname = user.firstname +" "+ user.lastname
                            res.locals.isLogin = 1;
                            next()
                        })
                }
                else{ // nếu cookie không thỏa mãn
                    res.redirect('/login')
                }
            })   
        }
        else { // nếu cookie không tồn tại
            res.redirect('/login')
        }

    }

}