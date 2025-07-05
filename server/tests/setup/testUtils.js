/**
 * Create a mock Express request object
 * @param {Object} options - Request options
 * @returns {Object} Mock request object
 */
const createMockRequest = (options = {}) => {
  return {
    body: options.body || {},
    params: options.params || {},
    query: options.query || {},
    headers: options.headers || {},
    method: options.method || 'GET',
    url: options.url || '/',
    ...options
  };
};

/**
 * Create a mock Express response object
 * @returns {Object} Mock response object
 */
const createMockResponse = () => {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
    end: jest.fn().mockReturnThis()
  };
  return res;
};

/**
 * Create a mock database connection
 * @returns {Object} Mock database connection
 */
const createMockDatabaseConnection = () => {
  return {
    query: jest.fn(),
    connect: jest.fn(),
    end: jest.fn()
  };
};

/**
 * Create sample task data for testing
 * @param {Object} overrides - Data to override defaults
 * @returns {Object} Sample task data
 */
const createSampleTask = (overrides = {}) => {
  return {
    id: 1,
    title: 'Test Task',
    description: 'Test Description',
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...overrides
  };
};

/**
 * Create sample task data for API requests
 * @param {Object} overrides - Data to override defaults
 * @returns {Object} Sample task request data
 */
const createTaskRequestData = (overrides = {}) => {
  return {
    title: 'Test Task',
    description: 'Test Description',
    status: 'active',
    ...overrides
  };
};

/**
 * Mock console methods to prevent output during tests
 */
const mockConsole = () => {
  const originalConsole = {
    log: console.log,
    error: console.error,
    warn: console.warn,
    info: console.info
  };

  console.log = jest.fn();
  console.error = jest.fn();
  console.warn = jest.fn();
  console.info = jest.fn();

  return {
    restore: () => {
      console.log = originalConsole.log;
      console.error = originalConsole.error;
      console.warn = originalConsole.warn;
      console.info = originalConsole.info;
    }
  };
};

/**
 * Wait for a specified amount of time (useful for async tests)
 * @param {number} ms - Milliseconds to wait
 * @returns {Promise} Promise that resolves after the specified time
 */
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Validate that an object has the expected task structure
 * @param {Object} task - Task object to validate
 * @returns {boolean} True if valid task structure
 */
const isValidTask = (task) => {
  return (
    task &&
    typeof task === 'object' &&
    typeof task.id === 'number' &&
    typeof task.title === 'string' &&
    typeof task.description === 'string' &&
    typeof task.status === 'string'
  );
};

/**
 * Validate that an array contains valid task objects
 * @param {Array} tasks - Array of tasks to validate
 * @returns {boolean} True if all tasks are valid
 */
const isValidTaskArray = (tasks) => {
  return Array.isArray(tasks) && tasks.every(isValidTask);
};

/**
 * Create a mock error object
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code
 * @returns {Error} Mock error object
 */
const createMockError = (message = 'Test error', statusCode = 500) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

module.exports = {
  createMockRequest,
  createMockResponse,
  createMockDatabaseConnection,
  createSampleTask,
  createTaskRequestData,
  mockConsole,
  wait,
  isValidTask,
  isValidTaskArray,
  createMockError
}; 