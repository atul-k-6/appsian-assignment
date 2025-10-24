import React from 'react';
import { Project } from '../../types';

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
  onDelete: (id: number) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick, onDelete }) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${project.title}"? This will also delete all tasks in this project.`)) {
      onDelete(project.id);
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

  return (
    <div style={styles.card} onClick={onClick}>
      <div style={styles.content}>
        <h3 style={styles.title}>{project.title}</h3>
        
        {project.description && (
          <p style={styles.description}>
            {project.description.length > 100
              ? `${project.description.substring(0, 100)}...`
              : project.description}
          </p>
        )}

        <div style={styles.metadata}>
          <div style={styles.metaItem}>
            <span style={styles.icon}>📋</span>
            <span style={styles.metaText}>
              {project.taskCount} {project.taskCount === 1 ? 'task' : 'tasks'}
            </span>
          </div>
          <div style={styles.metaItem}>
            <span style={styles.icon}>🗓️</span>
            <span style={styles.metaText}>{formatDate(project.createdAt)}</span>
          </div>
        </div>
      </div>

      <div style={styles.actions}>
        <button
          onClick={handleDelete}
          style={styles.deleteButton}
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
  card: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '1.5rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    border: '1px solid #e9ecef',
  },
  content: {
    flex: 1,
  },
  title: {
    margin: '0 0 0.75rem 0',
    color: '#333',
    fontSize: '1.25rem',
    fontWeight: 'bold',
  },
  description: {
    margin: '0 0 1rem 0',
    color: '#666',
    fontSize: '0.95rem',
    lineHeight: '1.5',
  },
  metadata: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  icon: {
    fontSize: '1rem',
  },
  metaText: {
    fontSize: '0.9rem',
    color: '#999',
  },
  actions: {
    display: 'flex',
    gap: '0.5rem',
    paddingTop: '0.5rem',
    borderTop: '1px solid #e9ecef',
  },
  deleteButton: {
    width: '100%',
    padding: '0.6rem',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.95rem',
    fontWeight: '500',
    transition: 'background-color 0.2s',
  },
};

export default ProjectCard;