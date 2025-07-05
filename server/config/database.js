const mysql = require('mysql2');

class DatabaseConfig {
  constructor() {
    this.config = {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'admin',
      database: process.env.DB_NAME || 'todo_app'
    };
  }

  createConnection() {
    return mysql.createConnection(this.config);
  }

  connect(connection) {
    return new Promise((resolve, reject) => {
      connection.connect((err) => {
        if (err) {
          console.error('Error connecting to MySQL:', err.message);
          reject(err);
        } else {
          console.log('Connected to MySQL database');
          resolve();
        }
      });
    });
  }
}

module.exports = DatabaseConfig; 