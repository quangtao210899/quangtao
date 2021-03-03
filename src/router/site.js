const express = require('express');
const router = express.Router();

const siteController = require('../app/controller/SiteController.js');


const checkSessionCookie = require('../app/middlewares/checkSessionCookie')


router.get('/search', checkSessionCookie, siteController.search);
router.get('/login', siteController.login);
router.post('/search', checkSessionCookie, siteController.searchPost);
router.get('/', checkSessionCookie, siteController.home);

module.exports = router;
