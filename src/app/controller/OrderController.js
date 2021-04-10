const User = require('../models/user')
const Order = require('../models/order')

class OrderController {
    //[PATCH] /order/cancelled/:id
    cancelled(req,res,next){
        Order.updateOne({_id: req.params.id}, {state: 'cancelled'})
            .lean()
            .then(()=>{
                req.session.notificationCancelled='yes'
                res.redirect('/me/restaurant/'+req.body.inputHidden)
            })
            .catch(next)
    }
    //[PATCH] /order/shipping/:id
    shipping(req,res,next){
        Order.updateOne({_id: req.params.id}, {state: 'shipping'})
            .lean()
            .then(()=>{
                req.session.notificationShip='yes'
                res.redirect('/me/restaurant/prepare')
            })
            .catch(next)
    }
    //[PATCH] /order/sold/:id
    sold(req,res,next){
        Order.updateOne({_id: req.params.id}, {state: 'sold'})
            .lean()
            .then(()=>{
                req.session.notificationSold='yes'
                res.redirect('/me/restaurant/shipping')
            })
            .catch(next)
    }

}

module.exports = new OrderController();