const user = require('../models/user')
const User = require('../models/user')
module.exports = function sortMiddleware(req,res,next){

    res.locals._sort = {
        enabled : false,
        type: 'default',
    }
    res.locals._fullname = req.session.fullname

    if(req.query.hasOwnProperty('_sort')){
        res.locals._sort.enabled = true
        res.locals._sort.type = req.query.type
        res.locals._sort.column = req.query.column
    }

    next();
}