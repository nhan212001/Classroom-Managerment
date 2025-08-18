import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "react-modal";
import { selectEnrollments, selectLoadingEnrollments, selectErrorEnrollments } from "../slices/enrollmentSlice";
import { addEnrollment, changeEnrollmentStatus, deleteEnrollment, getAllEnrollments, getEnrollmentByStudentId } from "../apis/enrollmentApi";
import { toast } from "react-toastify";
import { selectRole, selectUser } from "../slices/authSlice";
import { USER_ROLE } from "../common/constant";
import { selectStudents } from "../slices/studentSlice";
import { selectLessons } from "../slices/lessonSlice";
import { getAllStudents } from "../apis/userApi";
import { getAllLesson } from "../apis/lessonApi";

const ManageEnrollment = () => {
    const enrollments = useSelector(selectEnrollments);
    const loading = useSelector(selectLoadingEnrollments);
    const error = useSelector(selectErrorEnrollments);
    const role = useSelector(selectRole);
    const user = useSelector(selectUser);
    const students = useSelector(selectStudents);
    const lessons = useSelector(selectLessons);

    const dispatch = useDispatch();

    const [modalData, setModalData] = useState({
        showModal: false,
        enrollment: {
            id: '',
            studentId: '',
            lessonId: '',
            isDone: false
        }
    });

    useEffect(() => {
        if (role === USER_ROLE.INSTRUCTOR) {
            dispatch(getAllEnrollments());
        } else if (role === USER_ROLE.STUDENT) {
            dispatch(getEnrollmentByStudentId(user.id));
        }
    }, [role]);

    useEffect(() => {
        if (role === USER_ROLE.INSTRUCTOR) {
            dispatch(getAllStudents());
            dispatch(getAllLesson());
        }
    }, []);

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    const handleAdd = () => {
        setModalData({ showModal: true, enrollment: { studentId: '', lessonId: '', isDone: false } });
    };

    const handleDelete = (id) => {
        dispatch(deleteEnrollment(id))
    };

    const handleChange = (e) => {
        setModalData({ ...modalData, enrollment: { ...modalData.enrollment, [e.target.name]: e.target.value } });
    };

    const handleSave = () => {
        if (role === USER_ROLE.STUDENT) {
            toast.error("Students cannot add enrollments");
            return;
        }
        if (!modalData.enrollment?.studentId || !modalData.enrollment?.lessonId) {
            toast.error("Student ID and Lesson ID are required");
            return;
        }
        dispatch(addEnrollment({
            studentId: modalData.enrollment.studentId,
            lessonId: modalData.enrollment.lessonId
        }))
        setModalData({ ...modalData, showModal: false });
    };

    const handleCancel = () => {
        setModalData({ showModal: false, enrollment: { id: '', studentId: '', lessonId: '', isDone: false } });
    };

    const handleChangeStatus = (enrollment) => {
        dispatch(changeEnrollmentStatus({
            enrollmentId: enrollment.id,
            isDone: !enrollment.isDone
        }));
    }

    return (
        <div className="p-6 bg-white shadow rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Manage Enrollments</h2>
            <div className="flex justify-between items-center mb-4">
                <p className="font-medium"> {enrollments?.length} Enrollments</p>
                <div className="flex gap-2">
                    {role === USER_ROLE.INSTRUCTOR && (
                        <button
                            onClick={handleAdd}
                            className="border border-blue-500 text-blue-500 px-4 py-1 rounded hover:bg-blue-50"
                        >
                            + Add Enrollment
                        </button>
                    )}
                </div>
            </div>

            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-gray-100 text-left">
                        <th className="p-2">Student</th>
                        <th className="p-2">Lesson</th>
                        <th className="p-2">Status</th>
                        {role !== USER_ROLE.STUDENT && (
                            <th className="p-2">Action</th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {enrollments?.map((enrollment) => (
                        <tr key={enrollment.id} className="border-t">
                            <td className="p-2">{enrollment.studentName || students?.find(student => student.id === enrollment.studentId)?.name}</td>
                            <td className="p-2">{enrollment.lessonName || lessons?.find(lesson => lesson.id === enrollment.lessonId)?.name}</td>
                            <td className="p-2 flex gap-2">
                                <button
                                    onClick={() => handleChangeStatus(enrollment)}
                                    className={`px-3 py-1 rounded text-white ${enrollment.isDone
                                        ? 'bg-green-500 hover:bg-green-600'
                                        : 'bg-yellow-400 hover:bg-yellow-500 text-black'
                                        }`}
                                >
                                    {enrollment.isDone ? 'Complete' : 'Incomplete'}
                                </button>
                            </td>
                            {role !== USER_ROLE.STUDENT && (
                                <td>
                                    <button
                                        onClick={() => handleDelete(enrollment.id)}
                                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                    >
                                        Delete
                                    </button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
            {loading && <p className="text-center text-gray-500">Loading...</p>}

            <Modal
                isOpen={modalData.showModal}
                onRequestClose={handleCancel}
                contentLabel="Edit Enrollment"
                className="bg-white rounded-lg shadow-lg p-6 min-w-[320px] w-full max-w-md mx-auto mt-32 outline-none"
                overlayClassName="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50"
            >
                <h3 className="text-lg font-bold mb-4">Add Enrollment</h3>
                <div className="flex flex-col gap-3">
                    <select
                        className="border p-2 rounded"
                        name="studentId"
                        value={modalData.enrollment?.studentId || ''}
                        onChange={handleChange}
                    >
                        <option value="">Select Student</option>
                        {students.map((student) => (
                            <option key={student.id} value={student.id}>
                                {student.name}
                            </option>
                        ))}
                    </select>
                    <select
                        className="border p-2 rounded"
                        name="lessonId"
                        value={modalData.enrollment?.lessonId || ''}
                        onChange={handleChange}
                    >
                        <option value="">Select Lesson</option>
                        {lessons.map((lesson) => (
                            <option key={lesson.id} value={lesson.id}>
                                {lesson.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex justify-end gap-2 mt-6">
                    <button onClick={handleCancel} className="px-4 py-1 rounded border">Cancel</button>
                    <button onClick={handleSave} disabled={!modalData.enrollment?.studentId || !modalData.enrollment?.lessonId || loading} className="px-4 py-1 rounded bg-blue-500 text-white">Save</button>
                </div>
            </Modal>

        </div>
    );
};

export default ManageEnrollment;
