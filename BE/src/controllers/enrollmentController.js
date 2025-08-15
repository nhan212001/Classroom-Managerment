const { db } = require('../config/firebase');
const { Filter } = require('firebase-admin/firestore');

const addEnrollment = async (req, res) => {
    try {
        const { studentId, lessonId } = req.body;
        const studentSnapshot = await db.collection('users').doc(studentId).get();
        if (!studentSnapshot.exists) {
            return res.status(404).json({ message: 'Student not found' });
        }
        const lessonSnapshot = await db.collection('lesson').doc(lessonId).get();
        if (!lessonSnapshot.exists) {
            return res.status(404).json({ message: 'Lesson not found' });
        }
        const existingAssignment = await db.collection('enrollments')
            .where('studentId', '==', studentId)
            .where('lessonId', '==', lessonId)
            .where('isDone', '==', false)
            .get();

        if (existingAssignment.empty) {
            await db.collection('enrollments').add({
                studentId,
                lessonId,
                isDone: false,
                createdAt: new Date()
            });
        } else {
            return res.status(400).json({ message: 'Student already assigned this lesson' });
        }
        res.status(200).json({ message: 'Lesson assigned successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const changeEnrollmentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { isDone } = req.body;

        let convertedIsDone;
        if (isDone === "true") {
            convertedIsDone = true;
        } else if (isDone === "false") {
            convertedIsDone = false;
        } else {
            return res.status(400).json({ message: 'Invalid isDone value' });
        }

        await db.collection('enrollments').doc(id).update({ isDone: convertedIsDone });
        res.status(200).json({ message: 'Enrollment status updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteEnrollment = async (req, res) => {
    try {
        const { id } = req.params;
        await db.collection('enrollments').doc(id).delete();
        res.status(204).json({ message: 'Enrollment deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getEnrollmentByStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const snapshot = await db.collection('enrollments').where('studentId', '==', id).get();
        if (snapshot.empty) {
            return res.status(404).json({ message: 'No enrollments found for this student' });
        }
        const enrollments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(enrollments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAllEnrollments = async (req, res) => {
    try {
        const snapshot = await db.collection('enrollments').get();
        const enrollments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(enrollments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    addEnrollment,
    changeEnrollmentStatus,
    deleteEnrollment,
    getAllEnrollments,
    getEnrollmentByStudent
};
