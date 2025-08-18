import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "react-modal";
import { selectErrorLessons, selectLessons, selectLoadingLessons } from "../slices/lessonSlice";
import { createLesson, deleteLesson, editLesson, getAllLesson } from "../apis/lessonApi";
import { toast } from "react-toastify";


const ManageLesson = () => {
    const lessons = useSelector(selectLessons);
    const loading = useSelector(selectLoadingLessons);
    const error = useSelector(selectErrorLessons);

    const dispatch = useDispatch();

    const [modalData, setModalData] = useState({
        showModal: false,
        isEdit: false,
        lesson: {
            id: '', name: '', description: '', duration: ''
        }
    });

    useEffect(() => {
        dispatch(getAllLesson());
    }, []);

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    const handleAdd = () => {
        setModalData({
            showModal: true,
            isEdit: false,
            lesson: { name: '', description: '', duration: '' }
        });
    };

    const handleEdit = (lesson) => {
        setModalData({
            showModal: true, isEdit: true, lesson: {
                id: lesson.id,
                name: lesson.name,
                description: lesson.description,
                duration: lesson.duration
            }
        });
    };

    const handleDelete = (id) => {
        dispatch(deleteLesson(id));
    };

    const handleChange = (e) => {
        setModalData({ ...modalData, lesson: { ...modalData.lesson, [e.target.name]: e.target.value } });
    };

    const handleSave = () => {
        if (!modalData.lesson?.name) {
            toast.error("Name is required");
            return;
        }
        if (modalData.isEdit) {
            dispatch(editLesson(modalData.lesson));
        } else {
            dispatch(createLesson(modalData.lesson));
        }
        setModalData({ showModal: false, isEdit: false, lesson: { id: '', name: '', description: '', duration: '' } });
    };

    const handleCancel = () => {
        setModalData({ showModal: false, isEdit: false, lesson: { id: '', name: '', description: '', duration: '' } });
    };

    return (
        <div className="p-6 bg-white shadow rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Manage Lessons</h2>
            <div className="flex justify-between items-center mb-4">
                <p className="font-medium">{lessons?.length} Lessons</p>
                <div className="flex gap-2">
                    <button
                        onClick={handleAdd}
                        className="border border-blue-500 text-blue-500 px-4 py-1 rounded hover:bg-blue-50"
                    >
                        + Add Lesson
                    </button>
                </div>
            </div>

            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-gray-100 text-left">
                        <th className="p-2">Lesson Name</th>
                        <th className="p-2">Description</th>
                        <th className="p-2">Duration</th>
                        <th className="p-2">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {lessons?.map((lesson) => (
                        <tr key={lesson.id} className="border-t">
                            <td className="p-2">{lesson.name}</td>
                            <td className="p-2">{lesson.description}</td>
                            <td className="p-2">{lesson.duration}</td>
                            <td className="p-2 flex gap-2">
                                <button
                                    onClick={() => handleEdit(lesson)}
                                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(lesson.id)}
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
                contentLabel="Edit Lesson"
                className="bg-white rounded-lg shadow-lg p-6 min-w-[320px] w-full max-w-md mx-auto mt-32 outline-none"
                overlayClassName="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50"
            >
                <h3 className="text-lg font-bold mb-4">{modalData.lesson?.id ? 'Edit Lesson' : 'Add Lesson'}</h3>
                <div className="flex flex-col gap-3">
                    <input
                        className="border p-2 rounded"
                        name="name"
                        value={modalData.lesson?.name || ''}
                        onChange={handleChange}
                        placeholder="Lesson Name"
                    />
                    <input
                        className="border p-2 rounded"
                        name="description"
                        value={modalData.lesson?.description || ''}
                        onChange={handleChange}
                        placeholder="Description"
                    />
                    <input
                        className="border p-2 rounded"
                        name="duration"
                        value={modalData.lesson?.duration || ''}
                        onChange={handleChange}
                        placeholder="Duration (minutes)"
                        type="number"
                        min="1"
                    />
                </div>
                <div className="flex justify-end gap-2 mt-6">
                    <button onClick={handleCancel} className="px-4 py-1 rounded border">Cancel</button>
                    <button onClick={handleSave} disabled={!modalData.lesson?.name || loading} className="px-4 py-1 rounded bg-blue-500 text-white">Save</button>
                </div>
            </Modal>

        </div>
    );
};

export default ManageLesson;
