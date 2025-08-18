const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

router.post('/create', chatController.createChat);
router.get('/user/:id', chatController.getChatsByUserId);
router.get('/:chatId/messages', chatController.getMessagesByChatId);
router.post('/:chatId/messages', chatController.saveMessage);

module.exports = router;
