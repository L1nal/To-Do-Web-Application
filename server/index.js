const express = require('express');
const cors = require('cors');
const app = express();
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'admin',
    database: 'todo_app'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err.message);
    } else {
        console.log('Connected to MySQL database!');
    }
});

app.use(cors());
app.use(express.json());

// Get all tasks from database
app.get('/tasks', (req, res) => {
  const query = 'SELECT * FROM tasks ORDER BY created_at DESC';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching tasks:', err);
      res.status(500).json({ error: 'Failed to fetch tasks' });
    } else {
      res.json(results);
    }
  });
});

// Add new task to database
app.post('/tasks', (req, res) => {
  const { title, description, status = 'active' } = req.body;
  const query = 'INSERT INTO tasks (title, description, status) VALUES (?, ?, ?)';
  
  connection.query(query, [title, description, status], (err, result) => {
    if (err) {
      console.error('Error adding task:', err);
      res.status(500).json({ error: 'Failed to add task' });
    } else {
      // Get the newly created task
      const newTaskId = result.insertId;
      const getTaskQuery = 'SELECT * FROM tasks WHERE id = ?';
      connection.query(getTaskQuery, [newTaskId], (err, results) => {
        if (err) {
          res.status(201).json({ id: newTaskId, title, description, status });
        } else {
          res.status(201).json(results[0]);
        }
      });
    }
  });
});

// Update task status (complete task)
app.put('/tasks/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  const query = 'UPDATE tasks SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
  connection.query(query, [status, id], (err, result) => {
    if (err) {
      console.error('Error updating task:', err);
      res.status(500).json({ error: 'Failed to update task' });
    } else {
      res.json({ message: 'Task updated successfully' });
    }
  });
});

// Soft delete task (mark as deleted)
app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;
  
  const query = 'UPDATE tasks SET status = "deleted", deleted_at = CURRENT_TIMESTAMP WHERE id = ?';
  connection.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error deleting task:', err);
      res.status(500).json({ error: 'Failed to delete task' });
    } else {
      res.json({ message: 'Task deleted successfully' });
    }
  });
});

// Restore deleted task
app.put('/tasks/:id/restore', (req, res) => {
  const { id } = req.params;
  
  const query = 'UPDATE tasks SET status = "active", deleted_at = NULL WHERE id = ?';
  connection.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error restoring task:', err);
      res.status(500).json({ error: 'Failed to restore task' });
    } else {
      res.json({ message: 'Task restored successfully' });
    }
  });
});

// Hard delete task (permanently remove)
app.delete('/tasks/:id/permanent', (req, res) => {
  const { id } = req.params;
  
  const query = 'DELETE FROM tasks WHERE id = ?';
  connection.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error permanently deleting task:', err);
      res.status(500).json({ error: 'Failed to delete task' });
    } else {
      res.json({ message: 'Task permanently deleted' });
    }
  });
});

// Update task title and description
app.put('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  const query = 'UPDATE tasks SET title = ?, description = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
  connection.query(query, [title, description, id], (err, result) => {
    if (err) {
      console.error('Error updating task:', err);
      res.status(500).json({ error: 'Failed to update task' });
    } else {
      res.json({ message: 'Task updated successfully' });
    }
  });
});

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});



