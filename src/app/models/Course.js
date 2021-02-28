const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// tự thêm slug vào 
const slug = require('mongoose-slug-generator');

// xóa mềm trong database
const mongooseDelete = require('mongoose-delete');


const Course = new Schema({
    name: { type: String, require: true},
    description: { type: String, },
    image: { type: String,},
    videoID: {type: String, require: true, },
    level: {type: String},
    slug: { type: String, slug: 'name', unique: true},
}, {
    timestamps: true,
});
// custom query helpers
Course.query.sortable = function(req){
    if(req.query.hasOwnProperty('_sort')){
        const isValidStyle = ['asc','desc'].includes(req.query.type); 
        return this.sort({
            [req.query.column] : isValidStyle ? req.query.type : 'desc',
        })
    }
    return this;
}
//add plugin
mongoose.plugin(slug);
Course.plugin(mongooseDelete, { 
    overrideMethods: 'all',
    deletedAt : true,
})

module.exports = mongoose.model('Course', Course)
