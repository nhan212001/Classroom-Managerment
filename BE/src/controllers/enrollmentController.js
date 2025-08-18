const { db } = require('../config/firebase');
const { Filter, Timestamp } = require('firebase-admin/firestore');

const addEnrollment = async (req, res) => {
    try {
        const { studentId, lessonId } = req.body;
        const studentSnapshot = await db.collection('users').doc(studentId).get();
        if (!studentSnapshot.exists) {
            return res.status(404).json({ error: 'Student not found' });
        }
        const lessonSnapshot = await db.collection('lesson').doc(lessonId).get();
        if (!lessonSnapshot.exists) {
            return res.status(404).json({ error: 'Lesson not found' });
        }
        const existingAssignment = await db.collection('enrollments')
            .where('studentId', '==', studentId)
            .where('lessonId', '==', lessonId)
            .where('isDone', '==', false)
            .get();

        if (existingAssignment.empty) {
            const enrollmentRef = await db.collection('enrollments').add({
                studentId,
                lessonId,
                isDone: false,
                createdAt: Timestamp.now()
            });
            const newEnrollment = {
                id: enrollmentRef.id,
                studentId,
                lessonId,
                isDone: false,
                studentName: studentSnapshot.data().name,
                lessonName: lessonSnapshot.data().name
            };
            res.status(200).json({ message: 'Lesson assigned successfully', enrollment: newEnrollment });
        } else {
            return res.status(400).json({ error: 'Student already assigned this lesson' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const changeEnrollmentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { isDone } = req.body;

        let convertedIsDone = isDone;
        if (typeof isDone !== 'boolean') {
            if (isDone === "true") {
                convertedIsDone = true;
            } else if (isDone === "false") {
                convertedIsDone = false;
            } else {
                return res.status(400).json({ error: 'Invalid isDone value' });
            }
        }

        await db.collection('enrollments').doc(id).update({ isDone: convertedIsDone });
        res.status(200).json({ message: 'Enrollment status updated successfully', enrollment: { id, isDone: convertedIsDone } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteEnrollment = async (req, res) => {
    try {
        const { id } = req.params;
        await db.collection('enrollments').doc(id).delete();
        res.status(200).json({ message: 'Enrollment deleted successfully', id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getEnrollmentByStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const snapshot = await db.collection('enrollments').where('studentId', '==', id).get();
        if (snapshot.empty) {
            return res.status(200).json([]);
        }
        const enrollments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        await Promise.all(enrollments.map(async (enrollment) => {
            const studentSnapshot = await db.collection('users').doc(enrollment.studentId).get();
            const lessonSnapshot = await db.collection('lesson').doc(enrollment.lessonId).get();
            enrollment.studentName = studentSnapshot.data().name;
            enrollment.lessonName = lessonSnapshot.data().name;
        }));
        res.json(enrollments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAllEnrollments = async (req, res) => {
    try {
        const snapshot = await db.collection('enrollments').get();
        const enrollments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        await Promise.all(enrollments.map(async (enrollment) => {
            const studentSnapshot = await db.collection('users').doc(enrollment.studentId).get();
            const lessonSnapshot = await db.collection('lesson').doc(enrollment.lessonId).get();
            enrollment.studentName = studentSnapshot.data().name;
            enrollment.lessonName = lessonSnapshot.data().name;
        }));
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
