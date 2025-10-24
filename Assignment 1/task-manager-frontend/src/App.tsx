import React, { useState, useEffect } from 'react';
import './App.css';
import TaskList from './components/TaskList';
import AddTaskForm from './components/AddTaskForm';
import { taskApi } from './services/taskApi.service';
import { TaskItem } from './types/task.types';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await taskApi.getAllTasks();
      setTasks(data);
    } catch (err) {
      setError('Failed to fetch tasks. Make sure the backend is running.');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (description: string) => {
    try {
      const newTask = await taskApi.createTask({
        description,
        isCompleted: false,
      });
      setTasks([...tasks, newTask]);
    } catch (err) {
      setError('Failed to add task.');
      console.error('Error adding task:', err);
    }
  };

  const handleToggleTask = async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    try {
      const updatedTask = await taskApi.updateTask(id, {
        description: task.description,
        isCompleted: !task.isCompleted,
      });
      setTasks(tasks.map((t) => (t.id === id ? updatedTask : t)));
    } catch (err) {
      setError('Failed to update task.');
      console.error('Error updating task:', err);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await taskApi.deleteTask(id);
      setTasks(tasks.filter((t) => t.id !== id));
    } catch (err) {
      setError('Failed to delete task.');
      console.error('Error deleting task:', err);
    }
  };

  return (
    <div className="App">
      <div className="container">
        <h1>Task Manager</h1>
        {error && <div className="error-message">{error}</div>}
        <AddTaskForm onAdd={handleAddTask} />
        {loading ? (
          <p className="loading">Loading tasks...</p>
        ) : (
          <TaskList tasks={tasks} onToggle={handleToggleTask} onDelete={handleDeleteTask} />
        )}
      </div>
    </div>
  );
};

export default App;