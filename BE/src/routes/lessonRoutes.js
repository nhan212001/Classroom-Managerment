const express = require('express');
const router = express.Router();
const lessonController = require('../controllers/lessonController');

router.get('/', lessonController.getAllLessons);
router.post('/', lessonController.addLesson);
router.put('/:id', lessonController.editLesson);
router.delete('/:id', lessonController.deleteLesson);

module.exports = router;