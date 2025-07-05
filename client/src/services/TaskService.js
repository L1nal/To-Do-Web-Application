import axios from 'axios';
import { API_ENDPOINTS } from '../constants/taskConstants';

class TaskService {
  constructor(baseURL = API_ENDPOINTS.BASE_URL) {
    this.baseURL = baseURL;
  }

  async getAllTasks() {
    try {
      const response = await axios.get(`${this.baseURL}${API_ENDPOINTS.TASKS}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw new Error('Failed to fetch tasks');
    }
  }

  async createTask(taskData) {
    try {
      const response = await axios.post(`${this.baseURL}${API_ENDPOINTS.TASKS}`, {
        title: taskData.title,
        description: taskData.description,
        status: 'active'
      });
      return response.data;
    } catch (error) {
      console.error('Failed to add task:', error);
      throw new Error('Failed to add task');
    }
  }

  async updateTask(id, taskData) {
    try {
      const response = await axios.put(`${this.baseURL}${API_ENDPOINTS.TASKS}/${id}`, {
        title: taskData.title,
        description: taskData.description
      });
      return response.data;
    } catch (error) {
      console.error('Failed to update task:', error);
      throw new Error('Failed to update task');
    }
  }

  async updateTaskStatus(id, status) {
    try {
      const response = await axios.put(`${this.baseURL}${API_ENDPOINTS.TASK_STATUS(id)}`, { status });
      return response.data;
    } catch (error) {
      console.error('Failed to update task status:', error);
      throw new Error('Failed to update task status');
    }
  }

  async deleteTask(id) {
    try {
      const response = await axios.delete(`${this.baseURL}${API_ENDPOINTS.TASKS}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Failed to delete task:', error);
      throw new Error('Failed to delete task');
    }
  }

  async restoreTask(id) {
    try {
      const response = await axios.put(`${this.baseURL}${API_ENDPOINTS.TASK_RESTORE(id)}`);
      return response.data;
    } catch (error) {
      console.error('Failed to restore task:', error);
      throw new Error('Failed to restore task');
    }
  }

  async permanentDeleteTask(id) {
    try {
      const response = await axios.delete(`${this.baseURL}${API_ENDPOINTS.TASK_PERMANENT_DELETE(id)}`);
      return response.data;
    } catch (error) {
      console.error('Failed to permanently delete task:', error);
      throw new Error('Failed to permanently delete task');
    }
  }
}

export default TaskService; 