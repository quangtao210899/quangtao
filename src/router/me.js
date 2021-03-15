const express = require('express');
const router = express.Router();

const meController = require('../app/controller/MeController');

router.get('/stored/courses', meController.storedCourse);
router.get('/stored/foods', meController.storedFood);
router.get('/trash/courses', meController.getTrashCourse);
router.get('/trash/foods', meController.getTrashFood);



module.exports = router;
