import React from 'react';
import axios from 'axios';

const ConflictModal = ({ conflictData, onResolve, onDismiss, backendUrl }) => {
  return (
    <div className="fixed top-0 left-0 w-screen h-screen bg-black/80 z-100 flex justify-center items-center">
      <div className="bg-white text-black p-6 rounded-xl w-[90%] max-w-[600px]">
        <h2 className="text-xl font-bold mb-4">Conflict Detected</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold">Your Version</h3>
            <p><b>Name:</b> {conflictData.yourChanges.name}</p>
            <p><b>Desc:</b> {conflictData.yourChanges.desc}</p>
            <p><b>Priority:</b> {conflictData.yourChanges.priority}</p>
          </div>
          <div>
            <h3 className="font-semibold">Latest Version</h3>
            <p><b>Name:</b> {conflictData.currentTask.name}</p>
            <p><b>Desc:</b> {conflictData.currentTask.desc}</p>
            <p><b>Priority:</b> {conflictData.currentTask.priority}</p>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button
            className="bg-green-600 text-white px-4 py-2 rounded"
            onClick={async () => {
              try {
                await axios.post(`${backendUrl}/api/task/update`, {
                  ...conflictData.yourChanges,
                  force: true,
                }, {
                  headers: { token: localStorage.getItem('token') }
                });
                onResolve();
              } catch (e) {
                console.error("Force update failed:", e);
              }
            }}
          >
            Overwrite
          </button>

          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={onDismiss}
          >
            Cancel / Reload
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConflictModal;
