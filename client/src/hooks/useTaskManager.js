import { useState, useEffect } from 'react';
import TaskService from '../services/TaskService';

const useTaskManager = (taskService = new TaskService()) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [notificationType, setNotificationType] = useState('success');

  const loadTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await taskService.getAllTasks();
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (taskData) => {
    try {
      const response = await taskService.createTask(taskData);
      setSuccess(response.message || 'Task created successfully');
      setNotificationType('success');
      await loadTasks();
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateTask = async (id, taskData) => {
    try {
      const response = await taskService.updateTask(id, taskData);
      setSuccess(response.message || 'Task updated successfully');
      setNotificationType('success');
      await loadTasks();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const completeTask = async (id, newStatus = 'completed') => {
    try {
      const response = await taskService.updateTaskStatus(id, newStatus);
      setSuccess(response.message || 'Task status updated successfully');
      setNotificationType('success');
      await loadTasks();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteTask = async (id) => {
    try {
      const response = await taskService.deleteTask(id);
      setSuccess(response.message || 'Task deleted successfully');
      setNotificationType('error'); // Red notification for delete operations
      await loadTasks();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const restoreTask = async (id) => {
    try {
      const response = await taskService.restoreTask(id);
      setSuccess(response.message || 'Task restored successfully');
      setNotificationType('success');
      await loadTasks();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const permanentDeleteTask = async (id) => {
    try {
      const response = await taskService.permanentDeleteTask(id);
      setSuccess(response.message || 'Task permanently deleted');
      setNotificationType('error'); // Red notification for permanent delete operations
      await loadTasks();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  useEffect(() => {
    loadTasks();
  }, []);

  return {
    tasks,
    loading,
    error,
    success,
    notificationType,
    clearMessages,
    loadTasks,
    addTask,
    updateTask,
    completeTask,
    deleteTask,
    restoreTask,
    permanentDeleteTask
  };
};

export default useTaskManager; 