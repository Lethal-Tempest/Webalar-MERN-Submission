import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    name: { type: String, required: true },
    desc: { type: String, required: true },
    assUser: { type: String, required: true },
    status: { type: String, required: true },
    priority: { type: String, required: true },
    lastUpdated: { type: Date, default: Date.now() },
});

export default mongoose.model("Task", taskSchema);