using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProjectManager.API.DTOs.Task;
using ProjectManager.API.Services;
using System.Security.Claims;

namespace ProjectManager.API.Controllers
{
    [ApiController]
    [Route("api")]
    [Authorize]
    public class TasksController : ControllerBase
    {
        private readonly ITaskService _taskService;

        public TasksController(ITaskService taskService)
        {
            _taskService = taskService;
        }

        private int GetUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.Parse(userIdClaim ?? "0");
        }

        [HttpPost("projects/{projectId}/tasks")]
        public async Task<ActionResult<TaskDto>> CreateTask(int projectId, [FromBody] CreateTaskDto createDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = GetUserId();
            var task = await _taskService.CreateTaskAsync(projectId, createDto, userId);

            if (task == null)
            {
                return NotFound(new { message = "Project not found" });
            }

            return CreatedAtAction(nameof(CreateTask), new { projectId, taskId = task.Id }, task);
        }

        [HttpPut("tasks/{taskId}")]
        public async Task<ActionResult<TaskDto>> UpdateTask(int taskId, [FromBody] UpdateTaskDto updateDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = GetUserId();
            var task = await _taskService.UpdateTaskAsync(taskId, updateDto, userId);

            if (task == null)
            {
                return NotFound(new { message = "Task not found" });
            }

            return Ok(task);
        }

        [HttpDelete("tasks/{taskId}")]
        public async Task<ActionResult> DeleteTask(int taskId)
        {
            var userId = GetUserId();
            var result = await _taskService.DeleteTaskAsync(taskId, userId);

            if (!result)
            {
                return NotFound(new { message = "Task not found" });
            }

            return NoContent();
        }
    }
}