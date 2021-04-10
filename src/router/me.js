const express = require('express');
const router = express.Router();

const meController = require('../app/controller/MeController');

const checkNotificationOrder = require('../app/middlewares/checkNotificationOrder')

router.get('/stored/courses', meController.storedCourse);
router.get('/stored/foods', meController.storedFood);
router.get('/stored/order', meController.storedOrder);
router.get('/trash/courses', meController.getTrashCourse);
router.get('/trash/foods', meController.getTrashFood);
router.get('/profile', meController.profile);
router.get('/restaurant/info', meController.restaurantInfo);
router.get('/restaurant/prepare', checkNotificationOrder, meController.restaurantPrepare);
router.get('/restaurant/shipping', checkNotificationOrder, meController.restaurantShipping);
router.get('/restaurant/sold', checkNotificationOrder, meController.restaurantSold);
router.get('/restaurant/cancelled',checkNotificationOrder,  meController.restaurantCancelled);
router.get('/restaurant/statistical', meController.restaurantStatistical);


module.exports = router;
