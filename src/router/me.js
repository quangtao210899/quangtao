const express = require('express');
const router = express.Router();

const meController = require('../app/controller/MeController');

router.get('/stored/courses', meController.storedCourse);
router.get('/stored/foods', meController.storedFood);
router.get('/stored/order', meController.storedOrder);
router.get('/trash/courses', meController.getTrashCourse);
router.get('/trash/foods', meController.getTrashFood);
router.get('/profile', meController.profile);
router.get('/restaurant/info', meController.restaurantInfo);
router.get('/restaurant/prepare', meController.restaurantPrepare);





module.exports = router;
