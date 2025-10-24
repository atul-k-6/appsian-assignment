using System;
using System.Collections.Generic;
using System.Linq;
using TaskManagerApi.Models;

namespace TaskManagerApi.Repositories
{
    public class InMemoryTaskRepository : ITaskRepository
    {
        private readonly List<TaskItem> _tasks = new();
        private readonly object _lock = new();

        public InMemoryTaskRepository()
        {
            // Seed with sample data
            _tasks.Add(new TaskItem
            {
                Id = Guid.NewGuid(),
                Description = "Complete the assignment",
                IsCompleted = false
            });
            _tasks.Add(new TaskItem
            {
                Id = Guid.NewGuid(),
                Description = "Review the code",
                IsCompleted = true
            });
        }

        public IEnumerable<TaskItem> GetAll()
        {
            lock (_lock)
            {
                return _tasks.ToList();
            }
        }

        public TaskItem? GetById(Guid id)
        {
            lock (_lock)
            {
                return _tasks.FirstOrDefault(t => t.Id == id);
            }
        }

        public TaskItem Create(TaskItem task)
        {
            lock (_lock)
            {
                task.Id = Guid.NewGuid();
                _tasks.Add(task);
                return task;
            }
        }

        public TaskItem? Update(Guid id, TaskItem task)
        {
            lock (_lock)
            {
                var existingTask = _tasks.FirstOrDefault(t => t.Id == id);
                if (existingTask == null)
                    return null;

                existingTask.Description = task.Description;
                existingTask.IsCompleted = task.IsCompleted;
                return existingTask;
            }
        }

        public bool Delete(Guid id)
        {
            lock (_lock)
            {
                var task = _tasks.FirstOrDefault(t => t.Id == id);
                if (task == null)
                    return false;

                _tasks.Remove(task);
                return true;
            }
        }
    }
}
