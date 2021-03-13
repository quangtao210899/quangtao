const express = require('express');
const router = express.Router();

const foodController = require('../app/controller/FoodController');



router.get('/create', foodController.create);
router.post('/store', foodController.store);
router.get('/:slug', foodController.showFood);



module.exports = router;
