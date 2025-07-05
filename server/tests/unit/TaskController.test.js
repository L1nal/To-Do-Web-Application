const TaskController = require('../../controllers/TaskController');

const mockTaskService = {
  getAllTasks: jest.fn(),
  getTaskById: jest.fn(),
  createTask: jest.fn(),
  updateTask: jest.fn(),
  updateTaskStatus: jest.fn(),
  deleteTask: jest.fn(),
  restoreTask: jest.fn(),
  permanentDeleteTask: jest.fn()
};

describe('TaskController', () => {
  let taskController;
  let mockReq;
  let mockRes;

  beforeEach(() => {
    taskController = new TaskController(mockTaskService);
    jest.clearAllMocks();

    mockReq = {
      body: {},
      params: {},
      query: {}
    };

    mockRes = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };
  });

  describe('getAllTasks', () => {
    it('should return all tasks successfully', async () => {
      const mockTasks = [
        { id: 1, title: 'Task 1', description: 'Description 1', status: 'active' },
        { id: 2, title: 'Task 2', description: 'Description 2', status: 'completed' }
      ];

      mockTaskService.getAllTasks.mockResolvedValue(mockTasks);

      await taskController.getAllTasks(mockReq, mockRes);

      expect(mockTaskService.getAllTasks).toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalledWith(mockTasks);
    });

    it('should handle service error and return 400 status', async () => {
      const mockError = new Error('Database error');
      mockTaskService.getAllTasks.mockRejectedValue(mockError);

      await taskController.getAllTasks(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Database error' });
    });
  });

  describe('createTask', () => {
    it('should create a new task successfully', async () => {
      const taskData = { title: 'New Task', description: 'New Description' };
      const mockTask = { id: 3, ...taskData, status: 'active' };

      mockReq.body = taskData;
      mockTaskService.createTask.mockResolvedValue(mockTask);

      await taskController.createTask(mockReq, mockRes);

      expect(mockTaskService.createTask).toHaveBeenCalledWith(taskData);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(mockTask);
    });

    it('should handle service error and return 400 status', async () => {
      const taskData = { title: 'New Task', description: 'New Description' };
      const mockError = new Error('Validation error');

      mockReq.body = taskData;
      mockTaskService.createTask.mockRejectedValue(mockError);

      await taskController.createTask(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Validation error' });
    });
  });

  describe('updateTask', () => {
    it('should update a task successfully', async () => {
      const taskData = { title: 'Updated Task', description: 'Updated Description' };
      const mockResult = { message: 'Task updated successfully' };

      mockReq.params = { id: '1' };
      mockReq.body = taskData;
      mockTaskService.updateTask.mockResolvedValue(mockResult);

      await taskController.updateTask(mockReq, mockRes);

      expect(mockTaskService.updateTask).toHaveBeenCalledWith('1', taskData);
      expect(mockRes.json).toHaveBeenCalledWith(mockResult);
    });

    it('should handle service error and return 400 status', async () => {
      const taskData = { title: 'Updated Task', description: 'Updated Description' };
      const mockError = new Error('Task not found');

      mockReq.params = { id: '1' };
      mockReq.body = taskData;
      mockTaskService.updateTask.mockRejectedValue(mockError);

      await taskController.updateTask(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Task not found' });
    });
  });

  describe('updateTaskStatus', () => {
    it('should update task status successfully', async () => {
      const mockResult = { message: 'Task status updated successfully' };

      mockReq.params = { id: '1' };
      mockReq.body = { status: 'completed' };
      mockTaskService.updateTaskStatus.mockResolvedValue(mockResult);

      await taskController.updateTaskStatus(mockReq, mockRes);

      expect(mockTaskService.updateTaskStatus).toHaveBeenCalledWith('1', 'completed');
      expect(mockRes.json).toHaveBeenCalledWith(mockResult);
    });

    it('should handle service error and return 400 status', async () => {
      const mockError = new Error('Invalid status');

      mockReq.params = { id: '1' };
      mockReq.body = { status: 'invalid' };
      mockTaskService.updateTaskStatus.mockRejectedValue(mockError);

      await taskController.updateTaskStatus(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Invalid status' });
    });
  });

  describe('deleteTask', () => {
    it('should soft delete a task successfully', async () => {
      const mockResult = { message: 'Task deleted successfully' };

      mockReq.params = { id: '1' };
      mockTaskService.deleteTask.mockResolvedValue(mockResult);

      await taskController.deleteTask(mockReq, mockRes);

      expect(mockTaskService.deleteTask).toHaveBeenCalledWith('1');
      expect(mockRes.json).toHaveBeenCalledWith(mockResult);
    });

    it('should handle service error and return 400 status', async () => {
      const mockError = new Error('Task not found');

      mockReq.params = { id: '1' };
      mockTaskService.deleteTask.mockRejectedValue(mockError);

      await taskController.deleteTask(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Task not found' });
    });
  });

  describe('restoreTask', () => {
    it('should restore a soft-deleted task successfully', async () => {
      const mockResult = { message: 'Task restored successfully' };

      mockReq.params = { id: '1' };
      mockTaskService.restoreTask.mockResolvedValue(mockResult);

      await taskController.restoreTask(mockReq, mockRes);

      expect(mockTaskService.restoreTask).toHaveBeenCalledWith('1');
      expect(mockRes.json).toHaveBeenCalledWith(mockResult);
    });

    it('should handle service error and return 400 status', async () => {
      const mockError = new Error('Task not found');

      mockReq.params = { id: '1' };
      mockTaskService.restoreTask.mockRejectedValue(mockError);

      await taskController.restoreTask(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Task not found' });
    });
  });

  describe('permanentDeleteTask', () => {
    it('should permanently delete a task successfully', async () => {
      const mockResult = { message: 'Task permanently deleted' };

      mockReq.params = { id: '1' };
      mockTaskService.permanentDeleteTask.mockResolvedValue(mockResult);

      await taskController.permanentDeleteTask(mockReq, mockRes);

      expect(mockTaskService.permanentDeleteTask).toHaveBeenCalledWith('1');
      expect(mockRes.json).toHaveBeenCalledWith(mockResult);
    });

    it('should handle service error and return 400 status', async () => {
      const mockError = new Error('Task not found');

      mockReq.params = { id: '1' };
      mockTaskService.permanentDeleteTask.mockRejectedValue(mockError);

      await taskController.permanentDeleteTask(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Task not found' });
    });
  });
}); 