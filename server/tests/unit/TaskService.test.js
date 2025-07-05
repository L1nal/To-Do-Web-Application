const TaskService = require('../../services/TaskService');

// Mock TaskRepository
const mockTaskRepository = {
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  updateStatus: jest.fn(),
  softDelete: jest.fn(),
  restore: jest.fn(),
  permanentDelete: jest.fn()
};

describe('TaskService', () => {
  let taskService;

  beforeEach(() => {
    taskService = new TaskService(mockTaskRepository);
    jest.clearAllMocks();
  });

  describe('getAllTasks', () => {
    it('should return all tasks successfully', async () => {
      const mockTasks = [
        { id: 1, title: 'Task 1', description: 'Description 1', status: 'active' },
        { id: 2, title: 'Task 2', description: 'Description 2', status: 'completed' }
      ];

      mockTaskRepository.findAll.mockResolvedValue(mockTasks);

      const result = await taskService.getAllTasks();

      expect(mockTaskRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockTasks);
    });

    it('should throw error when repository fails', async () => {
      const mockError = new Error('Database error');
      mockTaskRepository.findAll.mockRejectedValue(mockError);

      await expect(taskService.getAllTasks()).rejects.toThrow('Failed to fetch tasks');
    });
  });

  describe('getTaskById', () => {
    it('should return a task by id successfully', async () => {
      const mockTask = { id: 1, title: 'Task 1', description: 'Description 1', status: 'active' };

      mockTaskRepository.findById.mockResolvedValue(mockTask);

      const result = await taskService.getTaskById(1);

      expect(mockTaskRepository.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockTask);
    });

    it('should throw error when task not found', async () => {
      mockTaskRepository.findById.mockResolvedValue(null);

      await expect(taskService.getTaskById(999)).rejects.toThrow('Failed to fetch task');
    });

    it('should throw error when repository fails', async () => {
      const mockError = new Error('Database error');
      mockTaskRepository.findById.mockRejectedValue(mockError);

      await expect(taskService.getTaskById(1)).rejects.toThrow('Failed to fetch task');
    });
  });

  describe('createTask', () => {
    it('should create a new task successfully', async () => {
      const taskData = { title: 'New Task', description: 'New Description' };
      const mockTask = { id: 3, title: 'New Task', description: 'New Description', status: 'active' };

      mockTaskRepository.create.mockResolvedValue(3);
      mockTaskRepository.findById.mockResolvedValue(mockTask);

      const result = await taskService.createTask(taskData);

      expect(mockTaskRepository.create).toHaveBeenCalledWith(taskData);
      expect(mockTaskRepository.findById).toHaveBeenCalledWith(3);
      expect(result).toEqual(mockTask);
    });

    it('should throw error when repository create fails', async () => {
      const taskData = { title: 'New Task', description: 'New Description' };
      const mockError = new Error('Database error');

      mockTaskRepository.create.mockRejectedValue(mockError);

      await expect(taskService.createTask(taskData)).rejects.toThrow('Failed to create task');
    });
  });

  describe('updateTask', () => {
    it('should update a task successfully', async () => {
      const taskData = { title: 'Updated Task', description: 'Updated Description' };

      mockTaskRepository.update.mockResolvedValue({ affectedRows: 1 });

      const result = await taskService.updateTask(1, taskData);

      expect(mockTaskRepository.update).toHaveBeenCalledWith(1, taskData);
      expect(result).toEqual({ message: 'Task updated successfully' });
    });

    it('should throw error when repository update fails', async () => {
      const taskData = { title: 'Updated Task', description: 'Updated Description' };
      const mockError = new Error('Database error');

      mockTaskRepository.update.mockRejectedValue(mockError);

      await expect(taskService.updateTask(1, taskData)).rejects.toThrow('Failed to update task');
    });
  });

  describe('updateTaskStatus', () => {
    it('should update task status successfully', async () => {
      mockTaskRepository.updateStatus.mockResolvedValue({ affectedRows: 1 });

      const result = await taskService.updateTaskStatus(1, 'completed');

      expect(mockTaskRepository.updateStatus).toHaveBeenCalledWith(1, 'completed');
      expect(result).toEqual({ message: 'Task status updated successfully' });
    });

    it('should throw error when repository updateStatus fails', async () => {
      const mockError = new Error('Database error');

      mockTaskRepository.updateStatus.mockRejectedValue(mockError);

      await expect(taskService.updateTaskStatus(1, 'completed')).rejects.toThrow('Failed to update task status');
    });
  });

  describe('deleteTask', () => {
    it('should soft delete a task successfully', async () => {
      mockTaskRepository.softDelete.mockResolvedValue({ affectedRows: 1 });

      const result = await taskService.deleteTask(1);

      expect(mockTaskRepository.softDelete).toHaveBeenCalledWith(1);
      expect(result).toEqual({ message: 'Task deleted successfully' });
    });

    it('should throw error when repository softDelete fails', async () => {
      const mockError = new Error('Database error');

      mockTaskRepository.softDelete.mockRejectedValue(mockError);

      await expect(taskService.deleteTask(1)).rejects.toThrow('Failed to delete task');
    });
  });

  describe('restoreTask', () => {
    it('should restore a soft-deleted task successfully', async () => {
      mockTaskRepository.restore.mockResolvedValue({ affectedRows: 1 });

      const result = await taskService.restoreTask(1);

      expect(mockTaskRepository.restore).toHaveBeenCalledWith(1);
      expect(result).toEqual({ message: 'Task restored successfully' });
    });

    it('should throw error when repository restore fails', async () => {
      const mockError = new Error('Database error');

      mockTaskRepository.restore.mockRejectedValue(mockError);

      await expect(taskService.restoreTask(1)).rejects.toThrow('Failed to restore task');
    });
  });

  describe('permanentDeleteTask', () => {
    it('should permanently delete a task successfully', async () => {
      mockTaskRepository.permanentDelete.mockResolvedValue({ affectedRows: 1 });

      const result = await taskService.permanentDeleteTask(1);

      expect(mockTaskRepository.permanentDelete).toHaveBeenCalledWith(1);
      expect(result).toEqual({ message: 'Task permanently deleted' });
    });

    it('should throw error when repository permanentDelete fails', async () => {
      const mockError = new Error('Database error');

      mockTaskRepository.permanentDelete.mockRejectedValue(mockError);

      await expect(taskService.permanentDeleteTask(1)).rejects.toThrow('Failed to permanently delete task');
    });
  });
}); 