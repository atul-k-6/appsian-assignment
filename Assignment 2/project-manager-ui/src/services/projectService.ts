import api from './api';
import type { Project, CreateProjectRequest } from '../types';

export const projectService = {
  async getProjects(): Promise<Project[]> {
    const response = await api.get<Project[]>('/projects');
    return response.data;
  },

  async getProject(id: number): Promise<Project> {
    const response = await api.get<Project>(`/projects/${id}`);
    return response.data;
  },

  async createProject(data: CreateProjectRequest): Promise<Project> {
    const response = await api.post<Project>('/projects', data);
    return response.data;
  },

  async deleteProject(id: number): Promise<void> {
    await api.delete(`/projects/${id}`);
  },
};