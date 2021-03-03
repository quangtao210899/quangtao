const User = require('../models/user')
module.exports = function checkLogin(req,res,next){
    // lấy dữ liệu trong session
    const usernameSession = req.session.username
    const passwordSession = req.session.password
    // nếu có session
    if(usernameSession!=undefined&&passwordSession!=undefined){
        User.findOne({username : usernameSession, password : passwordSession})
        .lean()
        .then(user =>{
            // nếu session thỏa mãn
            if(user!=null){
                res.redirect('/')
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
                            res.redirect('/')
                        }
                        else{
                            // Nếu cookie không thỏa mãn
                            next()
                        }
                    })   
                }
                else { // nếu không có cookie
                    next()
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
                    res.redirect('/')
                }
                else{ // nếu cookie không thỏa mãn
                    next()
                }
            })   
        }
        else { // nếu cookie không tồn tại
            next()
        }

    }

}