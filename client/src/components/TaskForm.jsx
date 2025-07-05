import React, { useEffect } from 'react';

const TaskForm = ({ 
  onAdd, 
  onUpdate, 
  editingTask, 
  setTitle, 
  setDescription, 
  title, 
  description, 
  cancelEdit,
  errors = [],
  validateForm
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form before submitting
    if (!validateForm()) {
      return;
    }
    
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
      
      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <ul className="list-disc list-inside">
            {errors.map((error, index) => (
              <li key={index} className="text-sm">{error}</li>
            ))}
          </ul>
        </div>
      )}
      
      <input
        type="text"
        placeholder="Title"
        className={`w-full p-2 border rounded focus:outline-none bg-gray-200 ${
          errors.some(error => error.includes('Title')) 
            ? 'border-red-500 focus:border-red-700' 
            : 'border-blue-500 focus:border-blue-700'
        }`}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Description"
        className={`w-full p-2 border rounded focus:outline-none bg-gray-200 resize-none h-28 ${
          errors.some(error => error.includes('Description')) 
            ? 'border-red-500 focus:border-red-700' 
            : 'border-blue-500 focus:border-blue-700'
        }`}
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

export default TaskForm; 