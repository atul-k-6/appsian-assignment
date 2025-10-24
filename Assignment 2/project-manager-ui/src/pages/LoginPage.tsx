import React from 'react';
import { useNavigate } from 'react-router-dom';
import Login from '../components/Auth/Login';
import { isAuthenticated } from '../utils/auth';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated()) {
      navigate('/dashboard');
    }
  }, [navigate]);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.appTitle}>📋 Project Manager</h1>
        <p style={styles.tagline}>Organize your projects and tasks efficiently</p>
      </div>
      <Login />
      <footer style={styles.footer}>
        <p style={styles.footerText}>
          © 2025 Project Manager. Built with React + .NET 8
        </p>
      </footer>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: '2rem',
  },
  header: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  appTitle: {
    fontSize: '2.5rem',
    color: '#333',
    margin: '0 0 0.5rem 0',
    fontWeight: 'bold',
  },
  tagline: {
    fontSize: '1.1rem',
    color: '#666',
    margin: 0,
  },
  footer: {
    marginTop: '3rem',
    textAlign: 'center',
  },
  footerText: {
    fontSize: '0.9rem',
    color: '#999',
    margin: 0,
  },
};

export default LoginPage;