using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProjectManager.API.DTOs.Scheduler;
using ProjectManager.API.Services;
using System.Security.Claims;

namespace ProjectManager.API.Controllers
{
    [ApiController]
    [Route("api/v1/projects")]
    [Authorize]
    public class SchedulerController : ControllerBase
    {
        private readonly ISchedulerService _schedulerService;

        public SchedulerController(ISchedulerService schedulerService)
        {
            _schedulerService = schedulerService;
        }

        private int GetUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.Parse(userIdClaim ?? "0");
        }

        /// <summary>
        /// Generate an optimized schedule for project tasks based on dependencies and estimates
        /// </summary>
        /// <param name="projectId">The ID of the project</param>
        /// <param name="request">Schedule request with tasks, estimates, and dependencies</param>
        /// <returns>Recommended task order and detailed schedule</returns>
        [HttpPost("{projectId}/schedule")]
        [ProducesResponseType(typeof(ScheduleResponseDto), 200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(401)]
        [ProducesResponseType(404)]
        public async Task<ActionResult<ScheduleResponseDto>> GenerateSchedule(
            int projectId,
            [FromBody] ScheduleRequestDto request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (request.Tasks == null || !request.Tasks.Any())
            {
                return BadRequest(new { message = "At least one task is required" });
            }

            // Validate task titles are unique
            var duplicateTitles = request.Tasks
                .GroupBy(t => t.Title)
                .Where(g => g.Count() > 1)
                .Select(g => g.Key)
                .ToList();

            if (duplicateTitles.Any())
            {
                return BadRequest(new { message = $"Duplicate task titles found: {string.Join(", ", duplicateTitles)}" });
            }

            // Validate dependencies reference existing tasks
            var taskTitles = request.Tasks.Select(t => t.Title).ToHashSet();
            var invalidDeps = request.Tasks
                .SelectMany(t => t.Dependencies)
                .Where(dep => !taskTitles.Contains(dep))
                .Distinct()
                .ToList();

            if (invalidDeps.Any())
            {
                return BadRequest(new { message = $"Invalid dependencies (tasks not found): {string.Join(", ", invalidDeps)}" });
            }

            try
            {
                var userId = GetUserId();
                var schedule = await _schedulerService.GenerateScheduleAsync(projectId, request, userId);
                return Ok(schedule);
            }
            catch (UnauthorizedAccessException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while generating the schedule", detail = ex.Message });
            }
        }

        /// <summary>
        /// Validate task dependencies for circular references
        /// </summary>
        [HttpPost("validate-dependencies")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        public ActionResult<object> ValidateDependencies([FromBody] ScheduleRequestDto request)
        {
            if (request.Tasks == null || !request.Tasks.Any())
            {
                return BadRequest(new { message = "At least one task is required" });
            }

            var hasCircular = _schedulerService.HasCircularDependency(request.Tasks);

            if (hasCircular)
            {
                return BadRequest(new 
                { 
                    valid = false, 
                    message = "Circular dependency detected in task dependencies" 
                });
            }

            try
            {
                var order = _schedulerService.TopologicalSort(request.Tasks);
                return Ok(new 
                { 
                    valid = true, 
                    message = "Dependencies are valid",
                    recommendedOrder = order
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { valid = false, message = ex.Message });
            }
        }
    }
}