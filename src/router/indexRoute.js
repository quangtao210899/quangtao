
const siteRouter = require('./site');
const courseRouter = require('./course');
const meRouter = require('./me');
const chatRouter = require('./chat');

function route(app) {
    app.use('/chat', chatRouter);
    app.use('/courses', courseRouter);
    app.use('/me', meRouter);
    app.use('/', siteRouter); 
}


module.exports = route;
