const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// tự thêm slug vào 
const slug = require('mongoose-slug-generator');

// xóa mềm trong database
const mongooseDelete = require('mongoose-delete');


const Order = new Schema({
    idUser : {type: String},
    idMainFood: { type: String,},
    foodName: { type: String, },
    foods: [{
        idfood: String,
        foodName: String,
        price: String,
        quantity: String, 
    }],
    price: { type: String,},
    quantity: { type: String,},
    cost: { type: String,},
}, {
    timestamps: true,
});

// custom query helpers
Order.query.sortable = function(req){
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
Order.plugin(mongooseDelete, { 
    overrideMethods: 'all',
    deletedAt : true,
})

module.exports = mongoose.model('Order', Order)
