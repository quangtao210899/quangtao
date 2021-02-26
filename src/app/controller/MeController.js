const Course = require('../models/course')

class CourseController {
    // [GET]  /me/stored/courses
    storedCourse(req,res,next){
        Promise.all([Course.find({}).lean(), Course.countDocumentsDeleted()])
            .then(([courses, deleteCount])=>{
                res.render('./me/storeCourse', {courses,deleteCount})
            })
            .catch(next)

    }



    // [GET]  /me/trash/courses
    getTrashCourse(req,res,next){
        Course.findDeleted({})
        .lean()  // clean lại course trc khi render
        .then(courses => res.render('./me/trashCourse', {courses,}))
        .catch(next)
    }



}

module.exports = new CourseController();
