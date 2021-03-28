const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// tự thêm slug vào 
const slug = require('mongoose-slug-generator');

// xóa mềm trong database
const mongooseDelete = require('mongoose-delete');


const User = new Schema({
    username: {type: String},
    password: { type: String},
    firstname: {type: String},
    lastname: {type: String},
    phone: {type: String},
    gender: {type: String},
    image: {type: String},
    address: [
        {address: String}
    ],
    idUserChats: [
        {
            idUser: String, 
            lastChat: String,
        }
    ]
}, {
    timestamps: true,
});

//add plugin
mongoose.plugin(slug);
User.plugin(mongooseDelete, { 
    overrideMethods: 'all',
    deletedAt : true,
})

module.exports = mongoose.model('User', User)
