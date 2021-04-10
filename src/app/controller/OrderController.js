const User = require('../models/user')
const Order = require('../models/order')

class OrderController {
    //[PATCH] /order/cancelled/:id
    cancelled(req,res,next){
        Order.updateOne({_id: req.params.id}, {state: 'cancelled'})
            .lean()
            .then(()=>{
                res.redirect('/me/restaurant/'+req.body.inputHidden)
            })
            .catch(next)
    }
    //[PATCH] /order/shipping/:id
    shipping(req,res,next){
        Order.updateOne({_id: req.params.id}, {state: 'shipping'})
            .lean()
            .then(()=>{
                res.redirect('/me/restaurant/prepare')
            })
            .catch(next)
    }

}

module.exports = new OrderController();