// server.js

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';

import userRoutes from './routes/userRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import logRoutes from './routes/logRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Define allowed frontend URLs
const allowedOrigins = [
  'http://localhost:5000', // local frontend
  'https://webalar-mern-submission.vercel.app' // deployed frontend
];

// ✅ HTTP server for socket.io
const server = http.createServer(app);

// ✅ Socket.IO server with CORS
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true
  }
});

// ✅ Middleware
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());

// ✅ Routes
app.use('/api/user', userRoutes);
app.use('/api/task', taskRoutes);
app.use('/api/log', logRoutes);

// ✅ Attach io to app for use in controllers
app.set('io', io);

// ✅ Socket.IO events
io.on('connection', (socket) => {
  console.log('🟢 User connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('🔴 User disconnected:', socket.id);
  });
});

// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Connected'))
.catch((err) => console.error('❌ MongoDB Error:', err.message));

// ✅ Start server
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

export default app;
