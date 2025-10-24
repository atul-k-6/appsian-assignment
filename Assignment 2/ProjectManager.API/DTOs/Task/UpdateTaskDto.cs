using System.ComponentModel.DataAnnotations;

namespace ProjectManager.API.DTOs.Task
{
    public class UpdateTaskDto
    {
        [MaxLength(200)]
        public string? Title { get; set; }

        public DateTime? DueDate { get; set; }

        public bool? IsCompleted { get; set; }
    }
}