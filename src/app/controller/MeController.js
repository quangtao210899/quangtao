const Course = require('../models/course')

class CourseController {
    // [GET]  /me/stored/courses
    storedCourse(req,res,next){
        Promise.all([Course.find({}).lean().sortable(req), Course.countDocumentsDeleted()])
            .then(([courses, deleteCount])=>{
                res.render('./me/storeCourse', {courses, deleteCount})
            })
            .catch(next)

    }



    // [GET]  /me/trash/courses
    getTrashCourse(req,res,next){
        Promise.all([Course.findDeleted({}).lean(), Course.countDocuments()])
        .then(([courses, countDocument]) => res.render('./me/trashCourse', {courses, countDocument}))
        .catch(next)
    }



}

module.exports = new CourseController();
