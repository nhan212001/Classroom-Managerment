import { callApi } from "./apiCaller";
import { createAsyncThunk } from "@reduxjs/toolkit";

const getAllLesson = createAsyncThunk(
    "lessons/getAll",
    async (_, thunkAPI) => {
        try {
            const response = await callApi({
                method: 'GET',
                url: '/lesson'
            });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);

const createLesson = createAsyncThunk(
    "lessons/create",
    async ({ name, description, duration }, thunkAPI) => {
        try {
            const response = await callApi({
                method: 'POST',
                url: '/lesson',
                data: { name, description, duration }
            });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);

const editLesson = createAsyncThunk(
    "lessons/edit",
    async ({ id, name, description, duration }, thunkAPI) => {
        try {
            const response = await callApi({
                method: 'PUT',
                url: `/lesson/${id}`,
                data: { name, description, duration }
            });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);

const deleteLesson = createAsyncThunk(
    "lessons/delete",
    async (id, thunkAPI) => {
        try {
            const response = await callApi({
                method: 'DELETE',
                url: `/lesson/${id}`
            });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);

export { getAllLesson, createLesson, editLesson, deleteLesson };
