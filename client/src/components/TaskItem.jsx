import React from 'react';
import { formatDate } from '../utils/dateUtils';

const TaskItem = ({ task, onComplete, onEdit, onDelete, onRestore, onPermanentDelete, currentTab }) => {

  const renderActionButtons = () => {
    switch (currentTab) {
      case 'active':
        return (
          <>
            <button
              className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 text-xs rounded font-medium transition-colors shadow w-20"
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
        );
      case 'completed':
        return (
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
        );
      case 'deleted':
        return (
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
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-200 rounded shadow flex flex-row justify-between items-center p-4 mb-4 w-full">
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-black text-base mb-1">{task.title}</div>
        <div className="text-sm text-gray-700 break-words w-full max-w-full">{task.description}</div>
        <div className="text-xs text-gray-500 mt-1">
          {currentTab === 'deleted'
            ? `Deleted: ${formatDate(task.deleted_at)}`
            : `Created: ${formatDate(task.created_at)}`
          }
        </div>
      </div>
      <div className="flex flex-col gap-2 ml-4 w-auto items-end">
        {renderActionButtons()}
      </div>
    </div>
  );
};

export default TaskItem; 