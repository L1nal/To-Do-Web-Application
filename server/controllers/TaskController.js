class TaskController {
  constructor(taskService) {
    this.taskService = taskService;
  }

  async getAllTasks(req, res) {
    try {
      const tasks = await this.taskService.getAllTasks();
      res.json(tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      res.status(500).json({ error: error.message });
    }
  }

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