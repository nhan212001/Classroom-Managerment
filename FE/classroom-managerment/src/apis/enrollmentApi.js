import { callApi } from "./apiCaller";
import { createAsyncThunk } from "@reduxjs/toolkit";

const addEnrollment = createAsyncThunk(
    "enrollment/add",
    async ({ studentId, lessonId }, thunkAPI) => {
        try {
            const response = await callApi({
                method: 'POST',
                url: '/enrollment',
                data: { studentId, lessonId }
            });
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);

const getEnrollmentByStudentId = createAsyncThunk(
    "enrollment/getByStudentId",
    async (studentId, thunkAPI) => {
        try {
            const response = await callApi({
                method: 'GET',
                url: `/enrollment/student/${studentId}`
            });
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);

const getAllEnrollments = createAsyncThunk(
    "enrollment/getAll",
    async (_, thunkAPI) => {
        try {
            const response = await callApi({
                method: 'GET',
                url: '/enrollment'
            });
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);

const changeEnrollmentStatus = createAsyncThunk(
    "enrollment/changeStatus",
    async ({ enrollmentId, isDone }, thunkAPI) => {
        try {
            const response = await callApi({
                method: 'PUT',
                url: `/enrollment/${enrollmentId}`,
                data: { isDone }
            });
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);

const deleteEnrollment = createAsyncThunk(
    "enrollment/delete",
    async (enrollmentId, thunkAPI) => {
        try {
            const response = await callApi({
                method: 'DELETE',
                url: `/enrollment/${enrollmentId}`
            });
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);

export {
    addEnrollment,
    getEnrollmentByStudentId,
    getAllEnrollments,
    changeEnrollmentStatus,
    deleteEnrollment
};
