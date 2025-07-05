const TaskRepository = require('../../repositories/TaskRepository');

// Mock MySQL connection
const mockConnection = {
  query: jest.fn()
};

describe('TaskRepository', () => {
  let taskRepository;

  beforeEach(() => {
    taskRepository = new TaskRepository(mockConnection);
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all tasks successfully', async () => {
      const mockTasks = [
        { id: 1, title: 'Task 1', description: 'Description 1', status: 'active' },
        { id: 2, title: 'Task 2', description: 'Description 2', status: 'completed' }
      ];

      mockConnection.query.mockImplementation((query, callback) => {
        callback(null, mockTasks);
      });

      const result = await taskRepository.findAll();

      expect(mockConnection.query).toHaveBeenCalledWith(
        'SELECT * FROM tasks ORDER BY created_at DESC',
        expect.any(Function)
      );
      expect(result).toEqual(mockTasks);
    });

    it('should throw error when database query fails', async () => {
      const mockError = new Error('Database connection failed');

      mockConnection.query.mockImplementation((query, callback) => {
        callback(mockError, null);
      });

      await expect(taskRepository.findAll()).rejects.toThrow('Database connection failed');
    });
  });

  describe('findById', () => {
    it('should return a task by id successfully', async () => {
      const mockTask = { id: 1, title: 'Task 1', description: 'Description 1', status: 'active' };

      mockConnection.query.mockImplementation((query, params, callback) => {
        expect(query).toBe('SELECT * FROM tasks WHERE id = ?');
        expect(params).toEqual([1]);
        callback(null, [mockTask]);
      });

      const result = await taskRepository.findById(1);

      expect(result).toEqual(mockTask);
    });

    it('should return null when task not found', async () => {
      mockConnection.query.mockImplementation((query, params, callback) => {
        callback(null, []);
      });

      const result = await taskRepository.findById(999);

      expect(result).toBeUndefined();
    });

    it('should throw error when database query fails', async () => {
      const mockError = new Error('Database error');

      mockConnection.query.mockImplementation((query, params, callback) => {
        callback(mockError, null);
      });

      await expect(taskRepository.findById(1)).rejects.toThrow('Database error');
    });
  });

  describe('create', () => {
    it('should create a new task successfully', async () => {
      const taskData = { title: 'New Task', description: 'New Description' };
      const mockResult = { insertId: 3 };

      mockConnection.query.mockImplementation((query, params, callback) => {
        expect(query).toBe('INSERT INTO tasks (title, description, status) VALUES (?, ?, ?)');
        expect(params).toEqual(['New Task', 'New Description', 'active']);
        callback(null, mockResult);
      });

      const result = await taskRepository.create(taskData);

      expect(result).toBe(3);
    });

    it('should create task with custom status', async () => {
      const taskData = { title: 'New Task', description: 'New Description', status: 'completed' };

      mockConnection.query.mockImplementation((query, params, callback) => {
        expect(params).toEqual(['New Task', 'New Description', 'completed']);
        callback(null, { insertId: 4 });
      });

      const result = await taskRepository.create(taskData);

      expect(result).toBe(4);
    });

    it('should throw error when database insert fails', async () => {
      const taskData = { title: 'New Task', description: 'New Description' };
      const mockError = new Error('Insert failed');

      mockConnection.query.mockImplementation((query, params, callback) => {
        callback(mockError, null);
      });

      await expect(taskRepository.create(taskData)).rejects.toThrow('Insert failed');
    });
  });

  describe('update', () => {
    it('should update a task successfully', async () => {
      const taskData = { title: 'Updated Task', description: 'Updated Description' };
      const mockResult = { affectedRows: 1 };

      mockConnection.query.mockImplementation((query, params, callback) => {
        expect(query).toBe('UPDATE tasks SET title = ?, description = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
        expect(params).toEqual(['Updated Task', 'Updated Description', 1]);
        callback(null, mockResult);
      });

      const result = await taskRepository.update(1, taskData);

      expect(result).toEqual(mockResult);
    });

    it('should throw error when database update fails', async () => {
      const taskData = { title: 'Updated Task', description: 'Updated Description' };
      const mockError = new Error('Update failed');

      mockConnection.query.mockImplementation((query, params, callback) => {
        callback(mockError, null);
      });

      await expect(taskRepository.update(1, taskData)).rejects.toThrow('Update failed');
    });
  });

  describe('updateStatus', () => {
    it('should update task status successfully', async () => {
      const mockResult = { affectedRows: 1 };

      mockConnection.query.mockImplementation((query, params, callback) => {
        expect(query).toBe('UPDATE tasks SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
        expect(params).toEqual(['completed', 1]);
        callback(null, mockResult);
      });

      const result = await taskRepository.updateStatus(1, 'completed');

      expect(result).toEqual(mockResult);
    });
  });

  describe('softDelete', () => {
    it('should soft delete a task successfully', async () => {
      const mockResult = { affectedRows: 1 };

      mockConnection.query.mockImplementation((query, params, callback) => {
        expect(query).toBe('UPDATE tasks SET status = "deleted", deleted_at = CURRENT_TIMESTAMP WHERE id = ?');
        expect(params).toEqual([1]);
        callback(null, mockResult);
      });

      const result = await taskRepository.softDelete(1);

      expect(result).toEqual(mockResult);
    });
  });

  describe('restore', () => {
    it('should restore a soft-deleted task successfully', async () => {
      const mockResult = { affectedRows: 1 };

      mockConnection.query.mockImplementation((query, params, callback) => {
        expect(query).toBe('UPDATE tasks SET status = "active", deleted_at = NULL WHERE id = ?');
        expect(params).toEqual([1]);
        callback(null, mockResult);
      });

      const result = await taskRepository.restore(1);

      expect(result).toEqual(mockResult);
    });
  });

  describe('permanentDelete', () => {
    it('should permanently delete a task successfully', async () => {
      const mockResult = { affectedRows: 1 };

      mockConnection.query.mockImplementation((query, params, callback) => {
        expect(query).toBe('DELETE FROM tasks WHERE id = ?');
        expect(params).toEqual([1]);
        callback(null, mockResult);
      });

      const result = await taskRepository.permanentDelete(1);

      expect(result).toEqual(mockResult);
    });
  });
}); 