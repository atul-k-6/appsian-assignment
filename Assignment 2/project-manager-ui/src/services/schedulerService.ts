import api from './api';
import { ScheduleRequest, ScheduleResponse, DependencyValidationResponse } from '../types/scheduler';

export const schedulerService = {
  async generateSchedule(projectId: number, request: ScheduleRequest): Promise<ScheduleResponse> {
    const response = await api.post<ScheduleResponse>(
      `/v1/projects/${projectId}/schedule`,
      request
    );
    return response.data;
  },

  async validateDependencies(request: ScheduleRequest): Promise<DependencyValidationResponse> {
    const response = await api.post<DependencyValidationResponse>(
      '/v1/projects/validate-dependencies',
      request
    );
    return response.data;
  },
};