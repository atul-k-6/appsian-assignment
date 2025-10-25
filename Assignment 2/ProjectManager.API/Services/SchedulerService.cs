using Microsoft.EntityFrameworkCore;
using ProjectManager.API.Data;
using ProjectManager.API.DTOs.Scheduler;

namespace ProjectManager.API.Services
{
    public class SchedulerService : ISchedulerService
    {
        private readonly ApplicationDbContext _context;

        public SchedulerService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<ScheduleResponseDto> GenerateScheduleAsync(
            int projectId, 
            ScheduleRequestDto request, 
            int userId)
        {
            // Verify project ownership
            var project = await _context.Projects
                .FirstOrDefaultAsync(p => p.Id == projectId && p.UserId == userId);

            if (project == null)
            {
                throw new UnauthorizedAccessException("Project not found or access denied");
            }

            // Check for circular dependencies
            if (HasCircularDependency(request.Tasks))
            {
                throw new InvalidOperationException("Circular dependency detected in task dependencies");
            }

            // Perform topological sort to get recommended order
            var recommendedOrder = TopologicalSort(request.Tasks);

            // Calculate schedule with dates
            var startDate = request.StartDate ?? DateTime.UtcNow.Date;
            var dailyHours = request.DailyWorkHours ?? 8;

            var scheduledTasks = new List<ScheduledTaskDto>();
            var taskCompletionDates = new Dictionary<string, DateTime>();
            var currentDate = startDate;
            var warnings = new List<string>();

            foreach (var taskTitle in recommendedOrder)
            {
                var task = request.Tasks.First(t => t.Title == taskTitle);
                
                // Calculate start date based on dependencies
                var dependencyEndDate = startDate;
                var hasConflict = false;
                string? conflictReason = null;

                if (task.Dependencies.Any())
                {
                    foreach (var dep in task.Dependencies)
                    {
                        if (taskCompletionDates.ContainsKey(dep))
                        {
                            if (taskCompletionDates[dep] > dependencyEndDate)
                            {
                                dependencyEndDate = taskCompletionDates[dep];
                            }
                        }
                    }
                }

                var taskStartDate = dependencyEndDate > currentDate ? dependencyEndDate : currentDate;
                
                // Calculate end date based on estimated hours and daily work hours
                var daysNeeded = Math.Ceiling(task.EstimatedHours / dailyHours);
                var taskEndDate = taskStartDate.AddDays(daysNeeded);

                // Check if end date exceeds due date
                if (task.DueDate.HasValue && taskEndDate > task.DueDate.Value)
                {
                    hasConflict = true;
                    conflictReason = $"Estimated completion ({taskEndDate:yyyy-MM-dd}) exceeds due date ({task.DueDate.Value:yyyy-MM-dd})";
                    warnings.Add($"Task '{task.Title}': {conflictReason}");
                }

                // Check if dependencies allow completion before due date
                if (task.DueDate.HasValue && taskStartDate > task.DueDate.Value)
                {
                    hasConflict = true;
                    conflictReason = $"Dependencies prevent starting before due date";
                    warnings.Add($"Task '{task.Title}': Cannot start until {taskStartDate:yyyy-MM-dd} but due by {task.DueDate.Value:yyyy-MM-dd}");
                }

                taskCompletionDates[task.Title] = taskEndDate;

                scheduledTasks.Add(new ScheduledTaskDto
                {
                    Title = task.Title,
                    EstimatedHours = task.EstimatedHours,
                    DueDate = task.DueDate,
                    Dependencies = task.Dependencies,
                    SuggestedStartDate = taskStartDate,
                    SuggestedEndDate = taskEndDate,
                    Order = recommendedOrder.IndexOf(taskTitle) + 1,
                    HasDependencyConflict = hasConflict,
                    ConflictReason = conflictReason
                });

                currentDate = taskEndDate;
            }

            var totalHours = request.Tasks.Sum(t => t.EstimatedHours);
            var projectEndDate = taskCompletionDates.Values.Max();

            return new ScheduleResponseDto
            {
                RecommendedOrder = recommendedOrder,
                ScheduledTasks = scheduledTasks,
                TotalEstimatedHours = totalHours,
                TotalEstimatedDays = (int)Math.Ceiling((projectEndDate - startDate).TotalDays),
                ProjectStartDate = startDate,
                ProjectEndDate = projectEndDate,
                HasConflicts = warnings.Any(),
                Warnings = warnings
            };
        }

        public List<string> TopologicalSort(List<TaskScheduleDto> tasks)
        {
            var sorted = new List<string>();
            var visited = new HashSet<string>();
            var visiting = new HashSet<string>();

            void Visit(string taskTitle)
            {
                if (visited.Contains(taskTitle))
                    return;

                if (visiting.Contains(taskTitle))
                    throw new InvalidOperationException($"Circular dependency detected involving task: {taskTitle}");

                visiting.Add(taskTitle);

                var task = tasks.FirstOrDefault(t => t.Title == taskTitle);
                if (task != null)
                {
                    foreach (var dep in task.Dependencies)
                    {
                        Visit(dep);
                    }
                }

                visiting.Remove(taskTitle);
                visited.Add(taskTitle);
                sorted.Add(taskTitle);
            }

            foreach (var task in tasks)
            {
                if (!visited.Contains(task.Title))
                {
                    Visit(task.Title);
                }
            }

            return sorted;
        }

        public bool HasCircularDependency(List<TaskScheduleDto> tasks)
        {
            try
            {
                TopologicalSort(tasks);
                return false;
            }
            catch (InvalidOperationException)
            {
                return true;
            }
        }
    }
}