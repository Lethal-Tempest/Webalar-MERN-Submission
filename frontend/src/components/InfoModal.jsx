import React, { useState } from 'react';
import axios from 'axios';
import { IoClose } from 'react-icons/io5';
import { useShopContext } from '../context/ShopContext';

const InfoModal = ({ setup, task, onClose }) => {
  const { backendUrl } = useShopContext();
  const [formData, setFormData] = useState({ ...task });
  const isEdit = setup === 'edit';

  const handleUpdate = async () => {
    try {
      const res = await axios.post(`${backendUrl}/api/task/update`, formData);
      console.log(res.data.message);
      onClose(); // Close modal after update
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  const bgColor =
    task.priority === 'low'
      ? 'bg-green-900'
      : task.priority === 'medium'
      ? 'bg-yellow-900'
      : 'bg-red-900';

  return (
    <div className="fixed top-0 left-0 w-screen h-screen bg-black/80 bg-opacity-50 z-100 flex justify-center items-center">
      <div className={`w-[90%] max-w-[500px] p-6 rounded-2xl shadow-lg text-white ${bgColor} relative`}>
        {/* Close */}
        <IoClose size={24} className="absolute top-4 right-4 cursor-pointer" onClick={onClose} />

        <h1 className="text-2xl text-center font-bold mb-4">{isEdit ? 'Edit Task' : 'Task Info'}</h1>

        <div className="flex flex-col gap-3">
          <label>
            Name:
            {isEdit ? (
              <input
                className="w-full p-2 mt-1 bg-neutral-800 rounded"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            ) : (
              <p className="bg-neutral-700 rounded p-2 mt-1">{task.name}</p>
            )}
          </label>

          <label>
            Description:
            {isEdit ? (
              <textarea
                className="w-full p-2 mt-1 bg-neutral-800 rounded"
                value={formData.desc}
                onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
              />
            ) : (
              <p className="bg-neutral-700 rounded p-2 mt-1">{task.desc}</p>
            )}
          </label>

          <label>
            Priority:
            {isEdit ? (
              <select
                value={formData.priority}
                className="w-full p-2 mt-1 bg-neutral-800 rounded"
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            ) : (
              <p className="bg-neutral-700 rounded p-2 mt-1 capitalize">{task.priority}</p>
            )}
          </label>
        </div>

        {isEdit && (
          <button
            onClick={handleUpdate}
            className="mt-10 w-full bg-neutral-900 hover:bg-neutral-300 hover:text-black rounded p-2 py-3 transition-all hover:cursor-pointer text-lg"
          >
            Save Changes
          </button>
        )}
      </div>
    </div>
  );
};

export default InfoModal;
