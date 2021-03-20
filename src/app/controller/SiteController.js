
const Course = require('../models/course')
const Food = require('../models/food')
const User = require('../models/user')

var nodemailer = require('nodemailer');


// thư viện xử lý ảnh
const Jimp = require('jimp');


async function resize(linkImage) {
    // Read the image.
    const image = await Jimp.read(linkImage);
    // Resize the image to width 1200 and heigth 800.
    await image.resize(1200, 800);
    // Save and overwrite the image
    await image.writeAsync(linkImage);
}
class SiteController {
    // [GET] /home
    home(req, res, next) {
        const username = req.session.username
        const password = req.session.password
        var user,foods;
        Promise.all([
                User.findOne({username: username, password : password}).lean(), 
                Food.find({}).lean(),
            ])
            .then(([user1, foods1]) =>{
                user = user1
                foods = foods1
                for(var i = 0; i < foods.length; i++){
                    if(!foods[i].resize){
                        var image = "./src/public/"+ foods[i].image
                        resize(image)
                        Food.updateOne({_id: foods[i]._id}, {resize: '1'}).then()
                    }
                }

            })
            .then(()=>{
                res.render('home',{user, foods})
            })
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
                        res.render('loginLogout/login', {
                            layout: false,
                            username: req.query.username,
                            messageLogin : 'Tài khoản mật khẩu không đúng'
                        })
                    }
                    else {
                        //lưu lại vào session
                        req.session.username = req.query.username
                        req.session.password = req.query.password
                        req.session.fullname = user.firstname + ' ' + user.lastname
                        if(req.query.remember=='remember'){
                            // lưu vào cookie
                            res.cookie('username', req.query.username,{ expires: new Date(Date.now() + 60*60*24*7*1000)})
                            res.cookie('password', req.query.password,{ expires: new Date(Date.now() + 60*60*24*7*1000)})
                        }
                        // console.log(req.cookie('username'))
                        res.redirect('/')
                    }
                })
                .catch(next)
        }
        else {
            res.render('loginLogout/login', {layout: false})
        }
    }
    // [get] /logout
    logout(req, res, next) {
        //xóa session
        req.session.username = ''
        req.session.password = ''
        //xóa cookie
        res.clearCookie('username')
        res.clearCookie('password')
        res.redirect('login')
    }

    // [get] /register
    register(req, res, next) {
        res.render('loginLogout/register', {layout: false} )
    }

    // [POST] /register
    saveRegister(req, res, next) {
        console.log(res.query)
        const user = new User(req.body)
        user.save()
            .then(()=>res.redirect('/'))
            .catch(next)
    }


    // [GET] /forgot/
    forgotAccount(req, res, next) {
        if(req.query.hasOwnProperty('username')){
            User.findOne({username: req.query.username})
            .then(user=>{
                if(user!=null){
                    const option = {
                        service: 'gmail',
                        auth: {
                            user: 'tao.nq173356@gmail.com', // email hoặc username
                            pass: 'qtltcmmmhbbn' // password
                        }
                    };
                    var transporter = nodemailer.createTransport(option);
                    
                    transporter.verify(function(error, success) {
                        // Nếu có lỗi.
                        if (error) {
                            next
                        } else { //Nếu thành công.
                            var mail = {
                                from: 'tao.nq173356@gmail.com', // Địa chỉ email của người gửi
                                to: '', // Địa chỉ email của người gửi
                                subject: 'Mail thông báo Mật Khẩu ', // Tiêu đề mail
                                text: '', // Nội dung mail dạng text
                            };
                            // xác định lại giá trị của mail
                            mail.to = user.username
                            mail.text = 'Mật khẩu của bạn là: ' + user.password
                            //Tiến hành gửi email
                            transporter.sendMail(mail, function(error, info) {
                                if (error) { // nếu có lỗi
                                    next
                                } else { //nếu thành công
                                    res.redirect('login')
                                }
                            });
                        }
                    });               
                }
                else {
                    res.render('loginLogout/forgot',{layout: false, messageForgot: 'User không tồn tại', username: req.query.username, })
                }
            })
            .catch(next)
        }
        else {
            res.render('loginLogout/forgot',{layout: false})
        }
        // const option = {
        //     service: 'gmail',
        //     auth: {
        //         user: 'tao.nq173356@gmail.com', // email hoặc username
        //         pass: 'qtltcmmmhbbn' // password
        //     }
        // };
        // var transporter = nodemailer.createTransport(option);
        
        // transporter.verify(function(error, success) {
        //     // Nếu có lỗi.
        //     if (error) {
        //         next
        //     } else { //Nếu thành công.
        //         var mail = {
        //             from: 'tao.nq173356@gmail.com', // Địa chỉ email của người gửi
        //             to: 'tao.nq173356@sis.hust.edu.vn', // Địa chỉ email của người gửi
        //             subject: 'Thư được gửi bằng Node.js', // Tiêu đề mail
        //             text: 'Chào bạn nhé', // Nội dung mail dạng text
        //         };
        //         //Tiến hành gửi email
        //         transporter.sendMail(mail, function(error, info) {
        //             if (error) { // nếu có lỗi
        //                 next
        //             } else { //nếu thành công
        //                 res.redirect('login')
        //             }
        //         });
        //     }
        // });
    }

}

module.exports = new SiteController();
