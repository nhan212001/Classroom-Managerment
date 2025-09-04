import { createSlice } from '@reduxjs/toolkit'
import { getChatsByUserId, getMessagesByChatId, createChat, sendMessage } from '../apis/chatApi';

const initialState = {
    chats: [],
    messages: [],
    selectedChat: null,
    loading: false,
    error: null,
}

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        addMessage: (state, action) => {
            const { chatId, message } = action.payload;
            if (state.selectedChat && state.selectedChat.id === chatId) {
                state.messages.push(message);
            }
            const idx = state.chats.findIndex(chat => chat.id === chatId);
            if (idx !== -1) {
                state.chats[idx] = {
                    ...state.chats[idx],
                    lastMessage: message.text,
                    lastUpdated: message.createdAt,
                    senderId: message.senderId
                };
                state.chats.sort(
                    (a, b) => (b.lastUpdated?._seconds || 0) - (a.lastUpdated?._seconds || 0)
                );
            }
        },
        setSelectedChat: (state, action) => {
            state.selectedChat = action.payload;
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
                const { chat, message } = action.payload;
                if (state.selectedChat && state.selectedChat.id === chat.id) {
                    state.messages.push(message);
                }
                const idx = state.chats.findIndex(c => c.id === chat.id);
                if (idx !== -1) {
                    state.chats[idx] = {
                        ...state.chats[idx],
                        lastMessage: message.text,
                        lastUpdated: message.createdAt,
                        senderId: message.senderId
                    };
                    state.chats.sort((a, b) => (b.lastUpdated?._seconds || 0) - (a.lastUpdated?._seconds || 0));
                }
            })
            .addCase(sendMessage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.error;
            });
    },
});

export const { addMessage, setSelectedChat } = chatSlice.actions;
export const selectChats = (state) => state.chat.chats;
export const selectMessages = (state) => state.chat.messages;
export const selectLoadingChat = (state) => state.chat.loading;
export const selectErrorChat = (state) => state.chat.error;
export const selectSelectedChat = (state) => state.chat.selectedChat;

export default chatSlice.reducer;