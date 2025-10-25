using ProjectManager.API.DTOs.Scheduler;

namespace ProjectManager.API.Services
{
    public interface ISchedulerService
    {
        Task<ScheduleResponseDto> GenerateScheduleAsync(int projectId, ScheduleRequestDto request, int userId);
        List<string> TopologicalSort(List<TaskScheduleDto> tasks);
        bool HasCircularDependency(List<TaskScheduleDto> tasks);
    }
}