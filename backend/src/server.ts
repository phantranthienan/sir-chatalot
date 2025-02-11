import http from 'http';
import { Server as SocketServer } from 'socket.io';
import app from '@/app';
import { ENV } from '@/config/env';
import { initSockets } from '@/sockets';

// Create HTTP server from app
const server = http.createServer(app);

// Initialize Socket.io
export const io = new SocketServer(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

// Initialize socket logic
initSockets(io);

// Start server
server.listen(ENV.PORT, () => {
    console.log(`Server running on port ${ENV.PORT}`);
});