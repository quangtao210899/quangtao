
const Course = require('../models/course')
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

    // [GET] /Search
    search(req, res) {
        res.render('search');
    }

    // [POST] /search
    searchPost(req, res) {
        console.log(req.body);
        res.send('Đã gửi thành công!');
    }
}

module.exports = new SiteController();
