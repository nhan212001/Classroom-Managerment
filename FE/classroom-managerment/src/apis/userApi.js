import { callApi } from "./apiCaller";
import { createAsyncThunk } from "@reduxjs/toolkit";

const getAllStudents = createAsyncThunk(
    "users/getAll",
    async (_, thunkAPI) => {
        try {
            const response = await callApi({
                method: 'GET',
                url: '/user/student'
            });
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);

const addStudent = createAsyncThunk(
    "users/add",
    async ({ email, name, phone }, thunkAPI) => {
        try {
            const response = await callApi({
                method: 'POST',
                url: '/user/student',
                data: { email, name, phone }
            });
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);

const editUser = createAsyncThunk(
    "users/edit",
    async ({ email, name, phone, id }, thunkAPI) => {
        try {
            const response = await callApi({
                method: 'PUT',
                url: `/user/student/${id}`,
                data: { email, name, phone }
            });
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);

const deleteUser = createAsyncThunk(
    "users/delete",
    async (id, thunkAPI) => {
        try {
            const response = await callApi({
                method: 'DELETE',
                url: `/user/student/${id}`
            });
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);

export { getAllStudents, addStudent, editUser, deleteUser };
