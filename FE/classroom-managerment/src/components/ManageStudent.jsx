import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { useDispatch, useSelector } from "react-redux";
import { selectErrorStudents, selectLoadingStudents, selectStudents } from "../slices/studentSlice";
import { addStudent, deleteUser, editUser, getAllStudents } from "../apis/userApi";
import { toast } from "react-toastify";
import { validateEmail, validatePhone } from "../common/common";

const ManageStudents = () => {
    const students = useSelector(selectStudents);
    const loading = useSelector(selectLoadingStudents);
    const error = useSelector(selectErrorStudents);

    const dispatch = useDispatch();

    const [modalData, setModalData] = useState({
        showModal: false,
        isEdit: false,
        student: {
            id: "",
            email: "",
            name: "",
            phone: ""
        }
    });

    useEffect(() => {
        dispatch(getAllStudents());
    }, []);

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    const handleDelete = (id) => {
        dispatch(deleteUser(id))
    };

    const handleEdit = (student) => {
        setModalData({
            showModal: true,
            isEdit: true,
            student: {
                id: student.id,
                email: student.email,
                name: student.name,
                phone: student.phone
            }
        });
    };

    const handleChange = (e) => {
        setModalData({
            ...modalData,
            student: { ...modalData.student, [e.target.name]: e.target.value }
        });
    };

    const handleSave = () => {
        if (!modalData.student?.name || !modalData.student?.email) {
            toast.error("Name and email are required");
            return;
        }
        if (!validateEmail(modalData.student.email)) {
            toast.error("Invalid email format");
            return;
        }
        if (!validatePhone(modalData.student.phone)) {
            toast.error("Invalid phone number format");
            return;
        }

        if (modalData.isEdit) {
            dispatch(editUser(modalData.student))
        } else {
            dispatch(addStudent(modalData.student))
        }
        // dispatch(getAllStudents());
        setModalData({
            showModal: false,
            isEdit: false,
            student: {
                email: "",
                name: "",
                phone: ""
            }
        });

    };

    const handleCancel = () => {
        setModalData({
            showModal: false,
            isEdit: false,
            student: {
                email: "",
                name: "",
                phone: ""
            }
        });
    };

    const handleAdd = () => {
        setModalData({
            showModal: true,
            isEdit: false,
            student: {
                email: "",
                name: "",
                phone: ""
            }
        });
    };

    return (
        <div className="p-6 bg-white shadow rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Manage Students</h2>
            <div className="flex justify-between items-center mb-4">
                <p className="font-medium">{students?.length} Students</p>
                <div className="flex gap-2">
                    <button
                        onClick={handleAdd}
                        className="border border-blue-500 text-blue-500 px-4 py-1 rounded hover:bg-blue-50"
                    >
                        + Add Student
                    </button>
                </div>
            </div>

            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-gray-100 text-left">
                        <th className="p-2">Student Name</th>
                        <th className="p-2">Email</th>
                        <th className="p-2">Phone</th>
                        <th className="p-2">Status</th>
                        <th className="p-2">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {students?.map((student) => (
                        <tr key={student.id} className="border-t">
                            <td className="p-2">{student.name}</td>
                            <td className="p-2">{student.email}</td>
                            <td className="p-2">{student.phone}</td>
                            <td className="p-2">
                                <span className="bg-green-100 text-green-600 px-2 py-1 rounded">
                                    {student.status}
                                </span>
                            </td>
                            <td className="p-2 flex gap-2">
                                <button
                                    onClick={() => handleEdit(student)}
                                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(student.id)}
                                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {loading && <p className="text-center text-gray-500">Loading...</p>}

            <Modal
                isOpen={modalData.showModal}
                onRequestClose={handleCancel}
                contentLabel="Edit Student"
                className="bg-white rounded-lg shadow-lg p-6 min-w-[320px] w-full max-w-md mx-auto mt-32 outline-none"
                overlayClassName="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50"
            >
                <h3 className="text-lg font-bold mb-4">Edit Student</h3>
                <div className="flex flex-col gap-3">
                    <input
                        className="border p-2 rounded"
                        name="name"
                        value={modalData.student?.name || ''}
                        onChange={handleChange}
                        placeholder="Name"
                    />
                    <input
                        className="border p-2 rounded"
                        name="email"
                        value={modalData.student?.email || ''}
                        onChange={handleChange}
                        placeholder="Email"
                    />
                    <input
                        className="border p-2 rounded"
                        name="phone"
                        value={modalData.student?.phone || ''}
                        onChange={handleChange}
                        placeholder="Phone"
                    />
                </div>
                <div className="flex justify-end gap-2 mt-6">
                    <button onClick={() => setModalData({ ...modalData, showModal: false })} className="px-4 py-1 rounded border">Cancel</button>
                    <button onClick={handleSave} disabled={loading} className="px-4 py-1 rounded bg-blue-500 text-white">Save</button>
                </div>
            </Modal>

        </div>
    );
};

export default ManageStudents;