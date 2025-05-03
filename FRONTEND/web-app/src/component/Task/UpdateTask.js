import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './CreateTaskForm.css';

const UpdateTaskForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    taskName: '',
    taskID: '',
    taskDate: '',
    description: '',
    process: '',
    person: '',
    status: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/tasks/${id}`);
        const taskData = response.data.task || response.data; // Handle both nested and direct response
        
        if (!taskData) {
          throw new Error('Task data not found');
        }

        setFormData({
          taskName: taskData.taskName || '',
          taskID: taskData.taskID || '',
          taskDate: taskData.taskDate ? taskData.taskDate.split('T')[0] : '',
          description: taskData.description || '',
          process: taskData.process || '',
          person: taskData.person || '',
          status: taskData.status || ''
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching task:', error);
        setError('Failed to load task data');
        setLoading(false);
      }
    };
    fetchTask();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/tasks/${id}`, formData);
      alert('Task updated successfully!');
      navigate('/task-list');
    } catch (error) {
      console.error('Error updating task:', error);
      alert(`Failed to update task: ${error.response?.data?.message || error.message}`);
    }
  };

  if (loading) {
    return <div className="loading">Loading task data...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button onClick={() => navigate('/all-tasks')} className="back-button">
          Back to All Tasks
        </button>
      </div>
    );
  }

  return (
    <div className="task-form-container">
      <h2>Update Task</h2>
      <form onSubmit={handleSubmit}>
        {/* Task Name Field */}
        <div className="form-group">
          <label>Task Name:</label>
          <input
            type="text"
            name="taskName"
            value={formData.taskName}
            onChange={handleChange}
            required
          />
        </div>

        {/* Task ID Field */}
        <div className="form-group">
          <label>Task ID:</label>
          <input
            type="text"
            name="taskID"
            value={formData.taskID}
            onChange={handleChange}
            required
            disabled
          />
        </div>

        {/* Date Field */}
        <div className="form-group">
          <label>Date:</label>
          <input
            type="date"
            name="taskDate"
            value={formData.taskDate}
            onChange={handleChange}
            required
          />
        </div>

        {/* Description Field */}
        <div className="form-group">
          <label>Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="5"
          />
        </div>

        {/* Process Field */}
        <div className="form-group">
          <label>Process:</label>
          <input
            type="text"
            name="process"
            value={formData.process}
            onChange={handleChange}
            required
          />
        </div>

        {/* Assigned Person Field */}
        <div className="form-group">
          <label>Assigned Person:</label>
          <select
            name="person"
            value={formData.person}
            onChange={handleChange}
            required
          >
            <option value="">Select a person</option>
            <option value="Miss.Ruwindya">Miss.Ruwindya</option>
            <option value="Miss.Rashini">Miss.Rashini</option>
            <option value="Mr.THarusha">Mr.THarusha</option>
          </select>
        </div>

        {/* Status Field */}
        <div className="form-group">
          <label>Status:</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
          >
            <option value="">Select status</option>
            <option value="To-Do">To Do</option>
            <option value="Pending">Pending</option>
            <option value="In-Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button type="submit" className="submit-btn">
            Update Task
          </button>
          <button 
            type="button" 
            className="cancel-btn"
            onClick={() => navigate('/all-tasks')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateTaskForm;