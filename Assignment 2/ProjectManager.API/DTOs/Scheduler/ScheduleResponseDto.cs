namespace ProjectManager.API.DTOs.Scheduler
{
    public class ScheduleResponseDto
    {
        public List<string> RecommendedOrder { get; set; } = new List<string>();
        public List<ScheduledTaskDto> ScheduledTasks { get; set; } = new List<ScheduledTaskDto>();
        public int TotalEstimatedDays { get; set; }
        public double TotalEstimatedHours { get; set; }
        public DateTime ProjectStartDate { get; set; }
        public DateTime ProjectEndDate { get; set; }
        public bool HasConflicts { get; set; }
        public List<string> Warnings { get; set; } = new List<string>();
    }
}