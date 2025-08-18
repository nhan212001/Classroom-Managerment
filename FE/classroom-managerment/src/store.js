import { combineReducers, configureStore } from '@reduxjs/toolkit';
import authReducer, { logout } from './slices/authSlice';
import studentReducer from './slices/studentSlice';
import popupReducer from './slices/popupSlice';
import lessonReducer from './slices/lessonSlice';
import enrollmentReducer from './slices/enrollmentSlice';
import chatsReducer from './slices/chatSlice';


const logger = store => next => action => {
    console.log('dispatching', action);
    const result = next(action);
    console.log('next state', store.getState());
    return result;
};

const appReducer = combineReducers({
    auth: authReducer,
    student: studentReducer,
    popup: popupReducer,
    lesson: lessonReducer,
    enrollment: enrollmentReducer,
    chat: chatsReducer
});

const rootReducer = (state, action) => {
    if (action.type === logout.type) {
        return appReducer(undefined, action);
    }
    return appReducer(state, action);
};

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});

export default store;

