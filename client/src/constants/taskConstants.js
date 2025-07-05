export const TASK_STATUSES = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  DELETED: 'deleted'
};

export const TABS = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  DELETED: 'deleted'
};

export const TAB_LABELS = {
  [TABS.ACTIVE]: 'Active',
  [TABS.COMPLETED]: 'Completed',
  [TABS.DELETED]: 'Deleted'
};

export const API_ENDPOINTS = {
  BASE_URL: 'http://localhost:5000',
  TASKS: '/tasks',
  TASK_STATUS: (id) => `/tasks/${id}/status`,
  TASK_RESTORE: (id) => `/tasks/${id}/restore`,
  TASK_PERMANENT_DELETE: (id) => `/tasks/${id}/permanent`
};

export const VALIDATION_LIMITS = {
  TITLE_MAX_LENGTH: 255,
  DESCRIPTION_MAX_LENGTH: 1000
}; 