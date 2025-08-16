import { createSlice } from '@reduxjs/toolkit'
import { checkUserForLogin, loginOtp, loginPassword } from '../apis/authApi';


const initialState = {
    user: null,
    token: null,
    role: null,
    loading: false,
    error: null,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state = initialState;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(checkUserForLogin.pending, (state) => {
                state.loading = true;
            })
            .addCase(checkUserForLogin.fulfilled, (state, action) => {
                state.loading = false;
                state.role = action.payload.role;
            })
            .addCase(checkUserForLogin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(loginOtp.pending, (state) => {
                state.loading = true;
            })
            .addCase(loginOtp.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.role = action.payload.user.role;
            })
            .addCase(loginOtp.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(loginPassword.pending, (state) => {
                state.loading = true;
            })
            .addCase(loginPassword.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.role = action.payload.user.role;
            })
            .addCase(loginPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
})

export const { logout } = authSlice.actions;
export default authSlice.reducer;
