# 🧠 Webalar-MERN-Submission By Daksh Arora

A real-time collaborative task board inspired by Trello, featuring drag-and-drop tasks, conflict handling, smart assignment, and activity logs using the MERN stack and Socket.IO.

---

## 📌 Overview

This application allows users to:

- ✅ Create, edit, delete, and drag/drop tasks between status columns (To Do, In Progress, Done)
- 🚦 Assign task priorities and team members
- ⚡ Collaborate in real-time using Socket.IO
- 🤖 Automatically assign unassigned tasks with Smart Assign
- ⚔️ Resolve data conflicts using a Merge Conflict UI
- 🧾 Track all actions in a live activity log panel

---

## ✨ Features

- 🔐 User authentication and authorization (JWT-based)
- 🌐 RESTful API with Express and Node.js
- ⚛️ Frontend built with React + Vite
- 📦 State management via React hooks + context
- 💾 MongoDB for data persistence
- 🎨 Fully responsive UI using Tailwind CSS
- 💡 Conflict resolution with intelligent merge option
- 🔄 Real-time updates via Socket.IO
- 📜 Activity logging for all CRUD and drag operations

---

## 🛠 Tech Stack

**Frontend:**
- React (Vite)
- Tailwind CSS
- Axios
- @dnd-kit/core
- Socket.IO-client

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- JWT for auth
- Socket.IO for real-time events

---

## ⚙️ Getting Started

### ✅ Prerequisites

- Node.js and npm installed
- MongoDB running locally or via cloud (e.g. MongoDB Atlas)

---

## 📥 Installation

1. **Clone the repository:**

```bash
git clone https://github.com/yourusername/Webalar-MERN-Submission.git
```

2. **Navigate to the project:**

```bash
cd Webalar-MERN-Submission
```

3. **Install server dependencies:**

```bash
cd server
npm install
```

4. **Install client dependencies:**
```bash
cd ../client
npm install
```

---

## 🚀 Running the App

1. **Start the backend:**
```bash
cd server
npm run dev
```

2. **Start the frontend:**
```bash
cd ../client
npm run dev
```

3. **Visit the app:**
 Open your browser and navigate to http://localhost:5173

---

## 🤖 Smart Assign Logic

When a task is unassigned, clicking **Smart Assign** auto-distributes it to the most available user.

- MongoDB aggregation checks the number of active tasks (To Do or In Progress) per user.
- The user with the least number of active tasks is selected.
- The task is assigned and Socket.IO notifies all clients.

✅ Ensures balanced workload among users.

---

## ⚔️ Conflict Handling Logic

Conflicts occur when two users try to edit the same task simultaneously.

### Steps:

1. Each task tracks a `lastUpdated` timestamp.
2. On update, client sends its last-known `lastUpdated`.
3. Backend checks if a newer update exists.
4. If yes, backend returns a conflict response containing:
   - Your attempted changes
   - Latest server version

🧠 User gets a **Merge Conflict UI**:

- For each field (`name`, `desc`, `priority`, `assignee`), they choose to keep "Yours" or "Latest".
- Only after all fields are chosen, the **Merge & Overwrite** button is enabled.

🔒 Prevents unintentional overwrites while supporting collaboration.

---

## 🌍 Deployment

🔗 **Live App**: https://webalar-mern-submission.vercel.app/  
🎥 **Demo Video**: https://github.com/Lethal-Tempest/Webalar-MERN-Submission.git

---

## 👨‍💻 Author

**Daksh Arora**  
Reach out on [LinkedIn](www.linkedin.com/in/daksh-arora-dev05)  
Raise issues or contribute PRs via [GitHub](https://github.com/Lethal-Tempest/Webalar-MERN-Submission.git)
