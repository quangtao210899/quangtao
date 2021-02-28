const express = require('express');
const router = express.Router();

const courseController = require('../app/controller/CourseController');

router.get('/create', courseController.create);
router.post('/store', courseController.store);

router.get('/:id/edit', courseController.edit);
router.post('/handle-form-actions-store', courseController.handleFormActionsStore)
router.post('/handle-form-actions-trash', courseController.handleFormActionsTrash)
router.put('/:id', courseController.update);
router.patch('/:id/restore', courseController.restore);

router.delete('/:id/force', courseController.forceDestroy);
router.delete('/:id', courseController.destroy);

router.get('/:slug', courseController.showAllCourse);


module.exports = router;
