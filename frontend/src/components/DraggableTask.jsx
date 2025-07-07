import React from 'react'

const DraggableTask = ({ task }) => {
    return (
        <div
            key={task._id}
            className={`w-full ${task.priority==='low'?'bg-green-900':task.priority==='medium'?'bg-yellow-900':'bg-red-900'} rounded-xl p-3 text-white text-xl`}
        >
            {task.name}
        </div>
    )
}

export default DraggableTask