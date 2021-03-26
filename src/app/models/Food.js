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
    image: { type: String,},
    description: {type: String,},
    timeOpen: {type: String},
    timeClose:{type: String},
    idUser: {type: String},
    resize: {type: String},
    type: {type: String},
    discount: {type: String},
    userVote:[{
        userId: String,
        vote: String,
    }],
    slug : {type: String, slug: 'foodName', unique: true}
}, {
    timestamps: true,
});

// custom query helpers
Food.query.sortable = function(req){
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
Food.plugin(mongooseDelete, { 
    overrideMethods: 'all',
    deletedAt : true,
})

module.exports = mongoose.model('Food', Food)
