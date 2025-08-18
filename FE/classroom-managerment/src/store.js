import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import studentReducer from './slices/studentSlice';
import popupReducer from './slices/popupSlice';
import lessonReducer from './slices/lessonSlice';
import enrollmentReducer from './slices/enrollmentSlice';


const logger = store => next => action => {
    console.log('dispatching', action);
    const result = next(action);
    console.log('next state', store.getState());
    return result;
};

const store = configureStore({
    reducer: {
        auth: authReducer,
        student: studentReducer,
        popup: popupReducer,
        lesson: lessonReducer,
        enrollment: enrollmentReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});

export default store;

