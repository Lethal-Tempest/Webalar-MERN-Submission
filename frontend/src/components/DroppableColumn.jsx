import React from 'react'
import DraggableTask from './DraggableTask'
import { useDroppable } from '@dnd-kit/core'

const DroppableColumn = ({ column, tasks, setSetup, setSelectedTask }) => {
    const {setNodeRef} = useDroppable({
        id: column.id
    })
    return (
        < div ref={setNodeRef}
            key={column.title}
            className="flex-1 bg-neutral-800 rounded-2xl shadow-lg p-5 flex md:flex-col items-center border border-neutral-700 w-full gap-3 h-full  md:h-fit"
        >
            {
                tasks.length === 0
                    ? <div className="w-full flex-1 bg-neutral-700 rounded-xl p-3 text-center text-neutral-400">
                        <p className="italic">No tasks yet</p>
                    </div>
                    : tasks.map((task) => (
                        <DraggableTask key={task._id} task={task} setSetup={setSetup} setSelectedTask={setSelectedTask} />
                    ))
            }

        </div >
    )
}

export default DroppableColumn


// import React from 'react'
// import DraggableTask from './DraggableTask'
// import { useDroppable } from '@dnd-kit/core'

// const DroppableColumn = ({ column, tasks, setSetup, setSelectedTask }) => {
//     const {setNodeRef} = useDroppable({
//         id: column.id
//     })
//     return (
//         < div ref={setNodeRef}
//             key={column.title}
//             className="flex-1 bg-neutral-800 rounded-2xl shadow-lg p-5 flex flex-col items-center border border-neutral-700"
//         >
//             <h1 className="text-2xl font-semibold text-white mb-4 tracking-wide">
//                 {column.title}
//             </h1>
//             <div className='flex gap-3 md:flex-col w-full h-full overflow-x-scroll'>
//                 {
//                     tasks.length === 0
//                         ? <div className="w-full flex-1 bg-neutral-700 rounded-xl p-3 text-center text-neutral-400">
//                             <p className="italic">No tasks yet</p>
//                         </div>
//                         : tasks.map((task) => (
//                             <DraggableTask key={task._id} task={task} setSetup={setSetup} setSelectedTask={setSelectedTask} />
//                         ))
//                 }
//             </div>

//         </div >
//     )
// }

// export default DroppableColumn