import { useState, useEffect } from 'react';
import TaskService from '../services/TaskService';

const useTaskManager = (taskService = new TaskService()) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
      await taskService.createTask(taskData);
      await loadTasks();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateTask = async (id, taskData) => {
    try {
      await taskService.updateTask(id, taskData);
      await loadTasks();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const completeTask = async (id, newStatus = 'completed') => {
    try {
      await taskService.updateTaskStatus(id, newStatus);
      await loadTasks();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteTask = async (id) => {
    try {
      await taskService.deleteTask(id);
      await loadTasks();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const restoreTask = async (id) => {
    try {
      await taskService.restoreTask(id);
      await loadTasks();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const permanentDeleteTask = async (id) => {
    try {
      await taskService.permanentDeleteTask(id);
      await loadTasks();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  return {
    tasks,
    loading,
    error,
    addTask,
    updateTask,
    completeTask,
    deleteTask,
    restoreTask,
    permanentDeleteTask,
    loadTasks
  };
};

export default useTaskManager; 