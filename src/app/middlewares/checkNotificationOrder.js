
module.exports = function checkSuccessPayOrder(req,res,next){

    res.locals.notificationType = 'no'
    if(req.session.notificationCancelled=='yes'){
        res.locals.notificationType='cancelled'
        req.session.notificationCancelled=''
    }
    if(req.session.notificationShip=='yes'){
        res.locals.notificationType='shipping'
        req.session.notificationShip=''
    }
    if(req.session.notificationSold=='yes'){
        res.locals.notificationType='sold'
        req.session.notificationSold=''
    }
    next();
}