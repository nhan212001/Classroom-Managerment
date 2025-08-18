import { createSlice } from '@reduxjs/toolkit'
import { getChatsByUserId, getMessagesByChatId, createChat, sendMessage } from '../apis/chatApi';

const initialState = {
    chats: [],
    messages: [],
    loading: false,
    error: null,
}

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        addMessage: (state, action) => {
            state.messages.push(action.payload);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getChatsByUserId.pending, (state) => {
                state.loading = true;
            })
            .addCase(getChatsByUserId.fulfilled, (state, action) => {
                state.loading = false;
                state.chats = action.payload;
            })
            .addCase(getChatsByUserId.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.error;
            })
            .addCase(getMessagesByChatId.pending, (state) => {
                state.loading = true;
            })
            .addCase(getMessagesByChatId.fulfilled, (state, action) => {
                state.loading = false;
                state.messages = action.payload;
            })
            .addCase(getMessagesByChatId.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.error;
            })
            .addCase(createChat.pending, (state) => {
                state.loading = true;
            })
            .addCase(createChat.fulfilled, (state, action) => {
                state.loading = false;
                state.chats.push(action.payload);
            })
            .addCase(createChat.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.error;
            })
            .addCase(sendMessage.pending, (state) => {
                state.loading = true;
            })
            .addCase(sendMessage.fulfilled, (state, action) => {
                state.loading = false;
                const { message } = action.payload;
                state.messages.push(message);
            })
            .addCase(sendMessage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.error;
            });
    },
});

export const { addMessage } = chatSlice.actions;
export const selectChats = (state) => state.chat.chats;
export const selectMessages = (state) => state.chat.messages;
export const selectLoadingChat = (state) => state.chat.loading;
export const selectErrorChat = (state) => state.chat.error;

export default chatSlice.reducer;