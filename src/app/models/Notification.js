const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// tự thêm slug vào 
const slug = require('mongoose-slug-generator');

// xóa mềm trong database
const mongooseDelete = require('mongoose-delete');


const Notification = new Schema({
    content: {type: String},
    idUserFrom: {type: String},
    idUserTo: {type: String},
    idFood: {type: String},
    type: {type: String},
}, {
    timestamps: true,
});
Notification.plugin(mongooseDelete, { 
    overrideMethods: 'all',
    deletedAt : true,
})

module.exports = mongoose.model('Notification', Notification)
