using ProjectManager.API.DTOs.Project;

namespace ProjectManager.API.Services
{
    public interface IProjectService
    {
        Task<IEnumerable<ProjectDto>> GetUserProjectsAsync(int userId);
        Task<ProjectDto?> GetProjectByIdAsync(int projectId, int userId);
        Task<ProjectDto> CreateProjectAsync(CreateProjectDto createDto, int userId);
        Task<bool> DeleteProjectAsync(int projectId, int userId);
    }
}