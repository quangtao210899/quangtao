const express = require('express');
const router = express.Router();

const siteController = require('../app/controller/SiteController.js');


const checkSessionCookie = require('../app/middlewares/checkSessionCookie')


router.get('/search', siteController.search);
router.get('/login',checkSessionCookie, siteController.login);
router.post('/search', siteController.searchPost);
router.get('/', siteController.home);

module.exports = router;
