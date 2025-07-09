import React, { useState } from 'react';
import axios from 'axios';

const ConflictModal = ({ conflictData, onResolve, onDismiss, backendUrl }) => {
  const fields = ['name', 'desc', 'priority', 'assUser'];
  
  const [selectedSources, setSelectedSources] = useState(
    fields.reduce((acc, field) => {
      acc[field] = 'yours'; // default
      return acc;
    }, {})
  );

  const mergedValues = fields.reduce((acc, field) => {
    acc[field] =
      selectedSources[field] === 'yours'
        ? conflictData.yourChanges[field]
        : conflictData.currentTask[field];
    return acc;
  }, {});

  const isComplete = fields.every((field) => selectedSources[field]);

  const handleSelect = (field, source) => {
    setSelectedSources((prev) => ({ ...prev, [field]: source }));
  };

  return (
    <div className="fixed top-0 left-0 w-screen h-screen bg-black/80 z-100 flex justify-center items-center">
      <div className="bg-white text-black p-6 rounded-xl w-[95%] max-w-[700px]">
        <h2 className="text-xl font-bold mb-4">Conflict Detected</h2>

        <div className="grid grid-cols-3 gap-4 text-sm overflow-x-auto">
          <div>
            <h3 className="font-semibold mb-2">Your Version</h3>
            {fields.map((field) => (
              <div key={`your-${field}`}>
                <strong>{field}: </strong>
                <p>{conflictData.yourChanges[field]}</p>
              </div>
            ))}
          </div>

          <div>
            <h3 className="font-semibold mb-2">Latest Version</h3>
            {fields.map((field) => (
              <div key={`current-${field}`}>
                <strong>{field}: </strong>
                <p>{conflictData.currentTask[field]}</p>
              </div>
            ))}
          </div>

          <div className='flex flex-col gap-2'>
            <h3 className="font-semibold mb-2">Choose Merge</h3>
            {fields.map((field) => (
              <div key={`merge-${field}`} className="flex gap-3 mb-2">
                <label className="text-sm flex items-center gap-1">
                  <input
                    type="radio"
                    name={`merge-${field}`}
                    value="yours"
                    onChange={() => handleSelect(field, 'yours')}
                    checked={selectedSources[field] === 'yours'}
                  />
                  Yours
                </label>
                <label className="text-sm flex items-center gap-1">
                  <input
                    type="radio"
                    name={`merge-${field}`}
                    value="latest"
                    onChange={() => handleSelect(field, 'latest')}
                    checked={selectedSources[field] === 'latest'}
                  />
                  Latest
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button
            className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
            disabled={!isComplete}
            onClick={async () => {
              try {
                await axios.post(`${backendUrl}/api/task/update`, {
                  ...conflictData.currentTask,
                  ...mergedValues,
                  _id: conflictData.currentTask._id,
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
            Merge & Overwrite
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
