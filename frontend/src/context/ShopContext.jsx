import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { jwtDecode } from 'jwt-decode'; // 👈 add this line

const ShopContext = createContext();
export const useShopContext = () => useContext(ShopContext);

const socket = io('https://webalar-mern-submission.onrender.com');

export const Columns = [
  { id: "todo", title: "To Do" },
  { id: "ip", title: "In Progress" },
  { id: "done", title: "Done" },
];

export const ShopProvider = ({ children }) => {
  const backendUrl = 'https://webalar-mern-submission.onrender.com';
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [logs, setLogs] = useState([]);
  const [currUser, setCurrUser] = useState(null); // 👈 current user

  const token = localStorage.getItem('token');

  const fetchLogs = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/log/logs');
      if (response.data.success) {
        setLogs(response.data.logs);
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.post(backendUrl + '/api/user/users');
        if (response.data.success) {
          setUsers(response.data.users);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    const fetchTasks = async () => {
      try {
        const response = await axios.post(backendUrl + '/api/task/list');
        if (response.data.success) {
          setTasks(response.data.tasks);
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchUsers();
    fetchTasks();
    fetchLogs();

    // Socket listeners
    socket.on('taskAdded', (task) => {
      setTasks((prev) => [...prev, task]);
      fetchLogs();
    });

    socket.on('taskUpdated', (updatedTask) => {
      setTasks((prev) =>
        prev.map((task) => (task._id === updatedTask._id ? updatedTask : task))
      );
      fetchLogs();
    });

    socket.on('taskDeleted', (id) => {
      setTasks((prev) => prev.filter((task) => task._id !== id));
      fetchLogs();
    });

    socket.on('userRegistered', () => {
      console.log("🟢 New user registered");
      fetchUsers(); // Re-fetch updated users list
    });

    return () => {
      socket.off('taskAdded');
      socket.off('taskUpdated');
      socket.off('taskDeleted');
      socket.off('userRegistered');
    };
  }, []);

  return (
    <ShopContext.Provider
      value={{
        socket,
        backendUrl,
        Columns,
        users,
        tasks,
        setTasks,
        logs,
        fetchLogs,
        currUser,  // ✅ expose current user
        token
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};
