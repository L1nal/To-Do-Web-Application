class TaskService {
  constructor(taskRepository) {
    this.taskRepository = taskRepository;
  }

  async getAllTasks() {
    try {
      return await this.taskRepository.findAll();
    } catch (error) {
      throw new Error('Failed to fetch tasks');
    }
  }

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

  async createTask(taskData) {
    try {
      const taskId = await this.taskRepository.create(taskData);
      return await this.taskRepository.findById(taskId);
    } catch (error) {
      throw new Error('Failed to create task');
    }
  }

  async updateTask(id, taskData) {
    try {
      await this.taskRepository.update(id, taskData);
      return { message: 'Task updated successfully' };
    } catch (error) {
      throw new Error('Failed to update task');
    }
  }

  async updateTaskStatus(id, status) {
    try {
      await this.taskRepository.updateStatus(id, status);
      return { message: 'Task status updated successfully' };
    } catch (error) {
      throw new Error('Failed to update task status');
    }
  }

  async deleteTask(id) {
    try {
      await this.taskRepository.softDelete(id);
      return { message: 'Task deleted successfully' };
    } catch (error) {
      throw new Error('Failed to delete task');
    }
  }

  async restoreTask(id) {
    try {
      await this.taskRepository.restore(id);
      return { message: 'Task restored successfully' };
    } catch (error) {
      throw new Error('Failed to restore task');
    }
  }

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