import React, { useState } from 'react';
import { CreateTaskRequest } from '../../types';

interface TaskFormProps {
  onSubmit: (task: CreateTaskRequest) => Promise<void>;
  onCancel: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ onSubmit, onCancel }) => {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (title.trim().length === 0) {
      setError('Task title is required');
      return;
    }

    if (title.length > 200) {
      setError('Task title must not exceed 200 characters');
      return;
    }

    setLoading(true);

    try {
      const taskData: CreateTaskRequest = {
        title: title.trim(),
        dueDate: dueDate || undefined,
      };
      await onSubmit(taskData);
      setTitle('');
      setDueDate('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.heading}>Add New Task</h3>
      {error && <div style={styles.error}>{error}</div>}
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>
            Task Title <span style={styles.required}>*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            maxLength={200}
            style={styles.input}
            placeholder="What needs to be done?"
          />
          <small style={styles.hint}>{title.length}/200 characters</small>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Due Date (Optional)</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            style={styles.input}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        <div style={styles.buttonGroup}>
          <button type="submit" disabled={loading} style={styles.submitButton}>
            {loading ? 'Adding...' : 'Add Task'}
          </button>
          <button type="button" onClick={onCancel} style={styles.cancelButton}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    marginBottom: '1.5rem',
  },
  heading: {
    margin: '0 0 1.5rem 0',
    color: '#333',
    fontSize: '1.15rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  label: {
    fontWeight: 'bold',
    color: '#555',
    fontSize: '0.95rem',
  },
  required: {
    color: '#dc3545',
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
    fontFamily: 'inherit',
  },
  hint: {
    fontSize: '0.85rem',
    color: '#999',
  },
  buttonGroup: {
    display: 'flex',
    gap: '1rem',
    marginTop: '0.5rem',
  },
  submitButton: {
    flex: 1,
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
    flex: 1,
    padding: '0.75rem 1.5rem',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  error: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '0.75rem',
    borderRadius: '4px',
    marginBottom: '1rem',
    border: '1px solid #f5c6cb',
  },
};

export default TaskForm;