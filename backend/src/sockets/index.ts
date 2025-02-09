import { Socket, Server } from "socket.io";
import { User } from "../models/user.model";

export const initSockets = (io: Server) => {
    // This function sets up the "connection" event
    io.on('connection', async (socket: Socket) => {
        const userId = socket.handshake.query["userId"];
        const socketId = socket.id;
        console.log(`User ${userId} connected with socket id ${socketId}`);

        if (userId) {
            await User.findByIdAndUpdate(userId, { socketId });
        }

        socket.on('disconnect', () => {
            console.log('Socket disconnected:', socket.id);
            socket.disconnect();
        });
    });
};