import React from 'react';
import NewTask from './NewTask';
import Logs from './Logs';

const ActivityPanel = ({ visible }) => {
  return (
    <div
      className={`
        fixed right-0 h-[80vh] w-full max-w-[400px] bg-neutral-900 p-4 z-50
        transform transition-transform duration-300 ease-in-out
        ${visible ? 'translate-x-0' : 'translate-x-full'}

        xl:static xl:translate-x-0 xl:w-1/3 xl:flex xl:flex-col xl:gap-6
        flex flex-col gap-5
      `}
    >
      <NewTask />
      <Logs />
    </div>
  );
};

export default ActivityPanel;
