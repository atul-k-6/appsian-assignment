using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using TaskManagerApi.Models;
using TaskManagerApi.Repositories;

namespace TaskManagerApi.Controllers
{
    [ApiController]
    [Route("api/tasks")]
    public class TasksController : ControllerBase
    {
        private readonly ITaskRepository _repository;

        public TasksController(ITaskRepository repository)
        {
            _repository = repository;
        }

        // GET: api/tasks
        [HttpGet]
        public ActionResult<IEnumerable<TaskItem>> GetAllTasks()
        {
            var tasks = _repository.GetAll();
            return Ok(tasks);
        }

        // GET: api/tasks/{id}
        [HttpGet("{id}")]
        public ActionResult<TaskItem> GetTask(Guid id)
        {
            var task = _repository.GetById(id);
            if (task == null)
                return NotFound();

            return Ok(task);
        }

        // POST: api/tasks
        [HttpPost]
        public ActionResult<TaskItem> CreateTask([FromBody] TaskItem task)
        {
            if (string.IsNullOrWhiteSpace(task.Description))
                return BadRequest("Description is required");

            var createdTask = _repository.Create(task);
            return CreatedAtAction(nameof(GetTask), new { id = createdTask.Id }, createdTask);
        }

        // PUT: api/tasks/{id}
        [HttpPut("{id}")]
        public ActionResult<TaskItem> UpdateTask(Guid id, [FromBody] TaskItem task)
        {
            if (string.IsNullOrWhiteSpace(task.Description))
                return BadRequest("Description is required");

            var updatedTask = _repository.Update(id, task);
            if (updatedTask == null)
                return NotFound();

            return Ok(updatedTask);
        }

        // DELETE: api/tasks/{id}
        [HttpDelete("{id}")]
        public ActionResult DeleteTask(Guid id)
        {
            var result = _repository.Delete(id);
            if (!result)
                return NotFound();

            return NoContent();
        }
    }
}
