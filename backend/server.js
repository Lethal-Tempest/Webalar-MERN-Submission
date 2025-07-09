import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import { Server } from 'socket.io';
import http from 'http';
import logRoutes from './routes/logRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT;
const server = http.createServer(app);

// ✅ Define allowed origins first
const allowedOrigins = [
  'http://localhost:5174',
  'https://webalar-mern-submission.vercel.app'
];

// ✅ Initialize Socket.IO after defining allowedOrigins
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true
  }
});

// ✅ CORS middleware for Express
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

// Routes
app.use('/api/user', userRoutes);
app.use('/api/task', taskRoutes);
app.use('/api/log', logRoutes);

app.set('io', io);

io.on('connection', (socket) => {
  console.log('🟢 User connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('🔴 User disconnected:', socket.id);
  });
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected'))
.catch((err) => console.error('❌ MongoDB Error:', err));

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

export default app;
