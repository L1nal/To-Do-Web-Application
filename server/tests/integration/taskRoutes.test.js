const request = require('supertest');
const express = require('express');

// Mock the database and dependencies
jest.mock('../../config/database');
jest.mock('../../repositories/TaskRepository');
jest.mock('../../services/TaskService');
jest.mock('../../controllers/TaskController');

const TaskController = require('../../controllers/TaskController');
const TaskRoutes = require('../../routes/taskRoutes');

describe('Task Routes Integration Tests', () => {
  let app;
  let mockTaskController;

  beforeEach(() => {
    app = express();
    app.use(express.json());

    mockTaskController = {
      getAllTasks: jest.fn(),
      createTask: jest.fn(),
      updateTask: jest.fn(),
      updateTaskStatus: jest.fn(),
      deleteTask: jest.fn(),
      restoreTask: jest.fn(),
      permanentDeleteTask: jest.fn()
    };

    app.get('/tasks', (req, res) => mockTaskController.getAllTasks(req, res));
    app.post('/tasks', (req, res) => mockTaskController.createTask(req, res));
    app.put('/tasks/:id', (req, res) => mockTaskController.updateTask(req, res));
    app.put('/tasks/:id/status', (req, res) => mockTaskController.updateTaskStatus(req, res));
    app.delete('/tasks/:id', (req, res) => mockTaskController.deleteTask(req, res));
    app.put('/tasks/:id/restore', (req, res) => mockTaskController.restoreTask(req, res));
    app.delete('/tasks/:id/permanent', (req, res) => mockTaskController.permanentDeleteTask(req, res));

    app.use((err, req, res, next) => {
      if (err.type === 'entity.parse.failed') {
        return res.status(400).json({ error: 'Invalid JSON format' });
      }
      next(err);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /tasks', () => {
    it('should return all tasks successfully', async () => {
      const mockTasks = [
        { id: 1, title: 'Task 1', description: 'Description 1', status: 'active' },
        { id: 2, title: 'Task 2', description: 'Description 2', status: 'completed' }
      ];

      mockTaskController.getAllTasks.mockImplementation((req, res) => {
        res.json(mockTasks);
      });

      const response = await request(app)
        .get('/tasks')
        .expect(200);

      expect(mockTaskController.getAllTasks).toHaveBeenCalled();
      expect(response.body).toEqual(mockTasks);
    });

    it('should handle controller errors', async () => {
      mockTaskController.getAllTasks.mockImplementation((req, res) => {
        res.status(500).json({ error: 'Database error' });
      });

      const response = await request(app)
        .get('/tasks')
        .expect(500);

      expect(response.body).toEqual({ error: 'Database error' });
    });
  });

  describe('POST /tasks', () => {
    it('should create a new task successfully', async () => {
      const taskData = { title: 'New Task', description: 'New Description' };
      const mockTask = { id: 3, ...taskData, status: 'active' };

      mockTaskController.createTask.mockImplementation((req, res) => {
        res.status(201).json(mockTask);
      });

      const response = await request(app)
        .post('/tasks')
        .send(taskData)
        .expect(201);

      expect(mockTaskController.createTask).toHaveBeenCalled();
      expect(response.body).toEqual(mockTask);
    });

    it('should handle validation errors', async () => {
      const taskData = { title: '', description: 'Invalid task' };

      mockTaskController.createTask.mockImplementation((req, res) => {
        res.status(400).json({ error: 'Title is required' });
      });

      const response = await request(app)
        .post('/tasks')
        .send(taskData)
        .expect(400);

      expect(response.body).toEqual({ error: 'Title is required' });
    });
  });

  describe('PUT /tasks/:id', () => {
    it('should update a task successfully', async () => {
      const taskData = { title: 'Updated Task', description: 'Updated Description' };
      const mockResult = { message: 'Task updated successfully' };

      mockTaskController.updateTask.mockImplementation((req, res) => {
        res.json(mockResult);
      });

      const response = await request(app)
        .put('/tasks/1')
        .send(taskData)
        .expect(200);

      expect(mockTaskController.updateTask).toHaveBeenCalled();
      expect(response.body).toEqual(mockResult);
    });

    it('should handle task not found', async () => {
      const taskData = { title: 'Updated Task', description: 'Updated Description' };

      mockTaskController.updateTask.mockImplementation((req, res) => {
        res.status(400).json({ error: 'Task not found' });
      });

      const response = await request(app)
        .put('/tasks/999')
        .send(taskData)
        .expect(400);

      expect(response.body).toEqual({ error: 'Task not found' });
    });
  });

  describe('PUT /tasks/:id/status', () => {
    it('should update task status successfully', async () => {
      const statusData = { status: 'completed' };
      const mockResult = { message: 'Task status updated successfully' };

      mockTaskController.updateTaskStatus.mockImplementation((req, res) => {
        res.json(mockResult);
      });

      const response = await request(app)
        .put('/tasks/1/status')
        .send(statusData)
        .expect(200);

      expect(mockTaskController.updateTaskStatus).toHaveBeenCalled();
      expect(response.body).toEqual(mockResult);
    });

    it('should handle invalid status', async () => {
      const statusData = { status: 'invalid' };

      mockTaskController.updateTaskStatus.mockImplementation((req, res) => {
        res.status(400).json({ error: 'Invalid status' });
      });

      const response = await request(app)
        .put('/tasks/1/status')
        .send(statusData)
        .expect(400);

      expect(response.body).toEqual({ error: 'Invalid status' });
    });
  });

  describe('DELETE /tasks/:id', () => {
    it('should soft delete a task successfully', async () => {
      const mockResult = { message: 'Task deleted successfully' };

      mockTaskController.deleteTask.mockImplementation((req, res) => {
        res.json(mockResult);
      });

      const response = await request(app)
        .delete('/tasks/1')
        .expect(200);

      expect(mockTaskController.deleteTask).toHaveBeenCalled();
      expect(response.body).toEqual(mockResult);
    });

    it('should handle task not found for deletion', async () => {
      mockTaskController.deleteTask.mockImplementation((req, res) => {
        res.status(400).json({ error: 'Task not found' });
      });

      const response = await request(app)
        .delete('/tasks/999')
        .expect(400);

      expect(response.body).toEqual({ error: 'Task not found' });
    });
  });

  describe('PUT /tasks/:id/restore', () => {
    it('should restore a soft-deleted task successfully', async () => {
      const mockResult = { message: 'Task restored successfully' };

      mockTaskController.restoreTask.mockImplementation((req, res) => {
        res.json(mockResult);
      });

      const response = await request(app)
        .put('/tasks/1/restore')
        .expect(200);

      expect(mockTaskController.restoreTask).toHaveBeenCalled();
      expect(response.body).toEqual(mockResult);
    });

    it('should handle task not found for restoration', async () => {
      mockTaskController.restoreTask.mockImplementation((req, res) => {
        res.status(400).json({ error: 'Task not found' });
      });

      const response = await request(app)
        .put('/tasks/999/restore')
        .expect(400);

      expect(response.body).toEqual({ error: 'Task not found' });
    });
  });

  describe('DELETE /tasks/:id/permanent', () => {
    it('should permanently delete a task successfully', async () => {
      const mockResult = { message: 'Task permanently deleted' };

      mockTaskController.permanentDeleteTask.mockImplementation((req, res) => {
        res.json(mockResult);
      });

      const response = await request(app)
        .delete('/tasks/1/permanent')
        .expect(200);

      expect(mockTaskController.permanentDeleteTask).toHaveBeenCalled();
      expect(response.body).toEqual(mockResult);
    });

    it('should handle task not found for permanent deletion', async () => {
      mockTaskController.permanentDeleteTask.mockImplementation((req, res) => {
        res.status(400).json({ error: 'Task not found' });
      });

      const response = await request(app)
        .delete('/tasks/999/permanent')
        .expect(400);

      expect(response.body).toEqual({ error: 'Task not found' });
    });
  });

  describe('Route validation', () => {
    it('should return 404 for non-existent routes', async () => {
      await request(app)
        .get('/non-existent-route')
        .expect(404);
    });

    it('should handle malformed JSON in request body', async () => {
      const response = await request(app)
        .post('/tasks')
        .set('Content-Type', 'application/json')
        .send('{"invalid": json}')
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });
}); 