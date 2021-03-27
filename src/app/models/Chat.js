const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// xóa mềm trong database
const mongooseDelete = require('mongoose-delete');


const Chat = new Schema(
    {
        text: {
            type: String
        },
        idUserTo: {
            type: String
        },
        idUserFrom: {
            type: String
        },
    },
    {
        timestamps: true
    }
)


//add plugin
Chat.plugin(mongooseDelete, { 
    overrideMethods: 'all',
    deletedAt : true,
})

module.exports = mongoose.model('Chat', Chat)
