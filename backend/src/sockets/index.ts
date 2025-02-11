import { Socket, Server } from "socket.io";
import { User } from "@/models/user.model";
import { registerChatHandlers } from "./chat.handler";

export const onlineUsers = new Map<string, string>();

export const initSockets = (io: Server) => {
    // This function sets up the "connection" event
    io.on('connection', async (socket: Socket) => {
        // Get user id and socket id from query params
        const userId = socket.handshake.query.userId as string;
        const socketId = socket.id;

        // Update user's online status
        if (userId) {
            onlineUsers.set(userId, socketId);
            await User.findByIdAndUpdate(userId, { isOnline: true });
        }

        console.log('User connected with id:', userId);

        io.emit('online_users', Array.from(onlineUsers.keys()));

        // Register chat handlers
        registerChatHandlers(io, socket);

        socket.on('disconnect', async() => {
            // Update user's online status
            if (userId) {
                onlineUsers.delete(userId);
                await User.findByIdAndUpdate(userId, { isOnline: false, lastSeen: new Date() });
            }
            // Broadcast updated online users list
            io.emit('online_users', Array.from(onlineUsers.keys()));
        });
    });
};