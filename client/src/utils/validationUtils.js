import { VALIDATION_LIMITS } from '../constants/taskConstants';

export const validateTaskData = (taskData) => {
  const errors = [];

  // Coerce to string if not null/undefined, else empty string
  const title = taskData.title == null ? '' : String(taskData.title);
  const description = taskData.description == null ? '' : String(taskData.description);

  if (!title.trim()) {
    errors.push('Title is required');
  }

  if (!description.trim()) {
    errors.push('Description is required');
  }

  if (title.trim().length > VALIDATION_LIMITS.TITLE_MAX_LENGTH) {
    errors.push(`Title is too long (max ${VALIDATION_LIMITS.TITLE_MAX_LENGTH} characters)`);
  }

  if (description.trim().length > VALIDATION_LIMITS.DESCRIPTION_MAX_LENGTH) {
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