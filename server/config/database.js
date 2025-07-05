const mysql = require('mysql2');

class DatabaseConfig {
  constructor() {
    this.config = {
      host: 'localhost',
      user: 'root',
      password: 'admin',
      database: 'todo_app'
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
          console.log('Connected to MySQL database!');
          resolve();
        }
      });
    });
  }
}

module.exports = DatabaseConfig; 