export interface User {
  email: string;
  fullName: string;
}

export interface AuthResponse {
  token: string;
  email: string;
  fullName: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
}

export interface Project {
  id: number;
  title: string;
  description?: string;
  createdAt: string;
  taskCount: number;
}

export interface CreateProjectRequest {
  title: string;
  description?: string;
}

export interface Task {
  id: number;
  title: string;
  dueDate?: string;
  isCompleted: boolean;
  projectId: number;
  createdAt: string;
}

export interface CreateTaskRequest {
  title: string;
  dueDate?: string;
}

export interface UpdateTaskRequest {
  title?: string;
  dueDate?: string;
  isCompleted?: boolean;
}