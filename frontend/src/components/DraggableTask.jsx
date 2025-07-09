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
            className={`mb-3 w-full rounded-xl p-3 px-4 flex justify-between items-center text-white text-xl ${task.priority === 'low'
                ? 'bg-green-900'
                : task.priority === 'medium'
                    ? 'bg-yellow-900'
                    : 'bg-red-900'
                }`}
        >
            {/* Left part: draggable area */}
            <div {...attributes} {...listeners} className="flex-1 hover:cursor-grab active:cursor-grabbing">
                {task.name}
            </div>

            {/* Right part: edit button (non-draggable) */}
            <div
                className={`w-fit items-center justify-center gap-3 ${hovering ? 'flex' : 'hidden'}`}
                onClick={(e) => {
                    e.stopPropagation(); // 🛑 Prevents drag
                    console.log("Edit clicked");
                    // openEditModal(task) or any handler
                }}
            >

                <IoMdInformationCircleOutline
                    size={20}
                    className="hover:cursor-pointer"
                    onClick={() => {
                        setSetup('info');
                        setSelectedTask(task);
                    }}
                />
                <MdEdit
                    size={20}
                    className="hover:cursor-pointer"
                    onClick={() => {
                        setSetup('edit');
                        setSelectedTask(task);
                    }}
                />
                <MdDelete
                    size={20}
                    className="hover:cursor-pointer"
                    onClick={handleDelete}
                />

            </div>
        </div>
    );
};

export default DraggableTask;
