const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// xóa mềm trong database
const mongooseDelete = require('mongoose-delete');


const Comment = new Schema(
    {
        text: {
            type: String
        },
        idUser: {
            type: String
        },
        image: {
            type: String
        },
        name:{
            type: String
        },
        idUserFood:{
            type:String
        },    
        userLove:[{
            userId: String,
            
        }],
    },
    {
        timestamps: true
    }
)


//add plugin
Comment.plugin(mongooseDelete, { 
    overrideMethods: 'all',
    deletedAt : true,
})

module.exports = mongoose.model('Comment', Comment)
