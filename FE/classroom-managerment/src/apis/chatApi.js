import { callApi } from "./apiCaller";
import { createAsyncThunk } from "@reduxjs/toolkit";

const getChatsByUserId = createAsyncThunk(
    'chat/getChatsByUserId', async (userId, thunkAPI) => {
        try {
            const response = await callApi({
                method: 'GET',
                url: `/chat/user/${userId}`
            });
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);

const getMessagesByChatId = createAsyncThunk(
    'chat/getMessagesByChatId', async (chatId, thunkAPI) => {
        try {
            const response = await callApi({
                method: 'GET',
                url: `/chat/${chatId}/messages`
            });
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);

const createChat = createAsyncThunk(
    'chat/createChat', async ({ instructorId, studentId }, thunkAPI) => {
        try {
            const response = await callApi({
                method: 'POST',
                url: '/chat/create',
                data: {
                    instructorId,
                    studentId
                }
            });
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);

const sendMessage = createAsyncThunk(
    'chat/sendMessage', async ({ chatId, senderId, receiverId, text }, thunkAPI) => {
        try {
            const response = await callApi({
                method: 'POST',
                url: `/chat/${chatId}/messages`,
                data: {
                    senderId,
                    receiverId,
                    text
                }
            });
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);

export {
    getChatsByUserId,
    getMessagesByChatId,
    createChat,
    sendMessage
};