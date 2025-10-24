import React, { useState } from 'react';
import { CreateProjectRequest } from '../../types';

interface CreateProjectFormProps {
  onSubmit: (project: CreateProjectRequest) => Promise<void>;
  onCancel: () => void;
}

const CreateProjectForm: React.FC<CreateProjectFormProps> = ({ onSubmit, onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (title.length < 3 || title.length > 100) {
      setError('Title must be between 3 and 100 characters');
      return;
    }

    if (description.length > 500) {
      setError('Description must not exceed 500 characters');
      return;
    }

    setLoading(true);

    try {
      const projectData: CreateProjectRequest = {
        title,
        description: description || undefined,
      };
      await onSubmit(projectData);
      setTitle('');
      setDescription('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.heading}>Create New Project</h3>
      {error && <div style={styles.error}>{error}</div>}
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>
            Title <span style={styles.required}>*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            minLength={3}
            maxLength={100}
            style={styles.input}
            placeholder="Enter project title (3-100 characters)"
          />
          <small style={styles.hint}>{title.length}/100 characters</small>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={500}
            style={styles.textarea}
            placeholder="Enter project description (optional, max 500 characters)"
            rows={4}
          />
          <small style={styles.hint}>{description.length}/500 characters</small>
        </div>

        <div style={styles.buttonGroup}>
          <button type="submit" disabled={loading} style={styles.submitButton}>
            {loading ? 'Creating...' : 'Create Project'}
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
    marginBottom: '2rem',
  },
  heading: {
    margin: '0 0 1.5rem 0',
    color: '#333',
    fontSize: '1.25rem',
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
  textarea: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
    fontFamily: 'inherit',
    resize: 'vertical',
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
    backgroundColor: '#28a745',
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

export default CreateProjectForm;