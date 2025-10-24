import React from 'react';
import { Task } from '../../types';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (task: Task) => void;
  onDelete: (taskId: number) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggleComplete, onDelete }) => {
  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${task.title}"?`)) {
      onDelete(task.id);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const isOverdue = () => {
    if (!task.dueDate || task.isCompleted) return false;
    return new Date(task.dueDate) < new Date();
  };

  return (
    <div
      style={{
        ...styles.container,
        ...(task.isCompleted ? styles.containerCompleted : {}),
      }}
    >
      <div style={styles.mainContent}>
        <input
          type="checkbox"
          checked={task.isCompleted}
          onChange={() => onToggleComplete(task)}
          style={styles.checkbox}
          aria-label={`Mark ${task.title} as ${task.isCompleted ? 'incomplete' : 'complete'}`}
        />

        <div style={styles.taskContent}>
          <h4
            style={{
              ...styles.title,
              ...(task.isCompleted ? styles.titleCompleted : {}),
            }}
          >
            {task.title}
          </h4>

          <div style={styles.metadata}>
            {task.dueDate && (
              <div
                style={{
                  ...styles.dueDate,
                  ...(isOverdue() ? styles.dueDateOverdue : {}),
                }}
              >
                <span style={styles.dueDateIcon}>📅</span>
                <span>Due: {formatDate(task.dueDate)}</span>
                {isOverdue() && <span style={styles.overdueLabel}>OVERDUE</span>}
              </div>
            )}
            <div style={styles.createdDate}>
              <span style={styles.icon}>🕐</span>
              <span>Created: {formatDate(task.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>

      <div style={styles.actions}>
        <button
          onClick={handleDelete}
          style={styles.deleteButton}
          aria-label={`Delete ${task.title}`}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#c82333';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#dc3545';
          }}
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '1rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '1rem',
    border: '1px solid #e9ecef',
    transition: 'all 0.2s',
  },
  containerCompleted: {
    opacity: 0.7,
    backgroundColor: '#f8f9fa',
  },
  mainContent: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1rem',
    flex: 1,
  },
  checkbox: {
    width: '20px',
    height: '20px',
    cursor: 'pointer',
    marginTop: '0.25rem',
    flexShrink: 0,
  },
  taskContent: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    margin: '0 0 0.5rem 0',
    color: '#333',
    fontSize: '1.05rem',
    fontWeight: '500',
    wordBreak: 'break-word',
  },
  titleCompleted: {
    textDecoration: 'line-through',
    color: '#999',
  },
  metadata: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  dueDate: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.9rem',
    color: '#666',
  },
  dueDateOverdue: {
    color: '#dc3545',
    fontWeight: 'bold',
  },
  dueDateIcon: {
    fontSize: '0.9rem',
  },
  overdueLabel: {
    backgroundColor: '#dc3545',
    color: 'white',
    padding: '0.15rem 0.5rem',
    borderRadius: '3px',
    fontSize: '0.75rem',
    fontWeight: 'bold',
  },
  createdDate: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.85rem',
    color: '#999',
  },
  icon: {
    fontSize: '0.85rem',
  },
  actions: {
    display: 'flex',
    gap: '0.5rem',
    flexShrink: 0,
  },
  deleteButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '500',
    transition: 'background-color 0.2s',
    whiteSpace: 'nowrap',
  },
};

export default TaskItem;