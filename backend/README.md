# Video Call Backend Server

Express.js backend server with Socket.IO for WebRTC video calling application.

## Features

- Socket.IO for real-time peer-to-peer signaling
- CORS enabled for cross-origin requests
- Support for WebRTC call initiation and answering
- Connection management and user tracking

## Installation

```bash
npm install
```

## Environment Variables

Create a `.env` file in the backend directory with the following variables:

```
PORT=5000
CLIENT_URL=http://localhost:3000
```

## Running the Server

### Development mode (with auto-restart):
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

The server will start on `http://localhost:5000` (or your configured PORT).

## Socket.IO Events

### Server -> Client
- `connected` - Emitted when a client connects, sends back the socket ID
- `callUser` - Emitted to notify a user of an incoming call
- `callAccepted` - Emitted when a call is accepted
- `callEnded` - Emitted when a call ends

### Client -> Server
- `callUser` - Initiate a call to another user
- `answerCall` - Answer an incoming call
- `endCall` - End an active call

## Deployment

For production deployment (e.g., Render.com):
1. Set the `CLIENT_URL` environment variable to your frontend URL
2. Ensure PORT is configured (most platforms set this automatically)
3. Update your frontend Socket.IO connection URL to match your backend deployment URL
