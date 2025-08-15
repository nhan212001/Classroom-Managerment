const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const middlewares = require('../middlewares/authMiddlewares');

router.get('/', middlewares.checkInstructor, userController.getAllUsers);
router.get('/student', middlewares.checkInstructor, userController.getAllStudents);
router.post('/student', middlewares.checkInstructor, userController.addStudent);
router.put('/student/:id', userController.editStudent);
router.delete('/student/:id', middlewares.checkInstructor, userController.deleteStudent);

module.exports = router;
