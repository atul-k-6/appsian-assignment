import React from 'react';
import { TaskItem as TaskItemType } from '../types/task.types';

interface TaskItemProps {
  task: TaskItemType;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete }) => {
  return (
    <div className="task-item">
      <div className="task-content">
        <input
          type="checkbox"
          checked={task.isCompleted}
          onChange={() => onToggle(task.id)}
          className="task-checkbox"
        />
        <span className={task.isCompleted ? 'task-description completed' : 'task-description'}>
          {task.description}
        </span>
      </div>
      <button onClick={() => onDelete(task.id)} className="delete-btn">
        Delete
      </button>
    </div>
  );
};

export default TaskItem;