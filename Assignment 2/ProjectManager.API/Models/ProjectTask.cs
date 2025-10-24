using System.ComponentModel.DataAnnotations;

namespace ProjectManager.API.Models
{
    public class ProjectTask
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        public DateTime? DueDate { get; set; }

        public bool IsCompleted { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Foreign key
        [Required]
        public int ProjectId { get; set; }

        // Navigation property
        public Project Project { get; set; } = null!;
    }
}