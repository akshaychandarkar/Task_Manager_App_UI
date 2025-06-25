import React from 'react';

// Utility function to format full date & time (e.g., "27 May 2025, 3:42:15 PM")
function formatDateTime(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const options = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  };
  return date.toLocaleString('en-GB', options);
}

// Utility function to format only date (e.g., "27 May 2025")
function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const options = { day: '2-digit', month: 'short', year: 'numeric' };
  return date.toLocaleDateString('en-GB', options);
}

// TaskList Component to display the list of tasks in a table
function TaskList({ tasks, deleteTask, onEdit }) {
  // If no tasks are present, show a friendly message
  if (tasks.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
        <h2 className="text-center text-muted">No Record Found!</h2>
      </div>
    );
  }

  // Helper to return appropriate Bootstrap badge class based on task status
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed': return 'bg-success'; // Green badge
      case 'In Progress': return 'bg-warning text-dark'; // Yellow badge
      case 'Not Started': return 'bg-danger'; // Red badge
      default: return 'bg-secondary'; // Gray as fallback
    }
  };

  // Render task list table
  return (
    <table className="table table-bordered">
      <thead>
        <tr>
          {/* Column headers with blue background and white text */}
          <th className="bg-primary text-white">Sr. No.</th>
          <th className="bg-primary text-white">Title</th>
          <th className="bg-primary text-white">Description</th>
          <th className="bg-primary text-white">Start</th>
          <th className="bg-primary text-white">End</th>
          <th className="bg-primary text-white">Status</th>
          <th className="bg-primary text-white">Created</th>
          <th className="bg-primary text-white">Action</th>
        </tr>
      </thead>
      <tbody>
        {/* Render each task row */}
        {tasks.map((task, i) => (
          <tr key={task.id}>
            <td>{i + 1}</td> {/* Serial Number */}
            <td>{task.title}</td>
            <td>{task.description}</td>
            <td>{formatDate(task.startDate)}</td> {/* Display formatted Start Date */}
            <td>{formatDate(task.endDate)}</td> {/* Display formatted End Date */}
            <td>
              {/* Status with badge style */}
              <span className={`badge ${getStatusBadge(task.status)}`}>
                {task.status}
              </span>
            </td>
            <td>{formatDateTime(task.createdAt)}</td> {/* Display formatted creation timestamp */}
            <td>
              {/* Edit Button */}
              <button className="btn btn-sm btn-warning me-2" onClick={() => onEdit(task)}>
                <i className="fas fa-edit"></i>
              </button>
              {/* Delete Button */}
              <button className="btn btn-sm btn-danger" onClick={() => deleteTask(task.id)}>
                <i className="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default TaskList;
