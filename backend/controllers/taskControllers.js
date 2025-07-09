import Task from "../models/taskModel.js";
import Log from '../models/logModel.js'; // ⬅️ Import log model
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

const getUserFromToken = async (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        return user;
    } catch (err) {
        console.error("JWT decode error:", err.message);
        return null;
    }
};

export const add = async (req, res) => {
    try {
        console.log(req.body);
        const { name, desc, assUser, status, priority } = req.body;
        const reservedColumnIds = ['to do', 'in progress', 'done'];
        const colName = {
            todo: 'To Do',
            ip: 'In Progress',
            done: 'Done'
        };
        const token = req.headers.token;
        const user = await getUserFromToken(token);
        if (!user) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

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

        await Log.create({
            message: `${user.name} added task "${newTask.name}" in ${colName[status]}`,
            user,
            timestamp: new Date()
        });

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
        const { _id, name, desc, assUser, status, priority, id, lastUpdated, force } = req.body;
        console.log(req.body);
        const taskId = _id || id;
        const colName = {
            todo: 'To Do',
            ip: 'In Progress',
            done: 'Done'
        };

        // ✅ Get the current user from JWT token in headers
        const token = req.headers.token;
        const user = await getUserFromToken(token);
        if (!user) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }

        const io = req.app.get('io');
        const originalAssUser = task.assUser;
        const originalStatus = task.status;

        console.log("🔍 Conflict Check:");
        console.log("➡️  Client's lastSeen:", lastUpdated);

        if (!force && lastUpdated) {
            try {
                const clientTime = new Date(lastUpdated).getTime();
                const serverTime = new Date(task.lastUpdated).getTime();

                console.log("🕒 Client:", new Date(lastUpdated).toISOString(), clientTime);
                console.log("🕒 Server:", task.lastUpdated.toISOString(), serverTime);
                console.log("➡️  Conflict?", clientTime < serverTime);

                if (clientTime <= serverTime) {
                    return res.status(409).json({
                        success: false,
                        conflict: true,
                        message: "Conflict detected: someone else already updated this task.",
                        currentTask: task,
                        yourChanges: req.body,
                    });
                }
            } catch (err) {
                console.error("⚠️ Error parsing lastUpdated:", err.message);
            }
        }


        let changedFields = [];

        if (name !== undefined && task.name !== name) {
            task.name = name;
            changedFields.push('name');
        }
        if (desc !== undefined && task.desc !== desc) {
            task.desc = desc;
            changedFields.push('description');
        }
        if (status !== undefined && task.status !== status) {
            task.status = status;
            changedFields.push('status');
        }
        if (priority !== undefined && task.priority !== priority) {
            task.priority = priority;
            changedFields.push('priority');
        }
        if (assUser !== undefined && task.assUser !== assUser) {
            task.assUser = assUser;
            changedFields.push('assignee');
        }

        console.log("Changed fields:", changedFields);
        task.lastUpdated = new Date();

        await task.save();
        io.emit('taskUpdated', task);

        if (changedFields.length > 0) {
            if (changedFields.length === 1 && changedFields[0] === 'assignee') {
                await Log.create({
                    message: `${user.name} assigned task "${task.name}" to ${assUser}`,
                    user: user._id,
                    timestamp: new Date()
                });
            } else if (changedFields.length === 1 && changedFields[0] === 'status') {
                await Log.create({
                    message: `${user.name} moved task "${task.name}" from "${colName[originalStatus]}" to "${colName[status]}"`,
                    user: user._id,
                    timestamp: new Date()
                });
            } else {
                await Log.create({
                    message: `${user.name} updated task "${task.name}" (${changedFields.join(', ')})`,
                    user: user._id,
                    timestamp: new Date()
                });
            }
        }

        res.status(200).json({ success: true, message: "Task updated successfully", task });

    } catch (error) {
        console.error("Error updating task:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};




export const remove = async (req, res) => {
    try {
        const { id } = req.body;
        const token = req.headers.token;
        const user = await getUserFromToken(token);
        if (!user) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const deletedTask = await Task.findByIdAndDelete(id);
        if (!deletedTask) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }

        const io = req.app.get('io');
        io.emit('taskDeleted', deletedTask._id); // Emit only the ID

        await Log.create({
            message: `${user.name} deleted task "${deletedTask.name}"`,
            user,
            timestamp: new Date()
        });

        res.status(200).json({ success: true, message: "Task deleted successfully", id: deletedTask._id });
    } catch (error) {
        console.error("Error deleting task:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

export const updateLastUpdated = async (req, res) => {
    try {
        const { id } = req.body;
        const task = await Task.findById(id);
        if (!task) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }
        task.lastUpdated = new Date();
        await task.save();
        res.status(200).json({ success: true, message: "Last updated updated successfully" });
    } catch (error) {
        console.error("Error updating last updated:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

export const smartAssign = async (req, res) => {
  try {
    const { taskId } = req.body;
    const token = req.headers.token;
    const user = await getUserFromToken(token);
    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const task = await Task.findById(taskId);
    if (!task || task.assUser !== 'Unassigned') {
      return res.status(400).json({ success: false, message: "Task is already assigned or doesn't exist." });
    }

    // Count active tasks per user (status 'todo' or 'ip')
    const userTaskCounts = await Task.aggregate([
      { $match: { assUser: { $ne: 'Unassigned' }, status: { $in: ['todo', 'ip'] } } },
      { $group: { _id: "$assUser", count: { $sum: 1 } } }
    ]);

    console.log(userTaskCounts);

    const allUsers = await User.find({});
    const countsMap = {};
    userTaskCounts.forEach(u => { countsMap[u._id.toString()] = u.count });

    console.log(countsMap);

    // Pick user with min count
    const sortedUsers = allUsers
      .map(u => ({ user: u, count: countsMap[u.name.toString()] || 0 }))
      .sort((a, b) => a.count - b.count);

    console.log(sortedUsers);

    const bestUser = sortedUsers[0]?.user;

    if (!bestUser) {
      return res.status(400).json({ success: false, message: "No users available to assign." });
    }

    task.assUser = bestUser.name;
    task.lastUpdated = new Date();
    await task.save();

    const io = req.app.get('io');
    io.emit('taskUpdated', task);

    await Log.create({
      message: `${user.name} smart-assigned task "${task.name}" to ${bestUser.name}`,
      user: user._id,
      timestamp: new Date()
    });

    res.status(200).json({ success: true, message: `Assigned to ${bestUser.name}`, task });

  } catch (err) {
    console.error("Smart assign failed:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};