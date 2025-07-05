// TaskRoutes sets up all task-related API endpoints for the application
const express = require('express');
const router = express.Router();

class TaskRoutes {
  /**
   * @param {TaskController} taskController - Controller for handling task requests
   */
  constructor(taskController) {
    this.taskController = taskController;
    this.router = router;
    this.setupRoutes();
  }

  /**
   * Define all task-related routes and map them to controller methods
   */
  setupRoutes() {
    // GET /tasks - Retrieve all tasks
    this.router.get('/tasks', (req, res) => this.taskController.getAllTasks(req, res));

    // POST /tasks - Create a new task
    this.router.post('/tasks', (req, res) => this.taskController.createTask(req, res));

    // PUT /tasks/:id - Update an existing task
    this.router.put('/tasks/:id', (req, res) => this.taskController.updateTask(req, res));

    // PUT /tasks/:id/status - Update the status of a task
    this.router.put('/tasks/:id/status', (req, res) => this.taskController.updateTaskStatus(req, res));

    // DELETE /tasks/:id - Soft delete a task (mark as deleted)
    this.router.delete('/tasks/:id', (req, res) => this.taskController.deleteTask(req, res));

    // PUT /tasks/:id/restore - Restore a soft-deleted task
    this.router.put('/tasks/:id/restore', (req, res) => this.taskController.restoreTask(req, res));

    // DELETE /tasks/:id/permanent - Permanently delete a task
    this.router.delete('/tasks/:id/permanent', (req, res) => this.taskController.permanentDeleteTask(req, res));
  }

  /**
   * Get the Express router instance
   * @returns {express.Router}
   */
  getRouter() {
    return this.router;
  }
}

module.exports = TaskRoutes; 