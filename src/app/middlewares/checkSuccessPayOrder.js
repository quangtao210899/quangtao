
module.exports = function checkSuccessPayOrder(req,res,next){

    res.locals._successOrder = 'no'

    if(req.session.userOrder=='yes'){
        res.locals._successOrder='yes'
        req.session.userOrder=''
    }
    next();
}