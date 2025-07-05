# Todo Application - Full Stack with Docker

A full-stack todo application built with React (frontend), Node.js/Express (backend), and MySQL (database), containerized with Docker.

## Features

- ✅ Create, read, update, and delete tasks
- ✅ Task status management (pending, in progress, completed)
- ✅ Task priority levels (low, medium, high)
- ✅ Due date tracking
- ✅ Soft delete and restore functionality
- ✅ Responsive design with Tailwind CSS
- ✅ Comprehensive testing (unit and integration tests)
- ✅ Docker containerization for easy deployment

## Tech Stack

### Frontend
- React 19
- Vite
- Tailwind CSS
- Axios for API calls
- Jest for testing

### Backend
- Node.js
- Express.js
- MySQL database
- Jest for testing

### Infrastructure
- Docker & Docker Compose
- Nginx (production)
- MySQL 8.0

## Running with Docker

### Prerequisites
- Docker and Docker Compose installed
- Linux development environment with Bash

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Linal_Assesment
   ```

2. **Build and run all services**
   ```bash
   docker-compose up --build
   ```

3. **Access the application**
   - Frontend: http://localhost
   - Backend API: http://localhost:5000
   - Database: localhost:3306

### Docker Commands

```bash
# Start all services
docker-compose up --build

# Start in background
docker-compose up --build -d

# Stop all services
docker-compose down

# View logs
docker-compose logs

# Remove all containers and volumes
docker-compose down -v
```

## Docker Services

### 1. Database (MySQL)
- **Port**: 3306
- **Database**: `todo_app`
- **User**: `todo_user`
- **Password**: `todo_password`

### 2. Backend API (Node.js/Express)
- **Port**: 5000
- **Features**: RESTful API, database operations, error handling

### 3. Frontend (React)
- **Port**: 80
- **Features**: Modern UI, responsive design, real-time updates

## API Endpoints

- `GET /tasks` - Get all tasks
- `POST /tasks` - Create a new task
- `PUT /tasks/:id` - Update a task
- `DELETE /tasks/:id` - Soft delete a task
- `PUT /tasks/:id/status` - Update task status
- `PUT /tasks/:id/restore` - Restore a deleted task
- `DELETE /tasks/:id/permanent` - Permanently delete a task

## Testing

### Run Tests in Docker
```bash
# Run backend tests
docker-compose exec server npm test

# Run frontend tests
docker-compose exec client npm test

# Run tests with coverage
docker-compose exec server npm run test:coverage
docker-compose exec client npm run test:coverage
```

## Project Structure

```
Linal_Assesment/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── services/       # API services
│   │   ├── hooks/          # Custom hooks
│   │   └── utils/          # Utility functions
│   ├── Dockerfile          # Production Dockerfile
│   └── nginx.conf          # Nginx configuration
├── server/                 # Node.js backend
│   ├── controllers/        # Route controllers
│   ├── services/           # Business logic
│   ├── repositories/       # Data access layer
│   ├── routes/             # API routes
│   ├── middleware/         # Express middleware
│   ├── config/             # Configuration files
│   ├── tests/              # Test files
│   ├── Dockerfile          # Production Dockerfile
│   └── init-db.sql         # Database initialization
├── docker-compose.yml      # Docker Compose configuration
└── README.md              # This file
```

## License

This project is licensed under the ISC License. 