import React from 'react';
import TaskItem from './TaskItem';
import { TaskItem as TaskItemType } from '../types/task.types';

interface TaskListProps {
  tasks: TaskItemType[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onToggle, onDelete }) => {
  if (tasks.length === 0) {
    return <p className="no-tasks">No tasks yet. Add one above!</p>;
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} onToggle={onToggle} onDelete={onDelete} />
      ))}
    </div>
  );
};

export default TaskList;