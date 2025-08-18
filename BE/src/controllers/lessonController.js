const { Filter, FieldPath } = require('firebase-admin/firestore');
const { db } = require('../config/firebase');

const getAllLessons = async (req, res) => {
    try {
        const data = await db.collection('lesson').get();
        res.json(data.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const addLesson = async (req, res) => {
    try {
        const {
            description,
            name,
            duration
        } = req.body;
        if (!name) {
            return res.status(400).json({ error: 'Name is required' });
        }
        const existingLesson = await db.collection('lesson')
            .where('name', '==', name)
            .get();

        if (!existingLesson.empty) {
            return res.status(400).json({ error: 'Lesson with this name already exists' });
        }

        const lessonRef = await db.collection('lesson').add({
            description,
            name,
            duration
        });
        res.status(201).json({ id: lessonRef.id, description, name, duration });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const editLesson = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            description,
            name,
            duration
        } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Name is required' });
        }

        const existingLesson = await db.collection('lesson')
            .where('name', '==', name)
            .where(FieldPath.documentId(), '!=', id)
            .get();

        if (!existingLesson.empty) {
            return res.status(400).json({ error: 'Lesson with this name already exists' });
        }

        await db.collection('lesson').doc(id).update({
            description,
            name,
            duration
        });
        res.status(200).json({ id, description, name, duration });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteLesson = async (req, res) => {
    try {
        const { id } = req.params;
        await Promise.all([
            db.collection('lesson').doc(id).delete(),
            db.collection('enrollments')
                .where('lessonId', '==', id)
                .get()
                .then(snap => {
                    const batch = db.batch();
                    snap.forEach(doc => batch.delete(doc.ref));
                    return batch.commit();
                })
        ]);
        res.status(200).json({ message: 'Lesson deleted successfully', id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



module.exports = {
    getAllLessons,
    addLesson,
    editLesson,
    deleteLesson,
};