import React from 'react';
import NewTask from './NewTask';
import Logs from './Logs';

const ActivityPanel = ({ visible }) => {
  return (
    <div
      className={`
        fixed bottom-0 left-0 h-[90vh] w-screen bg-neutral-900 py-2 z-50
        transform transition-transform duration-300 ease-in-out
        ${visible ? 'translate-x-0' : 'translate-x-full'}

        // Desktop overrides (lg and up)
        lg:static lg:translate-x-0 lg:w-1/3 lg:h-[80vh] lg:max-w-none lg:flex lg:flex-col lg:gap-6

        flex flex-col gap-5
      `}
    >
      <NewTask />
      <Logs />
    </div>
  );
};

export default ActivityPanel;
