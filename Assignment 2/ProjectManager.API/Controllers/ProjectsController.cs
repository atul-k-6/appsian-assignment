using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProjectManager.API.DTOs.Project;
using ProjectManager.API.Services;
using System.Security.Claims;

namespace ProjectManager.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ProjectsController : ControllerBase
    {
        private readonly IProjectService _projectService;

        public ProjectsController(IProjectService projectService)
        {
            _projectService = projectService;
        }

        private int GetUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.Parse(userIdClaim ?? "0");
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProjectDto>>> GetProjects()
        {
            var userId = GetUserId();
            var projects = await _projectService.GetUserProjectsAsync(userId);
            return Ok(projects);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProjectDto>> GetProject(int id)
        {
            var userId = GetUserId();
            var project = await _projectService.GetProjectByIdAsync(id, userId);

            if (project == null)
            {
                return NotFound(new { message = "Project not found" });
            }

            return Ok(project);
        }

        [HttpPost]
        public async Task<ActionResult<ProjectDto>> CreateProject([FromBody] CreateProjectDto createDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = GetUserId();
            var project = await _projectService.CreateProjectAsync(createDto, userId);

            return CreatedAtAction(nameof(GetProject), new { id = project.Id }, project);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteProject(int id)
        {
            var userId = GetUserId();
            var result = await _projectService.DeleteProjectAsync(id, userId);

            if (!result)
            {
                return NotFound(new { message = "Project not found" });
            }

            return NoContent();
        }
    }
}