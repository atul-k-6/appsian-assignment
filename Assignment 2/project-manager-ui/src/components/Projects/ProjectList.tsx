import React from 'react';
import { Project } from '../../types';
import ProjectCard from './ProjectCard';

interface ProjectListProps {
  projects: Project[];
  onProjectClick: (projectId: number) => void;
  onProjectDelete: (projectId: number) => void;
  loading?: boolean;
}

const ProjectList: React.FC<ProjectListProps> = ({
  projects,
  onProjectClick,
  onProjectDelete,
  loading = false,
}) => {
  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Loading projects...</p>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div style={styles.emptyState}>
        <div style={styles.emptyIcon}>📁</div>
        <h3 style={styles.emptyTitle}>No projects yet</h3>
        <p style={styles.emptyText}>
          Create your first project to get started with organizing your tasks!
        </p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.headerTitle}>
          {projects.length} {projects.length === 1 ? 'Project' : 'Projects'}
        </h2>
      </div>
      <div style={styles.grid}>
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onClick={() => onProjectClick(project.id)}
            onDelete={onProjectDelete}
          />
        ))}
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
  headerTitle: {
    margin: 0,
    color: '#333',
    fontSize: '1.5rem',
    fontWeight: 'bold',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '1.5rem',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4rem 2rem',
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
    padding: '4rem 2rem',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  emptyIcon: {
    fontSize: '4rem',
    marginBottom: '1rem',
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

export default ProjectList;