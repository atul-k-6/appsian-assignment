using Microsoft.EntityFrameworkCore;
using ProjectManager.API.Data;
using ProjectManager.API.DTOs.Project;
using ProjectManager.API.Models;

namespace ProjectManager.API.Services
{
    public class ProjectService : IProjectService
    {
        private readonly ApplicationDbContext _context;

        public ProjectService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ProjectDto>> GetUserProjectsAsync(int userId)
        {
            return await _context.Projects
                .Where(p => p.UserId == userId)
                .Select(p => new ProjectDto
                {
                    Id = p.Id,
                    Title = p.Title,
                    Description = p.Description,
                    CreatedAt = p.CreatedAt,
                    TaskCount = p.Tasks.Count
                })
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();
        }

        public async Task<ProjectDto?> GetProjectByIdAsync(int projectId, int userId)
        {
            var project = await _context.Projects
                .Where(p => p.Id == projectId && p.UserId == userId)
                .Select(p => new ProjectDto
                {
                    Id = p.Id,
                    Title = p.Title,
                    Description = p.Description,
                    CreatedAt = p.CreatedAt,
                    TaskCount = p.Tasks.Count
                })
                .FirstOrDefaultAsync();

            return project;
        }

        public async Task<ProjectDto> CreateProjectAsync(CreateProjectDto createDto, int userId)
        {
            var project = new Project
            {
                Title = createDto.Title,
                Description = createDto.Description,
                UserId = userId
            };

            _context.Projects.Add(project);
            await _context.SaveChangesAsync();

            return new ProjectDto
            {
                Id = project.Id,
                Title = project.Title,
                Description = project.Description,
                CreatedAt = project.CreatedAt,
                TaskCount = 0
            };
        }

        public async Task<bool> DeleteProjectAsync(int projectId, int userId)
        {
            var project = await _context.Projects
                .FirstOrDefaultAsync(p => p.Id == projectId && p.UserId == userId);

            if (project == null)
            {
                return false;
            }

            _context.Projects.Remove(project);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}