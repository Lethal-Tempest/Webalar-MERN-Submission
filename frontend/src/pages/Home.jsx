import React from 'react';
import { useShopContext } from '../context/ShopContext';
import ActivityPanel from '../components/ActivityPanel';
import DroppableColumn from '../components/DroppableColumn';

const Home = ({ visible }) => {
  const { Columns, tasks } = useShopContext();

  return (
    <div className="relative min-h-[90vh] w-full bg-neutral-900 py-10 px-6 flex gap-6">
      {/* Left 2/3 - Board */}
      <div className="w-full flex max-h-[80vh] gap-6">
        {Columns.map((column) => (
          <DroppableColumn key={column.id} column={column} tasks={tasks.filter((task) => task.status === column.id)} />
        ))}
      </div>

      {/* Right 1/3 - Profile + Logs */}
      <ActivityPanel visible={visible} />
    </div>
  );
};

export default Home;
