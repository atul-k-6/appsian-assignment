export interface TaskScheduleInput {
  title: string;
  estimatedHours: number;
  dueDate?: string;
  dependencies: string[];
}

export interface ScheduleRequest {
  tasks: TaskScheduleInput[];
  startDate?: string;
  dailyWorkHours?: number;
}

export interface ScheduledTask {
  title: string;
  estimatedHours: number;
  dueDate?: string;
  dependencies: string[];
  suggestedStartDate: string;
  suggestedEndDate: string;
  order: number;
  hasDependencyConflict: boolean;
  conflictReason?: string;
}

export interface ScheduleResponse {
  recommendedOrder: string[];
  scheduledTasks: ScheduledTask[];
  totalEstimatedDays: number;
  totalEstimatedHours: number;
  projectStartDate: string;
  projectEndDate: string;
  hasConflicts: boolean;
  warnings: string[];
}

export interface DependencyValidationResponse {
  valid: boolean;
  message: string;
  recommendedOrder?: string[];
}