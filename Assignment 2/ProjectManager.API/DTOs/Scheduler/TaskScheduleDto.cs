using System.ComponentModel.DataAnnotations;

namespace ProjectManager.API.DTOs.Scheduler
{
    public class TaskScheduleDto
    {
        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [Required]
        [Range(0.5, 1000)]
        public double EstimatedHours { get; set; }

        public DateTime? DueDate { get; set; }

        public List<string> Dependencies { get; set; } = new List<string>();
    }
}