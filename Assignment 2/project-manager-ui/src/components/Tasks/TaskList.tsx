import React from 'react';
import { Task } from '../../types';
import TaskItem from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (task: Task) => void;
  onDeleteTask: (taskId: number) => void;
  loading?: boolean;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onToggleComplete,
  onDeleteTask,
  loading = false,
}) => {
  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Loading tasks...</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div style={styles.emptyState}>
        <div style={styles.emptyIcon}>✓</div>
        <h3 style={styles.emptyTitle}>No tasks yet</h3>
        <p style={styles.emptyText}>
          Add your first task to start tracking your work!
        </p>
      </div>
    );
  }

  // Separate completed and incomplete tasks
  const incompleteTasks = tasks.filter((task) => !task.isCompleted);
  const completedTasks = tasks.filter((task) => task.isCompleted);

  // Sort incomplete tasks by due date (soonest first)
  const sortedIncompleteTasks = [...incompleteTasks].sort((a, b) => {
    if (!a.dueDate && !b.dueDate) return 0;
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  const taskStats = {
    total: tasks.length,
    completed: completedTasks.length,
    incomplete: incompleteTasks.length,
    completionRate:
      tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0,
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.statsBar}>
          <div style={styles.stat}>
            <span style={styles.statLabel}>Total:</span>
            <span style={styles.statValue}>{taskStats.total}</span>
          </div>
          <div style={styles.stat}>
            <span style={styles.statLabel}>Active:</span>
            <span style={styles.statValue}>{taskStats.incomplete}</span>
          </div>
          <div style={styles.stat}>
            <span style={styles.statLabel}>Completed:</span>
            <span style={styles.statValue}>{taskStats.completed}</span>
          </div>
          <div style={styles.stat}>
            <span style={styles.statLabel}>Progress:</span>
            <span style={styles.statValue}>{taskStats.completionRate}%</span>
          </div>
        </div>

        {taskStats.completionRate > 0 && (
          <div style={styles.progressBarContainer}>
            <div
              style={{
                ...styles.progressBar,
                width: `${taskStats.completionRate}%`,
              }}
            ></div>
          </div>
        )}
      </div>

      <div style={styles.taskContainer}>
        {sortedIncompleteTasks.length > 0 && (
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>
              Active Tasks ({sortedIncompleteTasks.length})
            </h3>
            <div style={styles.taskList}>
              {sortedIncompleteTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggleComplete={onToggleComplete}
                  onDelete={onDeleteTask}
                />
              ))}
            </div>
          </div>
        )}

        {completedTasks.length > 0 && (
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>
              Completed Tasks ({completedTasks.length})
            </h3>
            <div style={styles.taskList}>
              {completedTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggleComplete={onToggleComplete}
                  onDelete={onDeleteTask}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    width: '100%',
  },
  header: {
    marginBottom: '1.5rem',
  },
  statsBar: {
    display: 'flex',
    gap: '2rem',
    padding: '1rem',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    flexWrap: 'wrap',
  },
  stat: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  statLabel: {
    color: '#666',
    fontSize: '0.95rem',
    fontWeight: '500',
  },
  statValue: {
    color: '#007bff',
    fontSize: '1.1rem',
    fontWeight: 'bold',
  },
  progressBarContainer: {
    width: '100%',
    height: '8px',
    backgroundColor: '#e9ecef',
    borderRadius: '4px',
    marginTop: '1rem',
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#28a745',
    transition: 'width 0.3s ease',
  },
  taskContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  sectionTitle: {
    margin: 0,
    color: '#333',
    fontSize: '1.15rem',
    fontWeight: 'bold',
  },
  taskList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '3rem 2rem',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #007bff',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    marginTop: '1rem',
    color: '#666',
    fontSize: '1rem',
  },
  emptyState: {
    textAlign: 'center',
    padding: '3rem 2rem',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  emptyIcon: {
    fontSize: '4rem',
    marginBottom: '1rem',
    color: '#28a745',
  },
  emptyTitle: {
    margin: '0 0 0.5rem 0',
    color: '#333',
    fontSize: '1.5rem',
  },
  emptyText: {
    margin: 0,
    color: '#666',
    fontSize: '1rem',
  },
};

export default TaskList;