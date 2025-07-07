import Task from "../models/taskModel.js";

export const add = async (req, res) => {
  try {
    const { name, desc, assUser, status, priority } = req.body;
    const reservedColumnIds = ['to do', 'in progress', 'done'];

    if (!name || !desc || !assUser || !status || !priority) {
      return res.status(400).json({ success: false, message: "All required fields must be provided" });
    }

    if (reservedColumnIds.includes(name.trim().toLowerCase())) {
      return res.status(400).json({ success: false, message: "Task name cannot match a column name" });
    }

    const existingTask = await Task.findOne({ name: name.trim(), status });
    if (existingTask) {
      return res.status(400).json({ success: false, message: "Task with the same name already exists in this column" });
    }

    const newTask = new Task({ name, desc, assUser, status, priority });
    await newTask.save();

    const io = req.app.get('io');
    io.emit('taskAdded', newTask);

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

export const update = async (req, res) => {
  try {
    const { _id, name, desc, assUser, status, priority, id } = req.body;
    const userId = _id ?? id;
    const task = await Task.findById(userId);

    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    const reservedColumnIds = ['to do', 'in progress', 'done'];

    const newName = name ?? task.name;
    const newStatus = status ?? task.status;

    if (reservedColumnIds.includes(newName.trim().toLowerCase())) {
      return res.status(400).json({ success: false, message: "Task name cannot match a column name" });
    }

    const duplicate = await Task.findOne({
      _id: { $ne: task._id },
      name: newName.trim(),
      status: newStatus,
    });

    if (duplicate) {
      return res.status(400).json({ success: false, message: "Task with the same name already exists in this column" });
    }

    if (name !== undefined) task.name = name;
    if (desc !== undefined) task.desc = desc;
    if (assUser !== undefined) task.assUser = assUser;
    if (status !== undefined) task.status = status;
    if (priority !== undefined) task.priority = priority;

    await task.save();

    const io = req.app.get('io');
    io.emit('taskUpdated', task);

    res.status(200).json({ success: true, message: "Task updated successfully", task });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};


export const remove = async (req, res) => {
  try {
    const { id } = req.body;

    const deletedTask = await Task.findByIdAndDelete(id);
    if (!deletedTask) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    const io = req.app.get('io');
    io.emit('taskDeleted', deletedTask._id); // Emit only the ID

    res.status(200).json({ success: true, message: "Task deleted successfully", id: deletedTask._id });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

