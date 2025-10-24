using System.ComponentModel.DataAnnotations;

namespace ProjectManager.API.DTOs.Project
{
    public class CreateProjectDto
    {
        [Required]
        [StringLength(100, MinimumLength = 3)]
        public string Title { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? Description { get; set; }
    }
}