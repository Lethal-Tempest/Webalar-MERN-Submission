import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { MdEdit } from "react-icons/md";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { useState } from 'react';
import axios from 'axios';
import { useShopContext } from '../context/ShopContext';

const DraggableTask = ({ task, setSetup, setSelectedTask }) => {
    const [hovering, setHovering] = useState(false);
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: task._id,
    });
    const { backendUrl } = useShopContext();
    const handleDelete = async () => {
        try {
            await axios.post(backendUrl + '/api/task/remove', { id: task._id }, { headers: { token: localStorage.getItem('token') } });
        } catch (err) {
            console.error("Error deleting task:", err);
        }
    };
    // const setLastUpdated = async () => {
    //     try {
    //         await axios.post(backendUrl + '/api/task/updateLastUpdated', { id: task._id });
    //     } catch (err) {
    //         console.error("Error updating last updated:", err);
    //     }
    // }

    const style = transform
        ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
        : undefined;

    return (
        <div
            ref={setNodeRef}
            style={style}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
            className={`w-fit md:w-full h-full md:h-fit rounded-xl p-3 px-4 flex justify-between items-stretch md:items-center flex-col md:flex-row text-white text-base md:text-lg
    ${task.priority === 'low'
                    ? 'bg-green-900'
                    : task.priority === 'medium'
                        ? 'bg-yellow-900'
                        : 'bg-red-900'
                }`}
        >
            <div {...attributes} {...listeners} className="w-full md:w-auto flex-1 hover:cursor-grab active:cursor-grabbing">
                <div className='flex flex-col'>
                    {task.name}
                    <span className='text-sm text-neutral-400'>Assigned to {task.assUser}</span>
                </div>
            </div>

            <div
                className={`w-full md:w-fit flex items-center mt-2 md:mt-0 ${hovering ? 'md:flex' : 'md:hidden'
                    } gap-0 md:gap-3`}
            >
            <IoMdInformationCircleOutline
                size={20}
                className="hover:cursor-pointer scale-80 md:scale-100"
                onClick={() => {
                    setSetup('info');
                    setSelectedTask(task);
                }}
            />
            <MdEdit
                size={20}
                className="hover:cursor-pointer scale-80 md:scale-100"
                onClick={() => {
                    setSetup('edit');
                    setSelectedTask(task);
                }}
            />
            <MdDelete
                size={20}
                className="hover:cursor-pointer scale-80 md:scale-100"
                onClick={handleDelete}
            />
            {task.assUser === 'Unassigned' && (
                <button
                    onClick={async (e) => {
                        e.stopPropagation();
                        try {
                            const res = await axios.post(`${backendUrl}/api/task/smart-assign`, { taskId: task._id }, {
                                headers: { token: localStorage.getItem('token') }
                            });
                            console.log("✅ Smart Assigned:", res.data.message);
                        } catch (err) {
                            console.error("Smart assign failed:", err);
                        }
                    }}
                    className="bg-blue-600 text-white text-xs px-2 py-1 rounded hover:cursor-pointer mt-1 sm:mt-0"
                >
                    Smart Assign
                </button>
            )}
        </div>
        </div >

    );
};

export default DraggableTask;
