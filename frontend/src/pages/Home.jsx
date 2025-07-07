import React from 'react';
import { useShopContext } from '../context/ShopContext';
import ActivityPanel from '../components/ActivityPanel';

const Home = ({ visible }) => {
  const { Columns } = useShopContext();

  return (
    <div className="relative min-h-[90vh] w-full bg-neutral-900 py-10 px-6 flex gap-6">
      {/* Left 2/3 - Board */}
      <div className="w-full flex max-h-[80vh] gap-6">
        {Columns.map((column) => (
          <div
            key={column.id}
            className="flex-1 bg-neutral-800 rounded-2xl shadow-lg p-5 flex flex-col items-center border border-neutral-700"
          >
            <h1 className="text-2xl font-semibold text-white mb-4 tracking-wide">
              {column.title}
            </h1>
            <div className="w-full flex-1 bg-neutral-700 rounded-xl p-3 text-center text-neutral-400">
              <p className="italic">No tasks yet</p>
            </div>
          </div>
        ))}
      </div>

      {/* Right 1/3 - Profile + Logs */}
      <ActivityPanel visible={visible} />
    </div>
  );
};

export default Home;
