const express = require('express');
const router = express.Router();
const enrollmentController = require('../controllers/enrollmentController');

router.get('/', enrollmentController.getAllEnrollments);
router.get('/student/:id', enrollmentController.getEnrollmentByStudent);
router.post('/', enrollmentController.addEnrollment);
router.put('/:id', enrollmentController.changeEnrollmentStatus);
router.delete('/:id', enrollmentController.deleteEnrollment);

module.exports = router;
