import React, { useState } from 'react';

// TaskForm: Handles adding a new task
const TaskForm = ({ onAdd }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
    onAdd({ title: title.trim(), description: description.trim() });
    setTitle('');
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-xs">
      <h2 className="text-blue-600 font-bold text-3xl mb-4">Add a Task</h2>
      <input
        type="text"
        placeholder="Title"
        className="p-2 border border-gray-300 rounded focus:outline-none"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Description"
        className="p-2 border border-gray-300 rounded focus:outline-none resize-none h-28"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition-colors font-semibold shadow"
      >
        Add
      </button>
    </form>
  );
};

// TaskItem: Renders a single task
const TaskItem = ({ task, onComplete, onEdit, onDelete }) => (
  <div className="bg-gray-200 rounded shadow flex flex-col md:flex-row justify-between md:items-center p-4 mb-4 w-full">
    <div className="flex-1 min-w-0">
      <div className="font-semibold text-black text-base mb-1">{task.title}</div>
      <div className="text-sm text-gray-700 break-words w-full max-w-full">{task.description}</div>
    </div>
    <div className="flex gap-2 mt-4 md:mt-0 md:ml-4 w-full md:w-auto">
      <button
        className={`bg-green-500 hover:bg-green-600 text-white px-2 py-1 text-sm rounded font-medium transition-colors shadow ${task.status === 'done' ? 'opacity-60 cursor-not-allowed' : ''}`}
        onClick={() => onComplete(task.id)}
        disabled={task.status === 'done'}
      >
        Done
      </button>
      <button
        className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 text-sm rounded font-medium transition-colors shadow"
        onClick={() => onEdit(task.id)}
      >
        Edit
      </button>
      <button
        className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 text-sm rounded font-medium transition-colors shadow"
        onClick={() => onDelete(task.id)}
      >
        Delete
      </button>
    </div>
  </div>
);

// TaskList: Renders the list of tasks
const TaskList = ({ tasks, onComplete, onEdit, onDelete }) => {
  const [showAll, setShowAll] = useState(false);
  const visibleTasks = showAll ? tasks : tasks.slice(0, 5);
  return (
    <div className="flex flex-col w-full max-w-md">
      {/* Tabs UI */}
      <div className="flex gap-2 mb-6 w-full sticky top-0 bg-white z-10 py-2">
        <button className="flex-1 px-4 py-1 rounded-t bg-blue-600 text-white font-semibold shadow">Active</button>
        <button className="flex-1 px-4 py-1 rounded-t bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition-colors">Completed</button>
        <button className="flex-1 px-4 py-1 rounded-t bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition-colors">Deleted</button>
      </div>
      {tasks.length === 0 ? (
        <div className="text-gray-500 text-center mt-8">No tasks yet.</div>
      ) : (
        <>
          {visibleTasks.map((task) => (
            <TaskItem key={task.id} task={task} onComplete={onComplete} onEdit={onEdit} onDelete={onDelete} />
          ))}
          {tasks.length > 5 && !showAll && (
            <button
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              onClick={() => setShowAll(true)}
            >
              Show More
            </button>
          )}
        </>
      )}
    </div>
  );
};

// Home: Main component
const Home = () => {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Buy books', description: 'Buy books for the next school year', status: 'active' },
    { id: 2, title: 'Clean home', description: 'Need to clean the bed room', status: 'active' },
    { id: 3, title: 'Takehome assignment', description: 'Finish the mid-term assignment', status: 'active' },
    { id: 4, title: 'Play Cricket', description: 'Plan the soft ball cricket match on next Sunday', status: 'active' },
    { id: 5, title: 'Help Saman', description: 'Saman need help with his software project', status: 'active' },
  ]);

  const handleAddTask = ({ title, description }) => {
    setTasks([
      ...tasks,
      { id: Date.now(), title, description, status: 'active' },
    ]);
  };

  const handleCompleteTask = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, status: 'done' } : task
    ));
  };

  // Placeholder handlers for edit and delete
  const handleEditTask = (id) => {
    alert('Edit functionality coming soon!');
  };
  const handleDeleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <div className="bg-gray-100 min-h-screen min-w-screen w-screen h-screen flex items-center justify-center overflow-auto">
      <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full flex p-8 my-12 mx-4 h-[600px] items-center">
        {/* Left: Add Task */}
        <div className="flex-1 flex flex-col justify-center items-center pr-8 border-r border-gray-200 h-full">
          <TaskForm onAdd={handleAddTask} />
        </div>
        {/* Right: Task List */}
        <div className="flex-1 flex flex-col justify-center items-center pl-8 h-full">
          <div className="w-full h-full overflow-y-auto">
            <TaskList
              tasks={tasks}
              onComplete={handleCompleteTask}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
