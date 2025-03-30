import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './TaskList.css';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/tasks');
        console.log(response.data.tasks);
        // Handle response based on table name "Tasks"
        const tasksData = Array.isArray(response.data) 
          ? response.data 
          : response.data.tasks || [];
          
        setTasks(tasksData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        setTasks([]);
      }
    };
    fetchTasks();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`);
      setTasks(tasks.filter(task => task._id !== id));
      alert('Task deleted successfully');
    } catch (err) {
      alert('Failed to delete task');
      console.error('Delete error:', err);
    }
  };

  if (loading) return <div className="loading">Loading tasks...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!Array.isArray(tasks)) return <div className="error">Invalid tasks data format</div>;
  if (tasks.length === 0) return <div className="no-tasks">No tasks found</div>;

  return (
    <div className="task-list-container">
      <h2>Task List</h2>
      <button className="create-btn" onClick={() => navigate('/create-task')}>
        Create New Task
      </button>
      
      <table className="task-table">
        <thead>
          <tr>
            <th>Task Name</th>
            <th>ID</th>
            <th>Date</th>
            <th>Process</th>
            <th>Assigned To</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task._id}>
              <td>{task.taskName}</td>
              <td>{task.taskID}</td>
              <td>{new Date(task.taskDate).toLocaleDateString()}</td>
              <td>{task.process}</td>
              <td>{task.person}</td>
              <td>
                <span className={`status-badge ${task.status.replace(' ', '-')}`}>
                  {task.status}
                </span>
              </td>
              <td className="actions">
                <button 
                  className="update-btn"
                  onClick={() => navigate(`/update-task/${task._id}`)}
                >
                  Update
                </button>
                <button 
                  className="delete-btn"
                  onClick={() => handleDelete(task._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskList;