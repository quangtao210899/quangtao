const express = require('express');
const router = express.Router();

const chatController = require('../app/controller/ChatController');

router.get('/', chatController.chat);

module.exports = router;
