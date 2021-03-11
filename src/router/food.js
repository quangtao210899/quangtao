const express = require('express');
const router = express.Router();

const foodController = require('../app/controller/FoodController');

router.get('/:slug', foodController.showFood);



module.exports = router;
