export interface TaskItem {
  id: string;
  description: string;
  isCompleted: boolean;
}

export interface CreateTaskDto {
  description: string;
  isCompleted: boolean;
}

export interface UpdateTaskDto {
  description: string;
  isCompleted: boolean;
}
