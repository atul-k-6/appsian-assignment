namespace ProjectManager.API.DTOs.Scheduler
{
    public class ScheduledTaskDto
    {
        public string Title { get; set; } = string.Empty;
        public double EstimatedHours { get; set; }
        public DateTime? DueDate { get; set; }
        public List<string> Dependencies { get; set; } = new List<string>();
        public DateTime SuggestedStartDate { get; set; }
        public DateTime SuggestedEndDate { get; set; }
        public int Order { get; set; }
        public bool HasDependencyConflict { get; set; }
        public string? ConflictReason { get; set; }
    }
}