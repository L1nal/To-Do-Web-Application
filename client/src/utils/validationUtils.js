import { VALIDATION_LIMITS } from '../constants/taskConstants';

export const validateTaskData = (taskData) => {
  const errors = [];

  if (!taskData.title || !taskData.title.trim()) {
    errors.push('Title is required');
  }

  if (!taskData.description || !taskData.description.trim()) {
    errors.push('Description is required');
  }

  if (taskData.title && taskData.title.trim().length > VALIDATION_LIMITS.TITLE_MAX_LENGTH) {
    errors.push(`Title is too long (max ${VALIDATION_LIMITS.TITLE_MAX_LENGTH} characters)`);
  }

  if (taskData.description && taskData.description.trim().length > VALIDATION_LIMITS.DESCRIPTION_MAX_LENGTH) {
    errors.push(`Description is too long (max ${VALIDATION_LIMITS.DESCRIPTION_MAX_LENGTH} characters)`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateStatus = (status) => {
  const validStatuses = ['active', 'completed', 'deleted'];
  return validStatuses.includes(status);
}; 