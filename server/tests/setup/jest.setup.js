// Set test environment
process.env.NODE_ENV = 'test';

global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Increase timeout for integration tests
jest.setTimeout(10000);

global.testUtils = require('./testUtils');

process.env.DB_HOST = 'localhost';
process.env.DB_USER = 'test_user';
process.env.DB_PASSWORD = 'test_password';
process.env.DB_NAME = 'test_todo_app';
process.env.PORT = '5001';

const originalConsoleError = console.error;
console.error = (...args) => {
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('Warning:') || 
     args[0].includes('DeprecationWarning:') ||
     args[0].includes('ExperimentalWarning:'))
  ) {
    return;
  }
  originalConsoleError.call(console, ...args);
}; 