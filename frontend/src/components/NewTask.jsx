import React from 'react'
import { useShopContext } from '../context/ShopContext'
import { useState } from 'react';
import axios from 'axios';

const NewTask = () => {
    const {users, backendUrl} = useShopContext();
    const [formData, setFormData]=useState({
        name: '',
        desc: '',
        assUser: 'Unassigned',
        status: 'todo',
        priority: 'low'
    })
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const response = await axios.post(`${backendUrl}/api/task/add`, formData, {headers: {token: localStorage.getItem('token')}});
    
          if (response.data.success) {
            setFormData({
                name: '',
                desc: '',
                assUser: 'Assign user',
                status: 'todo',
                priority: 'low'
            })
            console.log("✅ Success:", response.data.message);
          } else {
            console.log("❌ Failed:", response.data.message);
          }
        } catch (error) {
          console.error("❌ Error submitting form:", error.response?.data?.message || error.message);
        }
    }
  return (
    <div className="flex-1 bg-neutral-800 border border-neutral-700 rounded-2xl p-4 text-white text-xl justify-center">
          <h1 className='text-2xl text-neutral-300 font-semibold text-center pb-2'>NEW TASK</h1>
            <div className='flex flex-col gap-2'>
                <input onChange={(e) => setFormData({...formData, name: e.target.value})} value={formData.name} type="text" placeholder="Task Name" className="w-full bg-neutral-700 rounded-lg p-2 mt-2" />
                <input  onChange={(e) => setFormData({...formData, desc: e.target.value})} value={formData.desc} type="text" placeholder="Task Description" className="w-full bg-neutral-700 rounded-lg p-2 mt-2" />
                <div>
                    <div className='flex gap-5 items-center justify-between'>
                        <span className='text-neutral-300 text-md'>Assigned User</span>
                        <select className="bg-neutral-700 rounded-lg p-2 mt-2 w-1/2" onChange={(e) => setFormData({...formData, assUser: e.target.value})} value={formData.assUser}>
                            <option value="Unassigned">Unassigned</option>       
                            {
                                users.map((user) => (
                                    <option key={user.email} value={user.id}>{user.name}</option>
                                ))
                            }
                        </select>
                    </div>
                    <div className='flex gap-5 items-center justify-between'>
                        <span className='text-neutral-300'>Status</span>
                        <select onChange={(e) => setFormData({...formData, status: e.target.value})} value={formData.status} className="bg-neutral-700 rounded-lg p-2 mt-2 w-1/2">
                            <option value="todo">To Do</option>
                            <option value="ip">In Progress</option>
                            <option value="done">Done</option>
                        </select>
                    </div>
                    <div className='flex gap-5 items-center justify-between'>
                        <span className='text-neutral-300'>Priority</span>
                        <select onChange={(e) => setFormData({...formData, priority: e.target.value})} value={formData.priority} className="bg-neutral-700 rounded-lg p-2 mt-2 w-1/2">
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>
                </div>
                <button onClick={handleSubmit} className="w-full bg-neutral-900 rounded-lg p-2 mt-2 hover:bg-neutral-300 hover:text-neutral-900 transition-all duration-300 ease-in-out hover:cursor-pointer">Add Task</button>
            </div>
    </div>
  )
}

export default NewTask