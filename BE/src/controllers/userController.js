const { db } = require('../config/firebase')
const jwt = require('jsonwebtoken');
const { Filter, FieldPath } = require('firebase-admin/firestore');
const { validateEmail, validatePhoneNumber, sendEmail, createResetPasswordToken } = require('../utils/comon');

const getAllUsers = async (req, res) => {
    try {
        const snapshot = await db.collection('users').get();
        const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAllStudents = async (req, res) => {
    try {
        const snapshot = await db.collection('users').where('role', '==', 'student').get();
        const students = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(students);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const addStudent = async (req, res) => {
    try {
        const {
            email,
            name,
            phone
        } = req.body;
        if (!email || !name) {
            return res.status(400).json({ error: 'Email and name are required' });
        }
        if (!validateEmail(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }
        if (!validatePhoneNumber(phone)) {
            return res.status(400).json({ error: 'Invalid phone number format' });
        }
        const snapshot = await db.collection('users').where(
            Filter.or(
                Filter.where('email', '==', email),
                Filter.where('phone', '==', phone),
            )
        ).get();

        if (!snapshot.empty) {
            return res.status(400).json({ error: 'Email or phone already exists' });
        }

        const newStudent = {
            email,
            name,
            phone,
            role: 'student',
            createdAt: new Date(),
            updatedAt: new Date(),
            status: 'inactive',
        };

        const docRef = await db.collection('users').add(newStudent);
        const student = await db.collection('users').doc(docRef.id).get();

        const createPasswordToken = createResetPasswordToken({
            id: docRef.id,
            name,
            email,
            phone
        })

        await db.collection('users').doc(docRef.id).update({
            resetPasswordToken: createPasswordToken
        });

        sendEmail(email, 'Welcome to Classroom Management', `Hello ${name},\n\nThank you for registering as a student. 
                Click ${process.env.FE_URL}/reset-password?token=${createPasswordToken} here to set your password.
            `);
        res.status(201).json({ id: docRef.id, ...student.data() });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const editStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const student_token_id = req.id;
        const { role } = req;

        if (role === 'student' && student_token_id !== id) {
            return res.status(403).json({ error: 'Student not allowed to edit this profile' });
        }
        const { email, name, phone } = req.body;
        if (!email || !name) {
            return res.status(400).json({ error: 'Email and name are required' });
        }
        if (!validateEmail(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }
        if (!validatePhoneNumber(phone)) {
            return res.status(400).json({ error: 'Invalid phone number format' });
        }

        const snapshot = await db.collection('users').where(
            Filter.or(
                Filter.where(
                    'email', '==', email
                ),
                Filter.where(
                    'phone', '==', phone
                )
            )
        ).where(FieldPath.documentId(), '!=', id).get();

        if (!snapshot.empty) {
            return res.status(400).json({ error: 'Email or phone already exists' });
        }

        await db.collection('users').doc(id).update({ email, name, phone, updatedAt: new Date() });
        res.json({ id, email, name, phone });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteStudent = async (req, res) => {
    try {
        const { id } = req.params;
        await Promise.all([
            db.collection('enrollments').where('studentId', '==', id).get().then(snapshot => {
                snapshot.forEach(doc => doc.ref.delete());
            }),
            db.collection('users').doc(id).delete()
        ]);

        res.json({ message: 'Student deleted successfully', id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllUsers,
    getAllStudents,
    addStudent,
    editStudent,
    deleteStudent
};
