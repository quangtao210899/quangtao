const express = require('express');
const router = express.Router();

const orderController = require('../app/controller/OrderController');

router.patch('/cancelled/:id', orderController.cancelled);
router.patch('/shipping/:id', orderController.shipping);
router.patch('/sold/:id', orderController.sold);

module.exports = router;