import React from 'react';
import { useShopContext } from '../context/ShopContext';

const Logs = () => {
  const { logs } = useShopContext();

  return (
    <div className="flex-1 bg-neutral-800 border border-neutral-700 rounded-2xl p-4 text-white text-sm space-y-2 overflow-y-auto max-h-[70vh]">
      {logs.length === 0 ? (
        <p className="text-neutral-400 italic">No recent activity</p>
      ) : (
        logs.map((log, index) => (
          <div key={index} className="flex justify-between">
            <span>{log.message}</span>
            <span className="text-neutral-400 text-xs">
              {new Date(log.timestamp).toLocaleString()}
            </span>
          </div>
        ))
      )}
    </div>
  );
};

export default Logs;
