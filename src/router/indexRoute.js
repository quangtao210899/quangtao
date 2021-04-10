
const siteRouter = require('./site');
const courseRouter = require('./course');
const meRouter = require('./me');
const chatRouter = require('./chat');
const foodRouter = require('./food');
const orderRouter = require('./order');

const checkSessionCookie = require('../app/middlewares/checkSessionCookie')
function route(app) {
    app.use('/chat', checkSessionCookie, chatRouter);
    app.use('/courses', checkSessionCookie, courseRouter);
    app.use('/me', checkSessionCookie, meRouter);
    app.use('/foods', checkSessionCookie, foodRouter);
    app.use('/order', checkSessionCookie, orderRouter);
    app.use('/', siteRouter); 
}


module.exports = route;
