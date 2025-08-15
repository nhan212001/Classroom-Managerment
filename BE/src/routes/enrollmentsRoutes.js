const express = require('express');
const router = express.Router();
const enrollmentController = require('../controllers/enrollmentController');
const middlewares = require('../middlewares/authMiddlewares')

router.get('/', middlewares.checkInstructor, enrollmentController.getAllEnrollments);
router.get('/student/:id', middlewares.checkInstructor, enrollmentController.getEnrollmentByStudent);
router.post('/', middlewares.checkInstructor, enrollmentController.addEnrollment);
router.put('/:id', enrollmentController.changeEnrollmentStatus);
router.delete('/:id', middlewares.checkInstructor, enrollmentController.deleteEnrollment);

module.exports = router;
