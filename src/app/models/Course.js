const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// tự thêm slug vào 
const slug = require('mongoose-slug-generator');
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

//add plugin
mongoose.plugin(slug);
Course.plugin(mongooseDelete, { 
    overrideMethods: 'all',
    deletedAt : true,
})

module.exports = mongoose.model('Course', Course)
