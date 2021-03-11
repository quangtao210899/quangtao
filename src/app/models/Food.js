const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// tự thêm slug vào 
const slug = require('mongoose-slug-generator');

// xóa mềm trong database
const mongooseDelete = require('mongoose-delete');


const Food = new Schema({
    foodName: { type: String,},
    address: { type: String, },
    price: { type: String,},
    description: {type: String,},
    slug : {type: String, slug: 'foodName', unique: true}
}, {
    timestamps: true,
});

//add plugin
mongoose.plugin(slug);
Food.plugin(mongooseDelete, { 
    overrideMethods: 'all',
    deletedAt : true,
})

module.exports = mongoose.model('Food', Food)
