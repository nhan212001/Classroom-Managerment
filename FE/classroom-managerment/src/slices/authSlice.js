import { createSlice } from '@reduxjs/toolkit'
import { checkUserForLogin, loginOtp, loginPassword, verifyToken } from '../apis/authApi';


const initialState = {
    user: null,
    token: null,
    role: null,
    phone: null,
    loading: false,
    error: null,
    loggedIn: false
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            return initialState;
        },
        setUser: (state, action) => {
            state.user = { ...state.user, ...action.payload };
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(checkUserForLogin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(checkUserForLogin.fulfilled, (state, action) => {
                state.loading = false;
                state.role = action.payload.role;
                state.phone = action.payload.phone;
            })
            .addCase(checkUserForLogin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.error;
            })
            .addCase(loginOtp.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginOtp.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.role = action.payload.user.role;
                state.loggedIn = true;
                localStorage.setItem('token', action.payload.token);
            })
            .addCase(loginOtp.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.error;
            })
            .addCase(loginPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginPassword.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.role = action.payload.user.role;
                state.loggedIn = true;
                localStorage.setItem('token', action.payload.token);
            })
            .addCase(loginPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.error;
            })
            .addCase(verifyToken.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(verifyToken.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.role = action.payload.user.role;
                state.loggedIn = true;
                localStorage.setItem('token', action.payload.token);
            })
            .addCase(verifyToken.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.error;
            });
    }
})

export const { logout, setUser } = authSlice.actions;
export const selectUser = (state) => state.auth.user;
export const selectLoadingAuth = (state) => state.auth.loading;
export const selectErrorAuth = (state) => state.auth.error;
export const selectRole = (state) => state.auth.role;
export const selectPhone = (state) => state.auth.phone;
export const selectLoggedIn = (state) => state.auth.loggedIn;

export default authSlice.reducer;
