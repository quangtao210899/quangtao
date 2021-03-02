const User = require('../models/user')

module.exports = function checkSessionCookie(req,res,next){
    // lấy dữ liệu trong session
    const usernameSession = req.session.username
    const passwordSession = req.session.password
    // kiểm tra tồn tại session hay không
    if(usernameSession!=undefined&&passwordSession!=undefined){
        User.findOne({username : usernameSession, password : passwordSession})
        .lean()
        .then(user =>{
            if(user!=null){
                res.redirect('/')
            }
            else {
                next()
            }
        })
    }
    else {
        // lấy dữ liệu trong cookie
        const usernameCookie = req.cookies.username
        const passwordCookie = req.cookies.password
        // kiểm tra tồn tại cookie
        if(usernameCookie&&passwordCookie){
            User.findOne({username : usernameCookie, password : passwordCookie})
            .lean()
            .then(user =>{
                if(user!=null){
                    res.redirect('/')
                }
                else{
                    next()
                }
            })   
        }
        else {
            next()
        }

    }

}