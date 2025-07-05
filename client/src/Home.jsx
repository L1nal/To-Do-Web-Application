import React, { useState } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import TabNavigation from './components/TabNavigation';
import useTaskManager from './hooks/useTaskManager';
import useTaskForm from './hooks/useTaskForm';

const Home = () => {
  const [currentTab, setCurrentTab] = useState('active');
  const taskManager = useTaskManager();
  const taskForm = useTaskForm();

  const handleAddTask = async (taskData) => {
    try {
      await taskManager.addTask(taskData);
      taskForm.resetForm();
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handleUpdateTask = async (id, taskData) => {
    try {
      await taskManager.updateTask(id, taskData);
      taskForm.resetForm();
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handleEditTask = (id) => {
    const task = taskManager.tasks.find(t => t.id === id);
    if (task) {
      taskForm.startEditing(task);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen min-w-screen w-screen h-screen flex items-center justify-center overflow-auto">
      <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full flex flex-col md:flex-row p-4 md:p-8 my-4 md:my-12 mx-2 md:mx-4 h-auto md:h-[600px] items-center">
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center md:pr-8 border-b md:border-b-0 md:border-r border-blue-600 h-auto md:h-full mb-4 md:mb-0">
          <div className="w-full">
            <TaskForm
              onAdd={handleAddTask}
              onUpdate={handleUpdateTask}
              editingTask={taskForm.editingTask}
              setTitle={taskForm.setTitleWithErrorClear}
              setDescription={taskForm.setDescriptionWithErrorClear}
              title={taskForm.title}
              description={taskForm.description}
              cancelEdit={taskForm.cancelEdit}
              errors={taskForm.errors}
              validateForm={taskForm.validateForm}
            />
          </div>
        </div>
        {/* Right: Task List */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center md:pl-8 h-auto md:h-full">
          <TabNavigation currentTab={currentTab} setCurrentTab={setCurrentTab} />
          <div className="w-full h-[300px] md:h-full overflow-y-auto flex flex-col">
            <TaskList
              tasks={taskManager.tasks}
              currentTab={currentTab}
              onComplete={taskManager.completeTask}
              onEdit={handleEditTask}
              onDelete={taskManager.deleteTask}
              onRestore={taskManager.restoreTask}
              onPermanentDelete={taskManager.permanentDeleteTask}
            />
          </div>
        </div>
      </div>
      {/* Footer */}
      <footer className="w-full fixed bottom-0 left-0 text-center text-xs text-gray-400 py-2 z-50">
        This project was developed by Linal Mathila as part of the Full Stack Software Engineer interview process for CoverageX LLC.
      </footer>
    </div>
  );
};

export default Home;
