using System.ComponentModel.DataAnnotations;

namespace ProjectManager.API.DTOs.Scheduler
{
    public class ScheduleRequestDto
    {
        [Required]
        public List<TaskScheduleDto> Tasks { get; set; } = new List<TaskScheduleDto>();

        public DateTime? StartDate { get; set; }

        public int? DailyWorkHours { get; set; } = 8;
    }
}