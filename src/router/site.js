const express = require('express');
const router = express.Router();

const siteController = require('../app/controller/SiteController.js');

router.get('/search', siteController.search);
router.post('/search', siteController.searchPost);
router.get('/', siteController.home);

module.exports = router;
