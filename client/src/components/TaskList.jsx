import React, { useState } from 'react';
import TaskItem from './TaskItem';
import LoadingSpinner from './LoadingSpinner';
import { TASK_STATUSES } from '../constants/taskConstants';

const TaskList = ({ tasks, currentTab, loading, onComplete, onEdit, onDelete, onRestore, onPermanentDelete }) => {
  const [showAll, setShowAll] = useState(false);
  
  const filterTasksByStatus = (tasks, status) => {
    return tasks.filter(task => task.status === status);
  };

  const getFilteredTasks = () => {
    switch (currentTab) {
      case 'active':
        return filterTasksByStatus(tasks, TASK_STATUSES.ACTIVE);
      case 'completed':
        return filterTasksByStatus(tasks, TASK_STATUSES.COMPLETED);
      case 'deleted':
        return filterTasksByStatus(tasks, TASK_STATUSES.DELETED);
      default:
        return tasks;
    }
  };

  const filteredTasks = getFilteredTasks();
  const visibleTasks = showAll ? filteredTasks : filteredTasks.slice(0, 5);

  if (loading) {
    return (
      <div className="flex flex-col w-full items-center justify-center py-8">
        <LoadingSpinner size="lg" text="Loading tasks..." />
      </div>
    );
  }

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

export default TaskList; 