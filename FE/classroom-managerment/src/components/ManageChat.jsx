
import { useState, useEffect } from "react";
import Modal from "react-modal";
import { useDispatch, useSelector } from "react-redux";
import { addMessage, selectChats, selectErrorChat, selectLoadingChat, selectMessages } from "../slices/chatSlice";
import { createChat, getChatsByUserId, getMessagesByChatId, sendMessage } from "../apis/chatApi";
import { selectUser } from "../slices/authSlice";
import { selectStudents } from "../slices/studentSlice";
import { toast } from "react-toastify";
import socket from "../socket";

const SOCKET_URL = process.env.REACT_APP_BE_URL;

const Chat = () => {
    const chats = useSelector(selectChats);
    const messages = useSelector(selectMessages);
    const loading = useSelector(selectLoadingChat);
    const error = useSelector(selectErrorChat);
    const user = useSelector(selectUser);
    const students = useSelector(selectStudents);
    const dispatch = useDispatch();

    const [selectedChat, setSelectedChat] = useState({});
    const [text, setText] = useState("");
    const [modalData, setModalData] = useState({
        showModal: false,
        selectedStudentId: null,
    });

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    useEffect(() => {
        if (user?.id) {
            dispatch(getChatsByUserId(user.id));

            socket.emit("register", user.id);

            socket.on("newMessage", (data) => {
                const { chatId, message } = data;

                if (chatId === selectedChat.id) {
                    dispatch(addMessage(message));
                }
            });

        }
        return () => {
            socket.off("newMessage");
        };

    }, [user, selectedChat]);

    useEffect(() => {
        if (selectedChat?.id) {
            dispatch(getMessagesByChatId(selectedChat.id));
        }
    }, [selectedChat]);

    const handleSendMessage = () => {
        if (selectedChat?.id && user.id && text.trim()) {
            const receiverId = user.id === selectedChat.instructorId ? selectedChat.studentId : selectedChat.instructorId;
            dispatch(sendMessage({ chatId: selectedChat.id, senderId: user.id, receiverId, text: text.trim() }));
            setText(""); // Reset input after sending
        }
    };

    const handleCreateChat = () => {
        if (modalData.selectedStudentId) {
            dispatch(createChat({ instructorId: user.id, studentId: modalData.selectedStudentId }));
            setModalData({ showModal: false, selectedStudentId: null });
        }
    }

    return (
        <div className="flex h-[700px] bg-white rounded shadow overflow-hidden">
            <div className="w-64 border-r bg-gray-50 p-4 overflow-y-auto">
                <ul>
                    {chats?.map((chat) => (
                        <li
                            key={chat.id}
                            className={`p-2 rounded cursor-pointer mb-2 ${selectedChat?.id === chat.id ? "bg-blue-100" : "hover:bg-gray-200"}`}
                            onClick={() => {
                                setSelectedChat(chat);
                                setText("");
                            }}
                        >
                            {chat.contactName}
                        </li>
                    ))}
                </ul>
                <div className="mt-6">
                    <button
                        className="bg-green-500 text-white px-4 py-2 rounded w-full"
                        onClick={() => setModalData({ ...modalData, showModal: true })}
                    >
                        Create chat with student
                    </button>
                </div>
            </div>
            {selectedChat?.id && (
                <div className="flex-1 flex flex-col">
                    <div className="flex-1 p-4 overflow-y-auto">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`mb-2 flex ${msg.senderId === user?.id ? "justify-end" : "justify-start"}`}>
                                <div className={`px-3 py-2 rounded-lg max-w-xs ${msg.senderId === user?.id ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"}`}>
                                    {msg.text}
                                    <div className="text-xs text-right mt-1 opacity-60">{new Date(msg.createdAt?._seconds * 1000).toLocaleTimeString()}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-3 border-t flex gap-2">
                        <input
                            className="flex-1 border rounded px-3 py-2"
                            value={text}
                            onChange={e => setText(e.target.value)}
                            placeholder="Type a message..."
                            onKeyDown={e => e.key === "Enter" && handleSendMessage()}
                        />
                        <button onClick={handleSendMessage} className="bg-blue-500 text-white px-4 py-2 rounded">Send</button>
                    </div>
                </div>
            )}
            <Modal
                isOpen={modalData.showModal}
                onRequestClose={() => setModalData({ ...modalData, showModal: false })}
                contentLabel="Create chat with student"
                className="bg-white rounded-lg shadow-lg p-6 min-w-[320px] w-full max-w-md mx-auto mt-32 outline-none"
                overlayClassName="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50"
            >
                <h3 className="text-lg font-bold mb-4">Create chat with student</h3>
                <div className="flex flex-col gap-3">
                    <select
                        className="border p-2 rounded"
                        value={modalData.selectedStudentId || ''}
                        onChange={e => setModalData({ ...modalData, selectedStudentId: e.target.value })}
                    >
                        <option value="">Select student</option>
                        {students
                            ?.filter(student =>
                                !chats?.some(
                                    chat =>
                                        chat.instructorId === student.id ||
                                        chat.studentId === student.id
                                )
                            )
                            .map((student) => (
                                <option key={student.id} value={student.id}>
                                    {student.name}
                                </option>
                            ))}
                    </select>
                </div>
                <div className="flex justify-end gap-2 mt-6">
                    <button onClick={() => setModalData({ ...modalData, showModal: false })} className="px-4 py-1 rounded border">Cancel</button>
                    <button
                        onClick={handleCreateChat}
                        disabled={!modalData.selectedStudentId}
                        className="px-4 py-1 rounded bg-blue-500 text-white"
                    >Create chat</button>
                </div>
            </Modal>
        </div>
    );
};

export default Chat;
