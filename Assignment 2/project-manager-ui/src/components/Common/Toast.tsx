import React, { useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  duration?: number;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, duration = 3000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const typeStyles: Record<ToastType, { backgroundColor: string; icon: string; color?: string }> = {
    success: { backgroundColor: '#28a745', icon: '✓' },
    error: { backgroundColor: '#dc3545', icon: '✕' },
    warning: { backgroundColor: '#ffc107', icon: '⚠', color: '#856404' },
    info: { backgroundColor: '#17a2b8', icon: 'ℹ' },
  };

  const currentStyle = typeStyles[type];

  return (
    <div
      style={{
        ...styles.container,
        backgroundColor: currentStyle.backgroundColor,
        color: currentStyle.color || 'white',
      }}
    >
      <span style={styles.icon}>{currentStyle.icon}</span>
      <span style={styles.message}>{message}</span>
      <button onClick={onClose} style={styles.closeButton}>
        ✕
      </button>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    position: 'fixed',
    top: '20px',
    right: '20px',
    padding: '1rem 1.5rem',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    zIndex: 9999,
    maxWidth: '400px',
    animation: 'slideIn 0.3s ease-out',
  },
  icon: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
  },
  message: {
    flex: 1,
    fontSize: '0.95rem',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    color: 'inherit',
    cursor: 'pointer',
    fontSize: '1.2rem',
    padding: '0',
    opacity: 0.8,
  },
};

// Add to index.css
const cssAnimation = `
@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .toast-container {
    right: 10px;
    left: 10px;
    max-width: calc(100% - 20px);
  }
}
`;

export default Toast;