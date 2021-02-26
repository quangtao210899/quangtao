
const mongoose = require('../../until/mongoose')
const Course = require('../models/course')

class CourseController {
    // [GET]  /courses/:slug
    showAllCourse(req,res,next){
        Course.findOne({slug: req.params.slug})
            .lean()
            .then(course => {
                res.render('./courses/showAllCourse',{course})
            })
            .catch(next)
    }

    // [GET]  /courses/create
    create(req,res,next){
        res.render('./courses/create')
    }

    // [POST]  /courses/store
    store(req,res,next){
        // thêm ảnh bằng videoID
        req.body.image = `https://img.youtube.com/vi/${req.body.videoID}/sddefault.jpg`

        const course = new Course(req.body);
        course.save()
            .then(()=> res.redirect('/me/stored/courses'))
            .catch(error =>{

            })
    }

    // [GET]  /courses/:id/edit
    edit(req,res,next){
        Course.findById(req.params.id)
            .lean()
            .then(course => {
                res.render('./courses/edit', {course})
            })
            .catch(next)
    }

    // [PUT]  /courses/:id
    update(req,res,next){
       //res.json(req.body);
       Course.updateOne({ _id: req.params.id}, req.body)
            .then(()=> {
                res.redirect('/me/stored/courses')
            })
            .catch(next)
    }

    // [DELETE]  /courses/:id
    destroy(req,res,next){
        //res.json(req.body);
        Course.delete({ _id: req.params.id})
             .then(()=> {
                 res.redirect('back')
             })
             .catch(next)
    }

    // [DELETE]  /courses/:id/force
    forceDestroy(req,res,next){
        //res.json(req.body);
        Course.deleteOne({ _id: req.params.id})
             .then(()=> {
                 res.redirect('back')
             })
             .catch(next)
    }



    // [PATCH] /courses/:id/restore
    restore(req,res,next){
        Course.restore({_id: req.params.id})
            .then(()=> res.redirect('back'))
            .catch(next)
    }
 

}

module.exports = new CourseController();
