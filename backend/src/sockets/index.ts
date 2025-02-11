import { Socket, Server } from "socket.io";
import { User } from "@/models/user.model";
import { registerChatHandlers } from "./chat.handler";

export const onlineUsers = new Map<string, string>();

export const initSockets = (io: Server) => {
    io.on('connection', async (socket: Socket) => {
        const userId = socket.handshake.query.userId as string;
        const socketId = socket.id;
        console.log(`User ${userId} connected`);
        // Update user's online status
        if (userId) {
            onlineUsers.set(userId, socketId);
            await User.findByIdAndUpdate(userId, { isOnline: true });
        }

        io.emit('online_users', Array.from(onlineUsers.keys()));

        registerChatHandlers(io, socket);

        socket.on('disconnect', async() => {
            if (userId) {
                onlineUsers.delete(userId);
                await User.findByIdAndUpdate(userId, { isOnline: false, lastSeen: new Date() });
            }
            io.emit('online_users', Array.from(onlineUsers.keys()));
        });
    });
};