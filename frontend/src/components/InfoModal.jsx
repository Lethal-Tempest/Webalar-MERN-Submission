// 📦 Complete InfoModal.jsx with Full Conflict Resolution

import React, { useState } from 'react';
import axios from 'axios';
import { IoClose } from 'react-icons/io5';
import { useShopContext } from '../context/ShopContext';
import ConflictModal from './ConflictModal';

const InfoModal = ({ setup, task, onClose }) => {
  const { backendUrl, users } = useShopContext();
  const [formData, setFormData] = useState({ ...task });
  const isEdit = setup === 'edit';
  const [lastSeen, setLastSeen] = useState(new Date(Date.now()));
  const [conflictData, setConflictData] = useState(null);

  const handleUpdate = async () => {
    try {
      const res = await axios.post(`${backendUrl}/api/task/update`, {
        ...formData,
        lastUpdated: lastSeen
      }, { headers: { token: localStorage.getItem('token') } });

      if (res.status === 200) {
        setLastSeen(res.data.task.lastUpdated); // Update timestamp after success
        onClose();
      }
    } catch (err) {
      if (err.response?.status === 409) {
        const { currentTask, yourChanges } = err.response.data;
        setConflictData({ currentTask, yourChanges });
      } else {
        console.error("Update failed:", err);
      }
    }
  };

  const bgColor =
    task.priority === 'low'
      ? 'bg-green-900'
      : task.priority === 'medium'
        ? 'bg-yellow-900'
        : 'bg-red-900';

  return (
    <div className="fixed top-0 left-0 w-screen h-screen bg-black/80 z-100 flex justify-center items-center px-2 overflow-y-auto">
      <div className={`w-full max-w-[500px] p-6 rounded-2xl shadow-lg text-white ${bgColor} relative mt-10 mb-10`}>

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
          <label>
            Assigned User:
            {isEdit ? (
              <select
                value={formData.assUser}
                className="w-full p-2 mt-1 bg-neutral-800 rounded"
                onChange={(e) => setFormData({ ...formData, assUser: e.target.value })}
              >
                <option value="Unassigned">Unassigned</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
            ) : (
              <p className="bg-neutral-700 rounded p-2 mt-1">
                {formData.assUser === 'Unassigned'
                  ? 'Unassigned'
                  : users.find(u => u.name === formData.assUser)?.name || 'Unknown'}
              </p>
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

      {conflictData && (
        <ConflictModal
          conflictData={conflictData}
          onResolve={() => {
            setConflictData(null);
            onClose();
          }}
          onDismiss={() => {
            setFormData(conflictData.currentTask);
            setLastSeen(conflictData.currentTask.lastUpdated); // Important!
            setConflictData(null);
          }}
          backendUrl={backendUrl}
        />
      )}
    </div>
  );
};

export default InfoModal;
