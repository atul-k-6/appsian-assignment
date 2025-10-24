using System.ComponentModel.DataAnnotations;

namespace ProjectManager.API.DTOs.Task
{
    public class CreateTaskDto
    {
        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        public DateTime? DueDate { get; set; }
    }
}