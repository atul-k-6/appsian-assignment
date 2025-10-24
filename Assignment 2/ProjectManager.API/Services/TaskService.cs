using Microsoft.EntityFrameworkCore;
using ProjectManager.API.Data;
using ProjectManager.API.DTOs.Task;
using ProjectManager.API.Models;

namespace ProjectManager.API.Services
{
    public class TaskService : ITaskService
    {
        private readonly ApplicationDbContext _context;

        public TaskService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<TaskDto>> GetProjectTasksAsync(int projectId, int userId)
        {
            // Verify project belongs to user
            var projectExists = await _context.Projects
                .AnyAsync(p => p.Id == projectId && p.UserId == userId);

            if (!projectExists)
            {
                return Enumerable.Empty<TaskDto>();
            }

            return await _context.Tasks
                .Where(t => t.ProjectId == projectId)
                .Select(t => new TaskDto
                {
                    Id = t.Id,
                    Title = t.Title,
                    DueDate = t.DueDate,
                    IsCompleted = t.IsCompleted,
                    ProjectId = t.ProjectId,
                    CreatedAt = t.CreatedAt
                })
                .OrderBy(t => t.IsCompleted)
                .ThenBy(t => t.DueDate)
                .ToListAsync();
        }

        public async Task<TaskDto?> CreateTaskAsync(int projectId, CreateTaskDto createDto, int userId)
        {
            // Verify project belongs to user
            var project = await _context.Projects
                .FirstOrDefaultAsync(p => p.Id == projectId && p.UserId == userId);

            if (project == null)
            {
                return null;
            }

            var task = new ProjectTask
            {
                Title = createDto.Title,
                DueDate = createDto.DueDate,
                ProjectId = projectId
            };

            _context.Tasks.Add(task);
            await _context.SaveChangesAsync();

            return new TaskDto
            {
                Id = task.Id,
                Title = task.Title,
                DueDate = task.DueDate,
                IsCompleted = task.IsCompleted,
                ProjectId = task.ProjectId,
                CreatedAt = task.CreatedAt
            };
        }

        public async Task<TaskDto?> UpdateTaskAsync(int taskId, UpdateTaskDto updateDto, int userId)
        {
            var task = await _context.Tasks
                .Include(t => t.Project)
                .FirstOrDefaultAsync(t => t.Id == taskId && t.Project.UserId == userId);

            if (task == null)
            {
                return null;
            }

            if (!string.IsNullOrEmpty(updateDto.Title))
            {
                task.Title = updateDto.Title;
            }

            if (updateDto.DueDate.HasValue)
            {
                task.DueDate = updateDto.DueDate.Value;
            }

            if (updateDto.IsCompleted.HasValue)
            {
                task.IsCompleted = updateDto.IsCompleted.Value;
            }

            await _context.SaveChangesAsync();

            return new TaskDto
            {
                Id = task.Id,
                Title = task.Title,
                DueDate = task.DueDate,
                IsCompleted = task.IsCompleted,
                ProjectId = task.ProjectId,
                CreatedAt = task.CreatedAt
            };
        }

        public async Task<bool> DeleteTaskAsync(int taskId, int userId)
        {
            var task = await _context.Tasks
                .Include(t => t.Project)
                .FirstOrDefaultAsync(t => t.Id == taskId && t.Project.UserId == userId);

            if (task == null)
            {
                return false;
            }

            _context.Tasks.Remove(task);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}