using System;
using System.Collections.Generic;
using TaskManagerApi.Models;

namespace TaskManagerApi.Repositories
{
    public interface ITaskRepository
    {
        IEnumerable<TaskItem> GetAll();
        TaskItem? GetById(Guid id);
        TaskItem Create(TaskItem task);
        TaskItem? Update(Guid id, TaskItem task);
        bool Delete(Guid id);
    }
}
