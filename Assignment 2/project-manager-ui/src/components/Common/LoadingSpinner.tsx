import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'medium', message }) => {
  const sizeMap = {
    small: { spinner: 24, fontSize: '0.85rem' },
    medium: { spinner: 40, fontSize: '1rem' },
    large: { spinner: 60, fontSize: '1.2rem' },
  };

  const dimensions = sizeMap[size];

  return (
    <div style={styles.container}>
      <div
        style={{
          ...styles.spinner,
          width: `${dimensions.spinner}px`,
          height: `${dimensions.spinner}px`,
          borderWidth: `${Math.max(2, dimensions.spinner / 12)}px`,
        }}
      />
      {message && (
        <p style={{ ...styles.message, fontSize: dimensions.fontSize }}>{message}</p>
      )}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem',
    padding: '2rem',
  },
  spinner: {
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #007bff',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  message: {
    color: '#666',
    margin: 0,
    textAlign: 'center',
  },
};

// Add CSS animation to index.css
const cssAnimation = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;

export default LoadingSpinner;