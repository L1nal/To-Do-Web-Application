const express = require('express');
const router = express.Router();

class TaskRoutes {
  constructor(taskController) {
    this.taskController = taskController;
    this.router = router;
    this.setupRoutes();
  }

  setupRoutes() {
    // Get all tasks
    this.router.get('/tasks', (req, res) => this.taskController.getAllTasks(req, res));

    // Create new task
    this.router.post('/tasks', (req, res) => this.taskController.createTask(req, res));

    // Update task
    this.router.put('/tasks/:id', (req, res) => this.taskController.updateTask(req, res));

    // Update task status
    this.router.put('/tasks/:id/status', (req, res) => this.taskController.updateTaskStatus(req, res));

    // Soft delete task
    this.router.delete('/tasks/:id', (req, res) => this.taskController.deleteTask(req, res));

    // Restore task
    this.router.put('/tasks/:id/restore', (req, res) => this.taskController.restoreTask(req, res));

    // Permanent delete task
    this.router.delete('/tasks/:id/permanent', (req, res) => this.taskController.permanentDeleteTask(req, res));
  }

  getRouter() {
    return this.router;
  }
}

module.exports = TaskRoutes; 