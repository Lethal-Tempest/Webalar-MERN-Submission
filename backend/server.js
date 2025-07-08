import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import {Server} from 'socket.io';
import http from 'http';
import logRoutes from './routes/logRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT;
const server = http.createServer(app);
const io = new Server(server,
  {
    cors: {
      origin: '*'
    }
  }
);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/user', userRoutes);
app.use('/api/task', taskRoutes);
app.use('/api/log', logRoutes);

app.set('io', io);

io.on('connection', (socket) => {
  console.log('a user connected', socket.id);
  socket.on('disconnect', () => {
    console.log('user disconnected', socket.id);
  });
});

// MongoDB
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