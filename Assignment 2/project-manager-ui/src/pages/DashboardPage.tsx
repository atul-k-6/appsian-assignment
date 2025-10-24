import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectService } from '../services/projectService';
import { Project, CreateProjectRequest } from '../types';
import { getUser, logout } from '../utils/auth';
import ProjectList from '../components/Projects/ProjectList';
import CreateProjectForm from '../components/Projects/CreateProjectForm';

const DashboardPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();
  const user = getUser();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await projectService.getProjects();
      setProjects(data);
    } catch (err) {
      console.error('Failed to load projects', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (projectData: CreateProjectRequest) => {
    await projectService.createProject(projectData);
    setShowForm(false);
    loadProjects();
  };

  const handleDeleteProject = async (id: number) => {
    try {
      await projectService.deleteProject(id);
      loadProjects();
    } catch (err) {
      alert('Failed to delete project');
    }
  };

  const handleProjectClick = (projectId: number) => {
    navigate(`/projects/${projectId}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>📋 My Projects</h1>
          <p style={styles.welcome}>Welcome back, {user?.fullName}!</p>
        </div>
        <button onClick={handleLogout} style={styles.logoutButton}>
          🚪 Logout
        </button>
      </header>

      <div style={styles.content}>
        <div style={styles.actionBar}>
          <button
            onClick={() => setShowForm(!showForm)}
            style={showForm ? styles.cancelActionButton : styles.addButton}
          >
            {showForm ? '✕ Cancel' : '+ New Project'}
          </button>
        </div>

        {showForm && (
          <CreateProjectForm
            onSubmit={handleCreateProject}
            onCancel={() => setShowForm(false)}
          />
        )}

        <ProjectList
          projects={projects}
          onProjectClick={handleProjectClick}
          onProjectDelete={handleDeleteProject}
          loading={loading}
        />
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '2rem',
    backgroundColor: 'white',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  title: {
    margin: 0,
    color: '#333',
    fontSize: '2rem',
  },
  welcome: {
    margin: '0.5rem 0 0 0',
    color: '#666',
    fontSize: '1rem',
  },
  logoutButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '500',
  },
  content: {
    padding: '2rem',
    maxWidth: '1400px',
    margin: '0 auto',
  },
  actionBar: {
    marginBottom: '1.5rem',
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
  cancelActionButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold',
  },
};

export default DashboardPage;