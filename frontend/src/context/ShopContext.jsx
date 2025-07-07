// ✅ ShopContext.jsx
import React, { createContext, useContext } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios';

const ShopContext = createContext();

export const useShopContext = () => useContext(ShopContext);

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
        if(response.data.success){
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
        if(response.data.success){
          const data = response.data.tasks;
          console.log(data);
          setTasks(data);
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    }
    fetchUsers();
    fetchTasks();
  }, []);

  return (
    <ShopContext.Provider value={{ backendUrl, Columns, users, tasks }}>
      {children}
    </ShopContext.Provider>
  );
};
