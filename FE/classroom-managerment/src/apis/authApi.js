import { callApi } from "./apiCaller";
import { createAsyncThunk } from "@reduxjs/toolkit";


const checkUserForLogin = createAsyncThunk(
    'auth/checkUserForLogin',
    async (userName, thunkAPI) => {
        try {
            const response = await callApi({
                method: 'POST',
                url: '/auth/login-check',
                data: { userName }
            });
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);

const loginOtp = createAsyncThunk(
    'auth/loginOtp',
    async ({ userName, otp }, thunkAPI) => {
        try {
            const response = await callApi({
                method: 'POST',
                url: '/auth/login-otp',
                data: { userName, otp }
            });
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);

const loginPassword = createAsyncThunk(
    'auth/loginPassword',
    async ({ userName, password }, thunkAPI) => {
        try {
            const response = await callApi({
                method: 'POST',
                url: '/auth/login-pw',
                data: { userName, password }
            });
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);

export { checkUserForLogin, loginOtp, loginPassword }