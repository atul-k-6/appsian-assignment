import React, { useState } from 'react';
import { TaskScheduleInput, ScheduleResponse } from '../../types/scheduler';
import { schedulerService } from '../../services/schedulerService';

interface SmartSchedulerProps {
  projectId: number;
  onClose: () => void;
}

const SmartScheduler: React.FC<SmartSchedulerProps> = ({ projectId, onClose }) => {
  const [tasks, setTasks] = useState<TaskScheduleInput[]>([
    { title: '', estimatedHours: 0, dependencies: [], dueDate: undefined },
  ]);
  const [startDate, setStartDate] = useState('');
  const [dailyWorkHours, setDailyWorkHours] = useState(8);
  const [schedule, setSchedule] = useState<ScheduleResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const addTask = () => {
    setTasks([...tasks, { title: '', estimatedHours: 0, dependencies: [], dueDate: undefined }]);
  };

  const removeTask = (index: number) => {
    const newTasks = tasks.filter((_, i) => i !== index);
    setTasks(newTasks);
  };

  const updateTask = (index: number, field: keyof TaskScheduleInput, value: any) => {
    const newTasks = [...tasks];
    if (field === 'dependencies') {
      newTasks[index][field] = value;
    } else {
      (newTasks[index] as any)[field] = value;
    }
    setTasks(newTasks);
  };

  const handleGenerateSchedule = async () => {
    setError('');
    setSchedule(null);

    // Validation
    const emptyTitles = tasks.filter(t => !t.title.trim());
    if (emptyTitles.length > 0) {
      setError('All tasks must have a title');
      return;
    }

    const invalidHours = tasks.filter(t => t.estimatedHours <= 0);
    if (invalidHours.length > 0) {
      setError('All tasks must have estimated hours greater than 0');
      return;
    }

    setLoading(true);

    try {
      const request = {
        tasks: tasks.map(t => ({
          ...t,
          dueDate: t.dueDate || undefined,
        })),
        startDate: startDate || undefined,
        dailyWorkHours,
      };

      const result = await schedulerService.generateSchedule(projectId, request);
      setSchedule(result);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to generate schedule');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2 style={styles.title}>🤖 Smart Task Scheduler</h2>
          <button onClick={onClose} style={styles.closeButton}>✕</button>
        </div>

        {!schedule ? (
          <div style={styles.content}>
            <div style={styles.configSection}>
              <h3 style={styles.sectionTitle}>Schedule Configuration</h3>
              <div style={styles.configGrid}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    style={styles.input}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Daily Work Hours</label>
                  <input
                    type="number"
                    value={dailyWorkHours}
                    onChange={(e) => setDailyWorkHours(Number(e.target.value))}
                    style={styles.input}
                    min={1}
                    max={24}
                  />
                </div>
              </div>
            </div>

            <div style={styles.tasksSection}>
              <div style={styles.taskHeader}>
                <h3 style={styles.sectionTitle}>Tasks</h3>
                <button onClick={addTask} style={styles.addButton}>+ Add Task</button>
              </div>

              {error && <div style={styles.error}>{error}</div>}

              <div style={styles.taskList}>
                {tasks.map((task, index) => (
                  <div key={index} style={styles.taskCard}>
                    <div style={styles.taskNumber}>{index + 1}</div>
                    <div style={styles.taskFields}>
                      <input
                        type="text"
                        placeholder="Task title"
                        value={task.title}
                        onChange={(e) => updateTask(index, 'title', e.target.value)}
                        style={styles.input}
                      />
                      <div style={styles.row}>
                        <input
                          type="number"
                          placeholder="Hours"
                          value={task.estimatedHours || ''}
                          onChange={(e) => updateTask(index, 'estimatedHours', Number(e.target.value))}
                          style={{ ...styles.input, flex: 1 }}
                          min={0.5}
                          step={0.5}
                        />
                        <input
                          type="date"
                          placeholder="Due date (optional)"
                          value={task.dueDate || ''}
                          onChange={(e) => updateTask(index, 'dueDate', e.target.value)}
                          style={{ ...styles.input, flex: 1 }}
                        />
                      </div>
                      <div style={styles.dependencySection}>
                        <label style={styles.smallLabel}>Dependencies (comma-separated)</label>
                        <input
                          type="text"
                          placeholder="e.g., Task 1, Task 2"
                          value={task.dependencies.join(', ')}
                          onChange={(e) => {
                            const deps = e.target.value
                              .split(',')
                              .map(d => d.trim())
                              .filter(d => d);
                            updateTask(index, 'dependencies', deps);
                          }}
                          style={styles.input}
                        />
                      </div>
                    </div>
                    {tasks.length > 1 && (
                      <button
                        onClick={() => removeTask(index)}
                        style={styles.removeButton}
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div style={styles.actions}>
              <button onClick={onClose} style={styles.cancelButton}>Cancel</button>
              <button
                onClick={handleGenerateSchedule}
                disabled={loading}
                style={styles.generateButton}
              >
                {loading ? '⏳ Generating...' : '🚀 Generate Schedule'}
              </button>
            </div>
          </div>
        ) : (
          <div style={styles.content}>
            <div style={styles.resultSection}>
              <h3 style={styles.sectionTitle}>📊 Schedule Results</h3>
              
              <div style={styles.statsGrid}>
                <div style={styles.statCard}>
                  <div style={styles.statLabel}>Total Hours</div>
                  <div style={styles.statValue}>{schedule.totalEstimatedHours}h</div>
                </div>
                <div style={styles.statCard}>
                  <div style={styles.statLabel}>Total Days</div>
                  <div style={styles.statValue}>{schedule.totalEstimatedDays}</div>
                </div>
                <div style={styles.statCard}>
                  <div style={styles.statLabel}>Start Date</div>
                  <div style={styles.statValue}>{formatDate(schedule.projectStartDate)}</div>
                </div>
                <div style={styles.statCard}>
                  <div style={styles.statLabel}>End Date</div>
                  <div style={styles.statValue}>{formatDate(schedule.projectEndDate)}</div>
                </div>
              </div>

              {schedule.hasConflicts && (
                <div style={styles.warningBox}>
                  <h4 style={styles.warningTitle}>⚠️ Warnings</h4>
                  {schedule.warnings.map((warning, i) => (
                    <div key={i} style={styles.warningItem}>• {warning}</div>
                  ))}
                </div>
              )}

              <div style={styles.orderSection}>
                <h4 style={styles.subsectionTitle}>✅ Recommended Order</h4>
                <div style={styles.orderList}>
                  {schedule.recommendedOrder.map((task, i) => (
                    <div key={i} style={styles.orderItem}>
                      <span style={styles.orderNumber}>{i + 1}</span>
                      <span>{task}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={styles.scheduleSection}>
                <h4 style={styles.subsectionTitle}>📅 Detailed Schedule</h4>
                {schedule.scheduledTasks.map((task, i) => (
                  <div
                    key={i}
                    style={{
                      ...styles.scheduleCard,
                      ...(task.hasDependencyConflict ? styles.scheduleCardWarning : {}),
                    }}
                  >
                    <div style={styles.scheduleHeader}>
                      <span style={styles.scheduleTitle}>
                        {task.order}. {task.title}
                      </span>
                      <span style={styles.scheduleHours}>{task.estimatedHours}h</span>
                    </div>
                    <div style={styles.scheduleDetails}>
                      <div>📅 {formatDate(task.suggestedStartDate)} → {formatDate(task.suggestedEndDate)}</div>
                      {task.dependencies.length > 0 && (
                        <div style={styles.deps}>
                          🔗 Depends on: {task.dependencies.join(', ')}
                        </div>
                      )}
                      {task.hasDependencyConflict && (
                        <div style={styles.conflict}>⚠️ {task.conflictReason}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={styles.actions}>
              <button
                onClick={() => setSchedule(null)}
                style={styles.backButton}
              >
                ← Edit Tasks
              </button>
              <button onClick={onClose} style={styles.doneButton}>
                ✓ Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '1rem',
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: '12px',
    maxWidth: '900px',
    width: '100%',
    maxHeight: '90vh',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.5rem',
    borderBottom: '1px solid #e9ecef',
  },
  title: {
    margin: 0,
    fontSize: '1.5rem',
    color: '#333',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    color: '#999',
    padding: '0.25rem',
  },
  content: {
    padding: '1.5rem',
    overflowY: 'auto',
    flex: 1,
  },
  configSection: {
    marginBottom: '1.5rem',
  },
  sectionTitle: {
    margin: '0 0 1rem 0',
    fontSize: '1.2rem',
    color: '#333',
  },
  configGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
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
    fontSize: '0.9rem',
  },
  smallLabel: {
    fontSize: '0.85rem',
    color: '#666',
    fontWeight: '500',
  },
  input: {
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '0.95rem',
  },
  tasksSection: {
    marginBottom: '1.5rem',
  },
  taskHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  addButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '500',
  },
  taskList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  taskCard: {
    display: 'flex',
    gap: '1rem',
    padding: '1rem',
    border: '1px solid #e9ecef',
    borderRadius: '8px',
    backgroundColor: '#f8f9fa',
  },
  taskNumber: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: '#007bff',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    flexShrink: 0,
  },
  taskFields: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  row: {
    display: 'flex',
    gap: '0.75rem',
  },
  dependencySection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  removeButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1.2rem',
    color: '#dc3545',
    padding: '0.5rem',
    flexShrink: 0,
  },
  error: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '0.75rem',
    borderRadius: '4px',
    marginBottom: '1rem',
  },
  actions: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'flex-end',
    paddingTop: '1rem',
    borderTop: '1px solid #e9ecef',
  },
  cancelButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  generateButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold',
  },
  resultSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '1rem',
  },
  statCard: {
    padding: '1rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    textAlign: 'center',
  },
  statLabel: {
    fontSize: '0.85rem',
    color: '#666',
    marginBottom: '0.5rem',
  },
  statValue: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#007bff',
  },
  warningBox: {
    backgroundColor: '#fff3cd',
    border: '1px solid #ffc107',
    borderRadius: '8px',
    padding: '1rem',
  },
  warningTitle: {
    margin: '0 0 0.5rem 0',
    color: '#856404',
  },
  warningItem: {
    color: '#856404',
    fontSize: '0.9rem',
    marginBottom: '0.25rem',
  },
  orderSection: {
    backgroundColor: '#f8f9fa',
    padding: '1rem',
    borderRadius: '8px',
  },
  subsectionTitle: {
    margin: '0 0 0.75rem 0',
    fontSize: '1.1rem',
    color: '#333',
  },
  orderList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  orderItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.5rem',
    backgroundColor: 'white',
    borderRadius: '4px',
  },
  orderNumber: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    backgroundColor: '#28a745',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.85rem',
    fontWeight: 'bold',
  },
  scheduleSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  scheduleCard: {
    padding: '1rem',
    border: '1px solid #e9ecef',
    borderRadius: '8px',
    backgroundColor: 'white',
  },
  scheduleCardWarning: {
    borderColor: '#ffc107',
    backgroundColor: '#fffbf0',
  },
  scheduleHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.5rem',
  },
  scheduleTitle: {
    fontWeight: 'bold',
    color: '#333',
    fontSize: '1rem',
  },
  scheduleHours: {
    color: '#007bff',
    fontWeight: 'bold',
  },
  scheduleDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
    fontSize: '0.9rem',
    color: '#666',
  },
  deps: {
    fontSize: '0.85rem',
    color: '#6c757d',
  },
  conflict: {
    color: '#856404',
    fontSize: '0.85rem',
    fontWeight: '500',
  },
  backButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  doneButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold',
  },
};

export default SmartScheduler;