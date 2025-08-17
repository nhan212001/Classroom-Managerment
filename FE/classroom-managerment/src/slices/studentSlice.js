import { createSlice } from '@reduxjs/toolkit'
import { addStudent, deleteUser, editUser, getAllStudents } from '../apis/userApi';

const initialState = {
    students: [],
    loading: false,
    error: null
}

const studentSlice = createSlice({
    name: 'student',
    initialState,
    reducers: {
        resetStudentState: (state) => {
            return initialState
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllStudents.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllStudents.fulfilled, (state, action) => {
                state.loading = false;
                state.students = action.payload;
            })
            .addCase(getAllStudents.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.error;
            })
            .addCase(addStudent.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addStudent.fulfilled, (state, action) => {
                state.loading = false;
                state.students.push(action.payload);
            })
            .addCase(addStudent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.error;
            })
            .addCase(editUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(editUser.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.students.findIndex(student => student.id === action.payload.id);
                if (index !== -1) {
                    state.students[index] = { ...state.students[index], ...action.payload };
                }
            })
            .addCase(editUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.error;
            })
            .addCase(deleteUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.loading = false;
                state.students = state.students.filter(student => student.id !== action.payload.id);
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.error;
            });
    }
});

export const { resetStudentState } = studentSlice.actions;
export const selectStudents = (state) => state.student.students;
export const selectLoadingStudents = (state) => state.student.loading;
export const selectErrorStudents = (state) => state.student.error;

export default studentSlice.reducer;