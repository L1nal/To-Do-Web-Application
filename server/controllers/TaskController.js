// Controller for handling task-related HTTP requests
class TaskController {
  constructor(taskService) {
    this.taskService = taskService;
  }

  /**
   * Get all tasks
   * Route: GET /tasks
   */
  async getAllTasks(req, res) {
    try {
      const tasks = await this.taskService.getAllTasks();
      res.json(tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * Create a new task
   * Route: POST /tasks
   */
  async createTask(req, res) {
    try {
      const taskData = req.body;
      const newTask = await this.taskService.createTask(taskData);
      res.status(201).json(newTask);
    } catch (error) {
      console.error('Error creating task:', error);
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * Update an existing task
   * Route: PUT /tasks/:id
   */
  async updateTask(req, res) {
    try {
      const { id } = req.params;
      const taskData = req.body;
      const result = await this.taskService.updateTask(id, taskData);
      res.json(result);
    } catch (error) {
      console.error('Error updating task:', error);
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * Update the status of a task (e.g., complete, delete)
   * Route: PUT /tasks/:id/status
   */
  async updateTaskStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const result = await this.taskService.updateTaskStatus(id, status);
      res.json(result);
    } catch (error) {
      console.error('Error updating task status:', error);
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * Soft delete a task (mark as deleted)
   * Route: DELETE /tasks/:id
   */
  async deleteTask(req, res) {
    try {
      const { id } = req.params;
      const result = await this.taskService.deleteTask(id);
      res.json(result);
    } catch (error) {
      console.error('Error deleting task:', error);
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * Restore a soft-deleted task
   * Route: PUT /tasks/:id/restore
   */
  async restoreTask(req, res) {
    try {
      const { id } = req.params;
      const result = await this.taskService.restoreTask(id);
      res.json(result);
    } catch (error) {
      console.error('Error restoring task:', error);
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * Permanently delete a task from the database
   * Route: DELETE /tasks/:id/permanent
   */
  async permanentDeleteTask(req, res) {
    try {
      const { id } = req.params;
      const result = await this.taskService.permanentDeleteTask(id);
      res.json(result);
    } catch (error) {
      console.error('Error permanently deleting task:', error);
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = TaskController; 