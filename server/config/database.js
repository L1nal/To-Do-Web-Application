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

  async connect(connection, maxRetries = 5, retryDelay = 2000) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await new Promise((resolve, reject) => {
          connection.connect((err) => {
            if (err) {
              console.error(`Connection attempt ${attempt} failed:`, err.message);
              reject(err);
            } else {
              console.log('Connected to MySQL database');
              resolve();
            }
          });
        });
        return; 
      } catch (error) {
        if (attempt === maxRetries) {
          console.error(`Failed to connect after ${maxRetries} attempts:`, error.message);
          throw error;
        }
        console.log(`Connection attempt ${attempt} failed, retrying in ${retryDelay}ms...`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      }
    }
  }
}

module.exports = DatabaseConfig; 