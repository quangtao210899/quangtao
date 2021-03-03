const express = require('express');
const router = express.Router();

const siteController = require('../app/controller/SiteController.js');


const checkSessionCookie = require('../app/middlewares/checkSessionCookie')
const checkLogin = require('../app/middlewares/checkLogin')


router.get('/search', checkSessionCookie, siteController.search);
router.get('/login', checkLogin, siteController.login);
router.get('/logout', siteController.logout);
router.post('/search', checkSessionCookie, siteController.searchPost);
router.get('/register', siteController.register);
router.post('/register', siteController.saveRegister);

//router.get('/:id', checkSessionCookie, siteController.home);
router.get('/', checkSessionCookie, siteController.home);

module.exports = router;
