const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/', userController.getAllUsers);
router.get('/student', userController.getAllStudents);
router.post('/student', userController.addStudent);
router.put('/student/:id', userController.editStudent);
router.delete('/student/:id', userController.deleteStudent);

module.exports = router;
