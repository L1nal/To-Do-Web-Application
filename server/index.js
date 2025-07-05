// Entry point for the server application. Sets up Express, database, routes, and error handling.
const express = require('express');
const cors = require('cors');

// Import modules
const DatabaseConfig = require('./config/database');
const TaskRepository = require('./repositories/TaskRepository');
const TaskService = require('./services/TaskService');
const TaskController = require('./controllers/TaskController');
const TaskRoutes = require('./routes/taskRoutes');
const ErrorHandler = require('./middleware/errorHandler');

/**
 * Main application class for setting up and starting the server
 */
class App {
  constructor() {
    this.app = express();
    this.port = 5000;
  }

  /**
   * Set up middleware for CORS and JSON parsing
   */
  setupMiddleware() {
    this.app.use(cors());
    this.app.use(express.json());
  }

  /**
   * Set up the database connection and initialize dependencies
   */
  async setupDatabase() {
    try {
      const dbConfig = new DatabaseConfig();
      this.connection = dbConfig.createConnection();
      await dbConfig.connect(this.connection);
      
      // Initialize repository, service, and controller with the DB connection
      this.taskRepository = new TaskRepository(this.connection);
      this.taskService = new TaskService(this.taskRepository);
      this.taskController = new TaskController(this.taskService);
      
      console.log('Database and dependencies initialized successfully');
    } catch (error) {
      console.error('Failed to setup database:', error);
      process.exit(1);
    }
  }

  /**
   * Register all API routes
   */
  setupRoutes() {
    const taskRoutes = new TaskRoutes(this.taskController);
    this.app.use('/', taskRoutes.getRouter());
  }

  /**
   * Set up error handling middleware
   */
  setupErrorHandling() {
    this.app.use(ErrorHandler.notFound);
    this.app.use(ErrorHandler.handleError);
  }

  /**
   * Initialize the application (middleware, DB, routes, error handling)
   */
  async initialize() {
    try {
      this.setupMiddleware();
      await this.setupDatabase();
      this.setupRoutes();
      this.setupErrorHandling();
    } catch (error) {
      console.error('Failed to initialize application:', error);
      process.exit(1);
    }
  }

  /**
   * Start the Express server
   */
  start() {
    this.app.listen(this.port, () => {
      console.log(`Server is running on port ${this.port}`);
    });
  }
}

// Start the application
const startApp = async () => {
  const app = new App();
  await app.initialize();
  app.start();
};

startApp().catch(error => {
  console.error('Failed to start application:', error);
  process.exit(1);
});



