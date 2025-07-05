// TaskRepository handles all database operations for tasks
class TaskRepository {
  /**
   * @param {Object} connection - MySQL connection instance
   */
  constructor(connection) {
    this.connection = connection;
  }

  /**
   * Retrieve all tasks from the database
   * @returns {Promise<Array>} List of tasks
   */
  async findAll() {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM tasks ORDER BY created_at DESC';
      this.connection.query(query, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }

  /**
   * Find a task by its ID
   * @param {number} id - Task ID
   * @returns {Promise<Object>} Task object
   */
  async findById(id) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM tasks WHERE id = ?';
      this.connection.query(query, [id], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results[0]);
        }
      });
    });
  }

  /**
   * Create a new task in the database
   * @param {Object} taskData - Task data (title, description, status)
   * @returns {Promise<number>} Inserted task ID
   */
  async create(taskData) {
    return new Promise((resolve, reject) => {
      const { title, description, status = 'active' } = taskData;
      const query = 'INSERT INTO tasks (title, description, status) VALUES (?, ?, ?)';
      
      this.connection.query(query, [title, description, status], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result.insertId);
        }
      });
    });
  }

  /**
   * Update an existing task
   * @param {number} id - Task ID
   * @param {Object} taskData - Updated task data
   * @returns {Promise<Object>} SQL result
   */
  async update(id, taskData) {
    return new Promise((resolve, reject) => {
      const { title, description } = taskData;
      const query = 'UPDATE tasks SET title = ?, description = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
      
      this.connection.query(query, [title, description, id], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  /**
   * Update the status of a task
   * @param {number} id - Task ID
   * @param {string} status - New status
   * @returns {Promise<Object>} SQL result
   */
  async updateStatus(id, status) {
    return new Promise((resolve, reject) => {
      const query = 'UPDATE tasks SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
      
      this.connection.query(query, [status, id], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  /**
   * Soft delete a task (mark as deleted, set deleted_at)
   * @param {number} id - Task ID
   * @returns {Promise<Object>} SQL result
   */
  async softDelete(id) {
    return new Promise((resolve, reject) => {
      const query = 'UPDATE tasks SET status = "deleted", deleted_at = CURRENT_TIMESTAMP WHERE id = ?';
      
      this.connection.query(query, [id], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  /**
   * Restore a soft-deleted task (set status to active, clear deleted_at)
   * @param {number} id - Task ID
   * @returns {Promise<Object>} SQL result
   */
  async restore(id) {
    return new Promise((resolve, reject) => {
      const query = 'UPDATE tasks SET status = "active", deleted_at = NULL WHERE id = ?';
      
      this.connection.query(query, [id], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  /**
   * Permanently delete a task from the database
   * @param {number} id - Task ID
   * @returns {Promise<Object>} SQL result
   */
  async permanentDelete(id) {
    return new Promise((resolve, reject) => {
      const query = 'DELETE FROM tasks WHERE id = ?';
      
      this.connection.query(query, [id], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }
}

module.exports = TaskRepository; 