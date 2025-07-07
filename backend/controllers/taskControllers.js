import Task from "../models/taskModel.js";

export const add = async (req, res) => {
  try {
    const { name, desc, assUser, status, priority } = req.body;
    if (!name || !desc || !assUser || !status || !priority) {
      return res.status(400).json({ success: false, message: "All required fields must be provided" });
    }
    const newTask = new Task({
      name,
      desc,
      assUser,
      status,
      priority,
    });
    await newTask.save();
    res.status(201).json({ success: true, message: "Task added successfully", task: newTask });
  } catch (error) {
    console.error("Error adding task:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const list = async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.status(200).json({ success: true, tasks });
  } catch (error) {
    console.error("Error listing tasks:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
}