-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS todo_app;
USE todo_app;

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status ENUM('active', 'completed', 'deleted') DEFAULT 'active',
    priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
    due_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

-- Insert some sample data
INSERT INTO tasks (title, description, status, priority, due_date) VALUES
('Complete Docker setup', 'Set up Docker containers for the full-stack application', 'completed', 'high', '2024-01-15'),
('Write documentation', 'Create comprehensive documentation for the project', 'active', 'medium', '2024-01-20'),
('Run tests', 'Execute all unit and integration tests', 'active', 'low', '2024-01-18'); 