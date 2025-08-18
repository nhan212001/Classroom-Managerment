const userSockets = {};
let io;

const setupSocket = (socketIo) => {
    io = socketIo;

    io.on("connection", (socket) => {
        console.log("New user connected:", socket.id);

        socket.on("register", (userId) => {
            if (!userSockets[userId]) {
                userSockets[userId] = [];
            } if (userSockets[userId].includes(socket.id)) {
                console.log(`Socket ${socket.id} is already registered for user ${userId}`);
                return;
            }
            userSockets[userId].push(socket.id);
            console.log(`User ${userId} registered with socket ${socket.id}`);
        });

        socket.on("disconnect", () => {
            for (const [userId, socketIds] of Object.entries(userSockets)) {
                userSockets[userId] = socketIds.filter(id => id !== socket.id);
                if (userSockets[userId].length === 0) {
                    delete userSockets[userId];
                    console.log(`User ${userId} disconnected`);
                }
            }
        });
    });
}

const emitToUser = (userId, event, data) => {
    console.log('userSockets', userSockets);

    const socketIds = userSockets[userId];
    if (socketIds) {
        socketIds.forEach(socketId => {
            io.to(socketId).emit(event, data);
        });
    }
}

module.exports = { setupSocket, emitToUser };