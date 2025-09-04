const { Filter, Timestamp, FieldPath } = require('firebase-admin/firestore');
const { db } = require('../config/firebase')
const { emitToUser } = require("../socket");

const createChat = async (req, res) => {
    try {
        const { id } = req;
        const { instructorId, studentId } = req.body;
        if (!instructorId || !studentId) {
            return res.status(400).json({ error: 'Missing user IDs' });
        }
        const ids = [instructorId, studentId].sort();
        const roomId = ids.join('_');
        await db.collection('chats').doc(roomId).set({
            instructorId,
            studentId,
            lastMessage: '',
            lastUpdated: Timestamp.now(),
            senderId: null
        }, {
            merge: true
        });
        const contactId = instructorId === id ? studentId : instructorId;
        const contactName = (await db.collection('users').doc(contactId).get()).data().name;

        res.status(201).json({ id: roomId, contactName, instructorId, studentId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getChatsByUserId = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: 'Missing user ID' });
        }
        const chats = await db.collection('chats').where(
            Filter.or(
                Filter.where('instructorId', '==', id),
                Filter.where('studentId', '==', id)
            )
        ).get();

        const chatRooms = chats.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const contactIds = chatRooms.map(chat =>
            chat.instructorId === id ? chat.studentId : chat.instructorId
        );

        let contactNames = {};
        if (contactIds.length > 0) {
            const usersSnap = await db.collection('users').where(FieldPath.documentId(), 'in', contactIds).get();
            usersSnap.forEach(doc => {
                contactNames[doc.id] = doc.data().name;
            });
        }

        const result = chatRooms.map(chat => {
            const contactId = chat.instructorId === id ? chat.studentId : chat.instructorId;
            return {
                ...chat,
                contactName: contactNames[contactId] || 'Unknown User'
            };
        });
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getMessagesByChatId = async (req, res) => {
    try {
        const { chatId } = req.params;
        if (!chatId) {
            return res.status(400).json({ error: 'Missing chat ID' });
        }
        const messages = await db.collection('chats').doc(chatId).collection('messages').orderBy('createdAt').get();
        const messageList = messages.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json(messageList);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const saveMessage = async (req, res) => {
    try {
        const { chatId } = req.params;
        const { senderId, receiverId, text } = req.body;
        if (!chatId || !senderId || !text) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const message = {
            senderId,
            text,
            createdAt: Timestamp.now()
        };
        const chatRef = db.collection('chats').doc(chatId);
        const messageRef = await chatRef.collection('messages').add(message);
        await chatRef.set({ lastMessage: message.text, lastUpdated: message.createdAt, senderId }, { merge: true });

        const updatedChat = await chatRef.get();
        emitToUser(receiverId, 'newMessage', {
            chatId,
            message: { id: messageRef.id, ...message },
        });

        res.status(201).json({
            chat: {
                id: chatId,
                ...updatedChat.data()
            }, message: { id: messageRef.id, ...message }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createChat,
    getChatsByUserId,
    getMessagesByChatId,
    saveMessage
};
