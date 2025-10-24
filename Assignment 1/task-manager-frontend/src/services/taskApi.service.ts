import axios from 'axios';
import { TaskItem, CreateTaskDto, UpdateTaskDto } from '../types/task.types';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const taskApi = {
  getAllTasks: async (): Promise<TaskItem[]> => {
    const response = await api.get<TaskItem[]>('/tasks');
    return response.data;
  },

  createTask: async (task: CreateTaskDto): Promise<TaskItem> => {
    const response = await api.post<TaskItem>('/tasks', task);
    return response.data;
  },

  updateTask: async (id: string, task: UpdateTaskDto): Promise<TaskItem> => {
    const response = await api.put<TaskItem>(`/tasks/${id}`, task);
    return response.data;
  },

  deleteTask: async (id: string): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  },
};
