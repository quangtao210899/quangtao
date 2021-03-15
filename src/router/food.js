const express = require('express');
const multer = require("multer");

const router = express.Router();

const foodController = require('../app/controller/FoodController');



router.get('/create', foodController.create);
router.post('/store', foodController.store);
router.post('/handle-form-actions-store', foodController.handleFormActionsStore)
router.post('/handle-form-actions-trash', foodController.handleFormActionsTrash)
router.get('/:id/edit', foodController.edit);
router.patch('/:id/restore', foodController.restore);
router.put('/:id', foodController.update);
router.delete('/:id/force', foodController.forceDestroy);
router.delete('/:id', foodController.destroy);
router.get('/:slug', foodController.showFood);



module.exports = router;
