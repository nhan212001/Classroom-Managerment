import { createSlice } from "@reduxjs/toolkit";
import { createLesson, deleteLesson, editLesson, getAllLesson } from "../apis/lessonApi";

const initialState = {
    lessons: [],
    loading: false,
    error: null
};

const lessonSlice = createSlice({
    name: 'lesson',
    initialState,
    reducers: {
        resetLessonState: (state) => {
            return initialState;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllLesson.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllLesson.fulfilled, (state, action) => {
                state.loading = false;
                state.lessons = action.payload;
            })
            .addCase(getAllLesson.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.error;
            })
            .addCase(createLesson.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createLesson.fulfilled, (state, action) => {
                state.loading = false;
                state.lessons.push(action.payload);
            })
            .addCase(createLesson.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.error;
            }).addCase(editLesson.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(editLesson.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.lessons.findIndex(lesson => lesson.id === action.payload.id);
                if (index !== -1) {
                    state.lessons[index] = action.payload;
                }
            })
            .addCase(editLesson.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.error;
            })
            .addCase(deleteLesson.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteLesson.fulfilled, (state, action) => {
                state.loading = false;
                state.lessons = state.lessons.filter(lesson => lesson.id !== action.payload.id);
            })
            .addCase(deleteLesson.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.error;
            });
    }
});


export const { resetLessonState } = lessonSlice.actions;
export const selectLessons = (state) => state.lesson.lessons;
export const selectLoadingLessons = (state) => state.lesson.loading;
export const selectErrorLessons = (state) => state.lesson.error;

export default lessonSlice.reducer;
