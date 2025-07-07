// ✅ ShopContext.jsx
import React, { createContext, useContext } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

const ShopContext = createContext();

export const useShopContext = () => useContext(ShopContext);

const socket = io('http://localhost:5000');

export const Columns = [
  {
    id: "todo",
    title: "To Do"
  },
  {
    id: "ip",
    title: "In Progress"
  },
  {
    id: "done",
    title: "Done"
  }
]

export const ShopProvider = ({ children }) => {
  const backendUrl = 'http://localhost:5000';
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.post(backendUrl + '/api/user/users');
        if (response.data.success) {
          const data = response.data.users;
          setUsers(data);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    const fetchTasks = async () => {
      try {
        const response = await axios.post(backendUrl + '/api/task/list');
        if (response.data.success) {
          const data = response.data.tasks;
          setTasks(data);
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchUsers();
    fetchTasks();

    // 🔴 Real-time update when task is added
    socket.on('taskAdded', (task) => {
      setTasks((prevTasks) => [...prevTasks, task]);
    });

    // 🟢 Real-time update when task is updated
    socket.on('taskUpdated', (updatedTask) => {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === updatedTask._id ? updatedTask : task
        )
      );
    });

    socket.on('taskDeleted', (id) => {
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));
    });

    return () => {
      socket.off('taskAdded');
      socket.off('taskUpdated');
      socket.off('taskDeleted');
    };
  }, []);


  return (
    <ShopContext.Provider value={{ socket, backendUrl, Columns, users, tasks, setTasks }}>
      {children}
    </ShopContext.Provider>
  );
};
