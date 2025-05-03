import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import './TaskList.css';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [statusFilter, setStatusFilter] = useState('All');
  const [personFilter, setPersonFilter] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/tasks');
        const tasksData = Array.isArray(response.data)
          ? response.data
          : response.data.tasks || [];

        setTasks(tasksData);
        setFilteredTasks(tasksData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        setTasks([]);
        setFilteredTasks([]);
      }
    };
    fetchTasks();
  }, []);

  useEffect(() => {
    let filtered = [...tasks];

    if (statusFilter !== 'All') {
      filtered = filtered.filter(task => task.status === statusFilter);
    }

    if (personFilter !== 'All') {
      filtered = filtered.filter(task => task.person === personFilter);
    }

    if (startDate !== '') {
      filtered = filtered.filter(task => new Date(task.taskDate) >= new Date(startDate));
    }

    if (endDate !== '') {
      filtered = filtered.filter(task => new Date(task.taskDate) <= new Date(endDate));
    }

    if (searchTerm.trim() !== '') {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(task =>
        task.taskName.toLowerCase().includes(lowerSearch) ||
        task.taskID.toLowerCase().includes(lowerSearch) ||
        task.process.toLowerCase().includes(lowerSearch) ||
        task.person.toLowerCase().includes(lowerSearch)
      );
    }

    setFilteredTasks(filtered);
  }, [statusFilter, personFilter, startDate, endDate, searchTerm, tasks]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`);
      const updatedTasks = tasks.filter(task => task._id !== id);
      setTasks(updatedTasks);
      alert('Task deleted successfully');
    } catch (err) {
      alert('Failed to delete task');
      console.error('Delete error:', err);
    }
  };

  const uniqueStatuses = ['All', ...new Set(tasks.map(task => task.status))];
  const uniquePersons = ['All', ...new Set(tasks.map(task => task.person))];

  if (loading) return <div className="loading">Loading tasks...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!Array.isArray(tasks)) return <div className="error">Invalid tasks data format</div>;
  if (filteredTasks.length === 0) return <div className="no-tasks">No tasks found</div>;

  const generatePDF = () => {
    const doc = new jsPDF();
    const currentDate = new Date().toLocaleDateString();

    doc.setFontSize(14);
    doc.text('Task Report', 14, 16);
    doc.setFontSize(10);
    doc.text(`Report Generated On: ${currentDate}`, 14, 24);

    const tableColumn = ["Task Name", "ID", "Date", "Process", "Assigned To", "Status"];
    const tableRows = [];

    filteredTasks.forEach(task => {
      const rowData = [
        task.taskName,
        task.taskID,
        new Date(task.taskDate).toLocaleDateString(),
        task.process,
        task.person,
        task.status,
      ];
      tableRows.push(rowData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      styles: { fontSize: 9 },
    });

    doc.save('task_report.pdf');
  };

  const generateExcel = () => {
    const worksheetData = filteredTasks.map(task => ({
      "Task Name": task.taskName,
      "Task ID": task.taskID,
      "Date": new Date(task.taskDate).toLocaleDateString(),
      "Process": task.process,
      "Assigned To": task.person,
      "Status": task.status
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Tasks");

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const fileData = new Blob([excelBuffer], { type: 'application/octet-stream' });

    saveAs(fileData, 'task_report.xlsx');
  };

  return (
    <div className="task-list-container">
      <h2>Task List</h2>

      <div className="filter-controls">
        <label>
          Filter by Status:
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            {uniqueStatuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </label>

        <label>
          Filter by Assigned To:
          <select value={personFilter} onChange={(e) => setPersonFilter(e.target.value)}>
            {uniquePersons.map(person => (
              <option key={person} value={person}>{person}</option>
            ))}
          </select>
        </label>

        <label>
          Start Date:
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </label>

        <label>
          End Date:
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </label>

        <label>
          Search:
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </label>
      </div>

      <div className="button-group">
        <div>
          <button className="create-btn" onClick={() => navigate('/create-task')}>
            Create New Task
          </button>
          <button className="dashboard-btn" onClick={() => navigate('/task-dashboard')}>
            DashBoard
          </button>
        </div>
        <div>
          <button className="pdf-btn" onClick={generatePDF}>Download PDF</button>
          <button className="excel-btn" onClick={generateExcel}>Download Excel</button>
        </div>
      </div>

      <div className='table-container'>
        <table className="task-table">
          <thead>
            <tr>
              <th style={{ width: '15%' }}>Task Name</th>
              <th style={{ width: '10%' }}>ID</th>
              <th style={{ width: '10%' }}>Date</th>
              <th style={{ width: '10%' }}>Process</th>
              <th style={{ width: '15%' }}>Assigned To</th>
              <th style={{ width: '10%' }}>Status</th>
              <th style={{ width: '30%', textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map((task) => (
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
    </div>
  );
};

export default TaskList;