import React from 'react'

const NewTask = () => {
  return (
    <div className="flex-1 bg-neutral-800 border border-neutral-700 rounded-2xl p-4 text-white text-xl justify-center">
          <h1 className='text-2xl text-neutral-300 font-semibold text-center pb-2'>NEW TASK</h1>
            <div className='flex flex-col gap-2'>
                <input type="text" placeholder="Task Name" className="w-full bg-neutral-700 rounded-lg p-2 mt-2" />
                <input type="text" placeholder="Task Description" className="w-full bg-neutral-700 rounded-lg p-2 mt-2" />
                <div>
                    <div className='flex gap-5 items-center justify-between'>
                        <span className='text-neutral-300 text-md'>Assigned User</span>
                        <select className="bg-neutral-700 rounded-lg p-2 mt-2 w-1/2">
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>
                    <div className='flex gap-5 items-center justify-between'>
                        <span className='text-neutral-300'>Status</span>
                        <select className="bg-neutral-700 rounded-lg p-2 mt-2 w-1/2">
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>
                    <div className='flex gap-5 items-center justify-between'>
                        <span className='text-neutral-300'>Priority</span>
                        <select className="bg-neutral-700 rounded-lg p-2 mt-2 w-1/2">
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>
                </div>
                <button className="w-full bg-neutral-900 rounded-lg p-2 mt-2 hover:bg-neutral-300 hover:text-neutral-900 transition-all duration-300 ease-in-out hover:cursor-pointer">Add Task</button>
            </div>
    </div>
  )
}

export default NewTask