const express = require('express');

const router = express.Router();


const checkSuccessPayOrder = require('../app/middlewares/checkSuccessPayOrder')

const foodController = require('../app/controller/FoodController');



router.get('/create', foodController.create);
router.post('/store', foodController.store);
router.post('/handle-form-actions-store', foodController.handleFormActionsStore)
router.post('/handle-form-actions-trash', foodController.handleFormActionsTrash)
router.get('/:id/edit', foodController.edit);
router.post('/:id/order', foodController.order);
router.patch('/:id/restore', foodController.restore);
router.delete('/:id/force', foodController.forceDestroy);
router.put('/:id', foodController.update);
router.delete('/:id', foodController.destroy);
router.get('/:slug', checkSuccessPayOrder, foodController.showFood);



module.exports = router;
