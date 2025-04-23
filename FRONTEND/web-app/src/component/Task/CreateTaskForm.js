import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CreateTaskForm.css';

const TaskCreateForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    taskName: '',
    taskID: '',
    taskDate: '',
    description: '',
    process: '',
    person: 'Miss.Ruwindya', // Set default person
    status: 'Pending'
  });

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
      const response = await axios.post('http://localhost:5000/api/tasks', formData);
      console.log('Task created:', response.data);
      alert('Task created successfully!');
      navigate('/task-list');
    } catch (error) {
      console.error('Error creating task:', error.response?.data || error.message);
      alert(`Failed to create task: ${error.response?.data?.message || 'Server error'}`);
    }
  };

  return (
    <div className="task-form-container">
      <h2>Create New Task</h2>
      <form onSubmit={handleSubmit}>
        {/* Form fields remain the same as your original */}
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

        <div className="form-group">
          <label>Task ID:</label>
          <input
            type="text"
            name="taskID"
            value={formData.taskID}
            onChange={handleChange}
            required
          />
        </div>

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

        <div className="form-group">
          <label>Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

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

        <div className="form-group">
          <label>Assigned Person:</label>
          <select
            name="person"
            value={formData.person}
            onChange={handleChange}
            required
          >
            <option value="Miss.Ruwindya">Miss.Ruwindya</option>
            <option value="Miss.Rashini">Miss.Rashini</option>
            <option value="Mr.THarusha">Mr.THarusha</option>
          </select>
        </div>

        <div className="form-group">
          <label>Status:</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
          >
            <option value="Pending">Pending</option>
            <option value="In-Progress">In Progress</option>
          </select>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn">Create Task</button>
          <button 
            type="button" 
            className="cancel-btn"
            onClick={() => navigate('/task-list')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskCreateForm;