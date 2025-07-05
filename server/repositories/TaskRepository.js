class TaskRepository {
  constructor(connection) {
    this.connection = connection;
  }

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