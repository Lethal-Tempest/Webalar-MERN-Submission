// models/logModel.js
import mongoose from 'mongoose';

const logSchema = new mongoose.Schema({
  message: String,
  user: String,
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model('Log', logSchema);
