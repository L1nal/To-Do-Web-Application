import React, { useState, useEffect } from 'react';
import axios from 'axios';

// TaskForm: Handles adding or editing a task
const TaskForm = ({ onAdd, onUpdate, editingTask, setTitle, setDescription, title, description, cancelEdit }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
    if (editingTask) {
      onUpdate(editingTask.id, { title: title.trim(), description: description.trim() });
    } else {
      onAdd({ title: title.trim(), description: description.trim() });
    }
  };

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description);
    }
  }, [editingTask, setTitle, setDescription]);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
      <h2 className="text-blue-600 font-bold text-3xl mb-4 text-center">Add a Task</h2>
      <input
        type="text"
        placeholder="Title"
        className="w-full p-2 border border-gray-300 rounded focus:outline-none"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Description"
        className="w-full p-2 border border-gray-300 rounded focus:outline-none resize-none h-28"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <div className="flex gap-2">
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition-colors font-semibold shadow"
        >
          {editingTask ? 'Update' : 'Add'}
        </button>
        {editingTask && (
          <button
            type="button"
            className="w-full bg-gray-400 hover:bg-gray-500 text-white py-2 rounded transition-colors font-semibold shadow"
            onClick={cancelEdit}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

// TaskItem: Renders a single task
const TaskItem = ({ task, onComplete, onEdit, onDelete, onRestore, onPermanentDelete, currentTab }) => (
  <div className="bg-gray-200 rounded shadow flex flex-row justify-between items-center p-4 mb-4 w-full">
    <div className="flex-1 min-w-0">
      <div className="font-semibold text-black text-base mb-1">{task.title}</div>
      <div className="text-sm text-gray-700 break-words w-full max-w-full">{task.description}</div>
      <div className="text-xs text-gray-500 mt-1">
        {currentTab === 'deleted'
          ? `Deleted: ${task.deleted_at ? new Date(task.deleted_at).toLocaleDateString() + ' ' + new Date(task.deleted_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}`
          : `Created: ${new Date(task.created_at).toLocaleDateString()} ${new Date(task.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
        }
      </div>
    </div>
    <div className="flex flex-col gap-2 ml-4 w-auto items-end">
      {currentTab === 'active' && (
        <>
          <button
            className={`bg-green-500 hover:bg-green-600 text-white px-2 py-1 text-xs rounded font-medium transition-colors shadow w-20`}
            onClick={() => onComplete(task.id)}
            disabled={task.status === 'completed'}
          >
            Complete
          </button>
          <button
            className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 text-xs rounded font-medium transition-colors shadow w-20"
            onClick={() => onEdit(task.id)}
          >
            Edit
          </button>
          <button
            className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 text-xs rounded font-medium transition-colors shadow w-20"
            onClick={() => onDelete(task.id)}
          >
            Delete
          </button>
        </>
      )}
      {currentTab === 'completed' && (
        <>
          <button
            className="bg-green-500 hover:bg-blue-600 text-white px-2 py-1 text-xs rounded font-medium transition-colors shadow w-20"
            onClick={() => onComplete(task.id, 'active')}
          >
            Reactivate
          </button>
          <button
            className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 text-xs rounded font-medium transition-colors shadow w-20"
            onClick={() => onDelete(task.id)}
          >
            Delete
          </button>
        </>
      )}
      {currentTab === 'deleted' && (
        <>
          <button
            className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 text-xs rounded font-medium transition-colors shadow w-20"
            onClick={() => onRestore(task.id)}
          >
            Restore
          </button>
          <button
            className="bg-red-500 hover:bg-red-800 text-white px-2 py-1 text-xs rounded font-medium transition-colors shadow w-20"
            onClick={() => onPermanentDelete(task.id)}
          >
            Delete Permanently
          </button>
        </>
      )}
    </div>
  </div>
);

// TaskList: Renders the list of tasks
const TaskList = ({ tasks, currentTab, onComplete, onEdit, onDelete, onRestore, onPermanentDelete }) => {
  const [showAll, setShowAll] = useState(false);
  const filteredTasks = tasks.filter(task => {
    if (currentTab === 'active') return task.status === 'active';
    if (currentTab === 'completed') return task.status === 'completed';
    if (currentTab === 'deleted') return task.status === 'deleted';
    return true;
  });
  const visibleTasks = showAll ? filteredTasks : filteredTasks.slice(0, 5);

  return (
    <div className="flex flex-col w-full">
      {filteredTasks.length === 0 ? (
        <div className="text-gray-500 text-center mt-8">
          No {currentTab} tasks yet.
        </div>
      ) : (
        <>
          {visibleTasks.map((task) => (
            <div className="w-full" key={task.id}>
              <TaskItem 
                task={task} 
                currentTab={currentTab}
                onComplete={onComplete} 
                onEdit={onEdit} 
                onDelete={onDelete}
                onRestore={onRestore}
                onPermanentDelete={onPermanentDelete}
              />
            </div>
          ))}
          {filteredTasks.length > 5 && !showAll && (
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
  const [tasks, setTasks] = useState([]);
  const [currentTab, setCurrentTab] = useState('active');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingTask, setEditingTask] = useState(null);

  // Load tasks from database
  const loadTasks = () => {
    axios.get('http://localhost:5000/tasks')
      .then(res => setTasks(res.data)) 
      .catch(err => console.error('Error loading tasks:', err));
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleAddTask = async ({ title, description }) => {
    try {
      await axios.post('http://localhost:5000/tasks', {
        title,
        description,
        status: 'active'
      });
      setTitle('');
      setDescription('');
      loadTasks();
    } catch (err) {
      console.error('Failed to add task:', err);
    }
  };

  const handleUpdateTask = async (id, { title, description }) => {
    try {
      await axios.put(`http://localhost:5000/tasks/${id}`, { title, description });
      setTitle('');
      setDescription('');
      setEditingTask(null);
      loadTasks();
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  };

  const handleCompleteTask = async (id, newStatus = 'completed') => {
    try {
      await axios.put(`http://localhost:5000/tasks/${id}/status`, { status: newStatus });
      loadTasks();
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/tasks/${id}`);
      loadTasks();
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  const handleRestoreTask = async (id) => {
    try {
      await axios.put(`http://localhost:5000/tasks/${id}/restore`);
      loadTasks();
    } catch (err) {
      console.error('Failed to restore task:', err);
    }
  };

  const handlePermanentDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/tasks/${id}/permanent`);
      loadTasks();
    } catch (err) {
      console.error('Failed to permanently delete task:', err);
    }
  };

  const handleEditTask = (id) => {
    const task = tasks.find(t => t.id === id);
    setEditingTask(task);
  };

  const cancelEdit = () => {
    setEditingTask(null);
    setTitle('');
    setDescription('');
  };

  return (
    <div className="bg-gray-100 min-h-screen min-w-screen w-screen h-screen flex items-center justify-center overflow-auto">
      <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full flex flex-col md:flex-row p-4 md:p-8 my-4 md:my-12 mx-2 md:mx-4 h-auto md:h-[600px] items-center">
        {/* Left: Add/Edit Task */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center md:pr-8 border-b md:border-b-0 md:border-r border-gray-200 h-auto md:h-full mb-4 md:mb-0">
          <TaskForm
            onAdd={handleAddTask}
            onUpdate={handleUpdateTask}
            editingTask={editingTask}
            setTitle={setTitle}
            setDescription={setDescription}
            title={title}
            description={description}
            cancelEdit={cancelEdit}
          />
        </div>
        {/* Right: Task List */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center md:pl-8 h-auto md:h-full">
          {/* Tabs UI */}
          <div className="flex gap-2 mb-6 w-full sticky top-0 bg-white z-10 py-2">
            <button 
              className={`flex-1 px-4 py-1 rounded-t font-semibold shadow transition-colors ${
                currentTab === 'active' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              onClick={() => setCurrentTab('active')}
            >
              Active
            </button>
            <button 
              className={`flex-1 px-4 py-1 rounded-t font-semibold shadow transition-colors ${
                currentTab === 'completed' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              onClick={() => setCurrentTab('completed')}
            >
              Completed
            </button>
            <button 
              className={`flex-1 px-4 py-1 rounded-t font-semibold shadow transition-colors ${
                currentTab === 'deleted' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              onClick={() => setCurrentTab('deleted')}
            >
              Deleted
            </button>
          </div>
          <div className="w-full h-[300px] md:h-full overflow-y-auto flex flex-col">
            <TaskList
              tasks={tasks}
              currentTab={currentTab}
              onComplete={handleCompleteTask}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
              onRestore={handleRestoreTask}
              onPermanentDelete={handlePermanentDelete}
            />
          </div>
        </div>
      </div>
      {/* Footer */}
      <footer className="w-full fixed bottom-0 left-0 text-center text-xs text-gray-400 bg-white bg-opacity-80 py-2 z-50">
        This project was developed by Linal Mathila as part of the Full Stack Software Engineer interview process for CoverageX LLC.
      </footer>
    </div>
  );
};

export default Home;
