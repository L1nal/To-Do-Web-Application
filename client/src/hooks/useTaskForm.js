import { useState, useEffect } from 'react';
import { validateTaskData } from '../utils/validationUtils';

const useTaskForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [errors, setErrors] = useState([]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setEditingTask(null);
    setErrors([]);
  };

  const startEditing = (task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description);
    setErrors([]);
  };

  const cancelEdit = () => {
    resetForm();
  };

  const validateForm = () => {
    const taskData = { title, description };
    const validation = validateTaskData(taskData);
    setErrors(validation.errors);
    return validation.isValid;
  };

  const getFormData = () => ({
    title: title.trim(),
    description: description.trim()
  });

  const setTitleWithErrorClear = (value) => {
    setTitle(value);
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const setDescriptionWithErrorClear = (value) => {
    setDescription(value);
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  return {
    title,
    setTitle,
    setTitleWithErrorClear,
    description,
    setDescription,
    setDescriptionWithErrorClear,
    editingTask,
    setEditingTask,
    errors,
    setErrors,
    resetForm,
    startEditing,
    cancelEdit,
    validateForm,
    getFormData
  };
};

export default useTaskForm; 