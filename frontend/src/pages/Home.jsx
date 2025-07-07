import React from 'react';
import { useShopContext } from '../context/ShopContext';
import ActivityPanel from '../components/ActivityPanel';
import DroppableColumn from '../components/DroppableColumn';
import { DndContext } from '@dnd-kit/core';
import axios from 'axios';
import { useState } from 'react';
import InfoModal from '../components/InfoModal';

const Home = ({ visible }) => {
    const { Columns, tasks, setTasks, backendUrl } = useShopContext();
    const token = localStorage.getItem('token');
    const [setup, setSetup] = useState('');
    const [selectedTask, setSelectedTask] = useState(null);

    async function handleDragEvent(event) {
        const { active, over } = event;

        if (!over || active.id === over.id) return;

        setTasks((prevTasks) =>
            prevTasks.map((task) =>
                task._id === active.id ? { ...task, status: over.id } : task
            )
        );
        const response = await axios.post(backendUrl + '/api/task/update', { id: active.id, status: over.id }, { headers: { token } });
    }


    return (
        <div className="relative min-h-[90vh] w-full bg-neutral-900 py-10 px-6 flex gap-6">
            {setup && selectedTask && (
                <InfoModal
                    setup={setup}
                    task={selectedTask}
                    onClose={() => {
                        setSetup('');
                        setSelectedTask(null);
                    }}
                />
            )}

            <DndContext onDragEnd={handleDragEvent}>
                {/* Left 2/3 - Board */}
                <div className="w-full flex max-h-[80vh] gap-6">
                    {Columns.map((column) => (
                        <DroppableColumn key={column.id} column={column} tasks={tasks.filter((task) => task.status === column.id)} setSetup={setSetup} setSelectedTask={setSelectedTask} />
                    ))}
                </div>
            </DndContext>
            {/* Right 1/3 - Profile + Logs */}
            <ActivityPanel visible={visible} />
        </div>
    );
};

export default Home;
