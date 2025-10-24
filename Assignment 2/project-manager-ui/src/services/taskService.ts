import api from './api';
import type { Task, CreateTaskRequest, UpdateTaskRequest } from '../types';

export const taskService = {
  async createTask(projectId: number, data: CreateTaskRequest): Promise<Task> {
    const response = await api.post<Task>(`/projects/${projectId}/tasks`, data);
    return response.data;
  },

  async updateTask(taskId: number, data: UpdateTaskRequest): Promise<Task> {
    const response = await api.put<Task>(`/tasks/${taskId}`, data);
    return response.data;
  },

  async deleteTask(taskId: number): Promise<void> {
    await api.delete(`/tasks/${taskId}`);
  },
};