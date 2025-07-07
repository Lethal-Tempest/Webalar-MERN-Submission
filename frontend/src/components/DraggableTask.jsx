import React from 'react'
import { useDraggable } from '@dnd-kit/core'

const DraggableTask = ({ task }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: task._id
    })
    const style = transform ? 
        {transform: `translate(${transform.x}px, ${transform.y}px)`}
    : undefined
    return (
        <div ref={setNodeRef} {...attributes} {...listeners} style={style}
            key={task._id}
            className={`w-full ${task.priority==='low'?'bg-green-900':task.priority==='medium'?'bg-yellow-900':'bg-red-900'} rounded-xl p-3 text-white text-xl`}
        >
            {task.name}
        </div>
    )
}

export default DraggableTask