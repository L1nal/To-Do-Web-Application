# Linal Assessment - Full Stack Todo App.

A full-stack Todo application built with React (frontend), Node.js/Express (backend), and MySQL, fully containerized using Docker and Docker Compose.

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MySQL 8.0
- **Infrastructure:** Docker, Nginx

## Quick Start (Docker)

### Prerequisites
- Docker and Docker Compose installed

### Build & Run

```bash
git clone <repository-url>
cd Linal_Assesment
docker-compose up --build
```

### Wait for Application to Start

Wait until you see this message in the console:
```
Application is now fully operational!
Visit the app on : http://localhost
```

This indicates that all services are running and the application is ready to use.

### Accessing the Application

- **Frontend:** [http://localhost](http://localhost)
- **Backend API:** [http://localhost:5000](http://localhost:5000)

### Stopping the App

```bash
docker-compose down
```

---
