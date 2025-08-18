import { createSlice } from '@reduxjs/toolkit'
import { addEnrollment, changeEnrollmentStatus, deleteEnrollment, getAllEnrollments, getEnrollmentByStudentId } from '../apis/enrollmentApi';

const initialState = {
    enrollments: [],
    loading: false,
    error: null
};

const enrollmentSlice = createSlice({
    name: 'enrollment',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder.addCase(getAllEnrollments.pending, (state) => {
            state.loading = true;
            state.error = null;
        }).addCase(getAllEnrollments.fulfilled, (state, action) => {
            state.loading = false;
            state.enrollments = action.payload;
        }).addCase(getAllEnrollments.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload.error;
        }).addCase(getEnrollmentByStudentId.pending, (state) => {
            state.loading = true;
            state.error = null;
        }).addCase(getEnrollmentByStudentId.fulfilled, (state, action) => {
            state.loading = false;
            state.enrollments = action.payload;
        }).addCase(getEnrollmentByStudentId.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload.error;
        }).addCase(addEnrollment.pending, (state) => {
            state.loading = true;
            state.error = null;
        }).addCase(addEnrollment.fulfilled, (state, action) => {
            state.loading = false;
            state.enrollments.push(action.payload.enrollment);
        }).addCase(addEnrollment.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload.error;
        }).addCase(changeEnrollmentStatus.pending, (state) => {
            state.loading = true;
            state.error = null;
        }).addCase(changeEnrollmentStatus.fulfilled, (state, action) => {
            state.loading = false;
            const index = state.enrollments.findIndex(enrollment => enrollment.id === action.payload.enrollment?.id);
            if (index !== -1) {
                state.enrollments[index].isDone = action.payload.enrollment.isDone;
            }
        }).addCase(changeEnrollmentStatus.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload.error;
        }).addCase(deleteEnrollment.pending, (state) => {
            state.loading = true;
            state.error = null;
        }).addCase(deleteEnrollment.fulfilled, (state, action) => {
            state.loading = false;
            state.enrollments = state.enrollments.filter(enrollment => enrollment.id !== action.payload.id);
        }).addCase(deleteEnrollment.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload.error;
        });
    }
});

export const selectEnrollments = (state) => state.enrollment.enrollments;
export const selectLoadingEnrollments = (state) => state.enrollment.loading;
export const selectErrorEnrollments = (state) => state.enrollment.error;

export default enrollmentSlice.reducer;
