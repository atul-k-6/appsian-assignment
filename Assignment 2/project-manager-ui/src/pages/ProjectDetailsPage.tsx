import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectService } from '../services/projectService';
import { taskService } from '../services/taskService';
import { Project, Task, CreateTaskRequest, UpdateTaskRequest } from '../types';
import TaskList from '../components/Tasks/TaskList';
import TaskForm from '../components/Tasks/TaskForm';
import SmartScheduler from '../components/Scheduler/SmartScheduler';
import Toast, { ToastType } from '../components/Common/Toast';

const ProjectDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showScheduler, setShowScheduler] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  useEffect(() => {
    if (id) {
      loadProjectAndTasks();
    }
  }, [id]);

  const loadProjectAndTasks = async () => {
    try {
      setLoading(true);
      const projectData = await projectService.getProject(Number(id));
      setProject(projectData);
      setTasks([]);
    } catch (err) {
      console.error('Failed to load project', err);
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData: CreateTaskRequest) => {
    const createdTask = await taskService.createTask(Number(id), taskData);
    setTasks([...tasks, createdTask]);
    setShowForm(false);
    showToast('Task created successfully!', 'success');
  };

  const handleToggleComplete = async (task: Task) => {
    try {
      const updateData: UpdateTaskRequest = {
        isCompleted: !task.isCompleted,
      };
      const updatedTask = await taskService.updateTask(task.id, updateData);
      setTasks(tasks.map((t) => (t.id === task.id ? updatedTask : t)));
      showToast(
        updatedTask.isCompleted ? 'Task completed! 🎉' : 'Task marked as incomplete',
        'success'
      );
    } catch (err) {
      showToast('Failed to update task', 'error');
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      await taskService.deleteTask(taskId);
      setTasks(tasks.filter((t) => t.id !== taskId));
      showToast('Task deleted successfully', 'info');
    } catch (err) {
      showToast('Failed to delete task', 'error');
    }
  };

  const showToast = (message: string, type: ToastType) => {
    setToast({ message, type });
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Loading project...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div style={styles.errorContainer}>
        <h2>Project not found</h2>
        <button onClick={() => navigate('/dashboard')} style={styles.backButton}>
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <header style={styles.header}>
        <div>
          <button onClick={() => navigate('/dashboard')} style={styles.backButton}>
            ← Back to Dashboard
          </button>
          <h1 style={styles.title}>{project.title}</h1>
          {project.description && <p style={styles.description}>{project.description}</p>}
          <p style={styles.meta}>
            Created on {new Date(project.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      </header>

      <div style={styles.content}>
        <div style={styles.taskHeader}>
          <h2 style={styles.taskHeading}>Tasks</h2>
          <div style={styles.buttonGroup}>
            <button
              onClick={() => setShowScheduler(true)}
              style={styles.schedulerButton}
            >
              🤖 Smart Scheduler
            </button>
            <button
              onClick={() => setShowForm(!showForm)}
              style={showForm ? styles.cancelButton : styles.addButton}
            >
              {showForm ? '✕ Cancel' : '+ Add Task'}
            </button>
          </div>
        </div>

        {showForm && (
          <TaskForm
            onSubmit={handleCreateTask}
            onCancel={() => setShowForm(false)}
          />
        )}

        <TaskList
          tasks={tasks}
          onToggleComplete={handleToggleComplete}
          onDeleteTask={handleDeleteTask}
        />
      </div>

      {showScheduler && (
        <SmartScheduler
          projectId={Number(id)}
          onClose={() => setShowScheduler(false)}
        />
      )}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: '2rem',
    backgroundColor: 'white',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  backButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginBottom: '1rem',
    fontSize: '0.95rem',
  },
  title: {
    margin: '0.5rem 0',
    color: '#333',
    fontSize: '2rem',
  },
  description: {
    margin: '0.5rem 0',
    color: '#666',
    fontSize: '1.05rem',
    lineHeight: '1.6',
  },
  meta: {
    margin: '0.5rem 0 0 0',
    color: '#999',
    fontSize: '0.9rem',
  },
  content: {
    padding: '2rem',
    maxWidth: '1000px',
    margin: '0 auto',
  },
  taskHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  taskHeading: {
    margin: 0,
    color: '#333',
    fontSize: '1.5rem',
  },
  buttonGroup: {
    display: 'flex',
    gap: '0.75rem',
    flexWrap: 'wrap',
  },
  schedulerButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#17a2b8',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold',
  },
  addButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold',
  },
  cancelButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #007bff',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  errorContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    gap: '2rem',
  },
};

export default ProjectDetailsPage;