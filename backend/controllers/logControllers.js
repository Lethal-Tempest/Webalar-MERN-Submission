// controllers/logController.js
import Log from "../models/logModel.js";

export const getLogs = async (req, res) => {
  try {
    const logs = await Log.find().sort({ timestamp: -1 }).limit(20);
    res.status(200).json({ success: true, logs });
  } catch (error) {
    console.error("Error fetching logs:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
