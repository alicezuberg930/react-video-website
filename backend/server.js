const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

app.use(cors());

// Socket.IO configuration with CORS
const io = new Server(server, {
    cors: {
        origin: 'https://97ae7d995d48.ngrok-free.app',
        methods: ['GET', 'POST'],
        credentials: false
    }
});

// Basic health check endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Video call server is running',
        status: 'ok',
        connections: io.engine.clientsCount
    });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Send the socket ID to the connected client
    socket.emit('connected', { socketId: socket.id });

    // Handle call initiation - relay signal from caller to receiver
    socket.on('callUser', ({ signal, from, userToCall, name }) => {
        console.log(`User ${from} is calling ${userToCall}`);
        console.log('Call signal type:', typeof signal);

        // Emit to the specific user being called
        io.to(userToCall).emit('callUser', {
            signal: signal,
            from: from,
            name: name
        });
    });

    // Handle call answer - relay signal back to caller
    socket.on('answerCall', ({ signal, to }) => {
        console.log(`Call answered, sending signal to ${to}`);
        console.log('Answer signal type:', typeof signal);

        // Emit the answer signal back to the caller
        io.to(to).emit('callAccepted', {
            signal: signal
        });
    });

    // Handle call end
    socket.on('endCall', ({ to }) => {
        console.log(`Call ended with ${to}`);
        if (to) {
            io.to(to).emit('callEnded');
        }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
        // Optionally notify other users about disconnection
        socket.broadcast.emit('userDisconnected', { userId: socket.id });
    });

    // Optional: Handle errors
    socket.on('error', (error) => {
        console.error(`Socket error for ${socket.id}:`, error);
    });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`WebSocket server ready for connections`);
});

// Handle server errors
server.on('error', (error) => {
    console.error('Server error:', error);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, closing server...');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});
