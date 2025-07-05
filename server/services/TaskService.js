// TaskService contains business logic for managing tasks
class TaskService {
  /**
   * @param {TaskRepository} taskRepository - Repository for database operations
   */
  constructor(taskRepository) {
    this.taskRepository = taskRepository;
  }

  /**
   * Retrieve all tasks from the database
   * @returns {Promise<Array>} List of tasks
   */
  async getAllTasks() {
    try {
      return await this.taskRepository.findAll();
    } catch (error) {
      throw new Error('Failed to fetch tasks');
    }
  }

  /**
   * Retrieve a single task by its ID
   * @param {number} id - Task ID
   * @returns {Promise<Object>} Task object
   */
  async getTaskById(id) {
    try {
      const task = await this.taskRepository.findById(id);
      if (!task) {
        throw new Error('Task not found');
      }
      return task;
    } catch (error) {
      throw new Error('Failed to fetch task');
    }
  }

  /**
   * Create a new task
   * @param {Object} taskData - Task data (title, description, etc.)
   * @returns {Promise<Object>} Newly created task
   */
  async createTask(taskData) {
    try {
      const taskId = await this.taskRepository.create(taskData);
      return await this.taskRepository.findById(taskId);
    } catch (error) {
      throw new Error('Failed to create task');
    }
  }

  /**
   * Update an existing task
   * @param {number} id - Task ID
   * @param {Object} taskData - Updated task data
   * @returns {Promise<Object>} Success message
   */
  async updateTask(id, taskData) {
    try {
      await this.taskRepository.update(id, taskData);
      return { message: 'Task updated successfully' };
    } catch (error) {
      throw new Error('Failed to update task');
    }
  }

  /**
   * Update the status of a task (e.g., complete, delete)
   * @param {number} id - Task ID
   * @param {string} status - New status
   * @returns {Promise<Object>} Success message
   */
  async updateTaskStatus(id, status) {
    try {
      await this.taskRepository.updateStatus(id, status);
      return { message: 'Task status updated successfully' };
    } catch (error) {
      throw new Error('Failed to update task status');
    }
  }

  /**
   * Soft delete a task (mark as deleted)
   * @param {number} id - Task ID
   * @returns {Promise<Object>} Success message
   */
  async deleteTask(id) {
    try {
      await this.taskRepository.softDelete(id);
      return { message: 'Task deleted successfully' };
    } catch (error) {
      throw new Error('Failed to delete task');
    }
  }

  /**
   * Restore a soft-deleted task
   * @param {number} id - Task ID
   * @returns {Promise<Object>} Success message
   */
  async restoreTask(id) {
    try {
      await this.taskRepository.restore(id);
      return { message: 'Task restored successfully' };
    } catch (error) {
      throw new Error('Failed to restore task');
    }
  }

  /**
   * Permanently delete a task from the database
   * @param {number} id - Task ID
   * @returns {Promise<Object>} Success message
   */
  async permanentDeleteTask(id) {
    try {
      await this.taskRepository.permanentDelete(id);
      return { message: 'Task permanently deleted' };
    } catch (error) {
      throw new Error('Failed to permanently delete task');
    }
  }
}

module.exports = TaskService; 