import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

// TaskForm component handles both task creation and editing
function TaskForm({ addTask, updateTask, taskToEdit, onCancel }) {
  // Initial state for form data
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    status: 'Not Started',
    worklog: '',
    priority: '',
    storyStats: [],
  });

  const [errors, setErrors] = useState({});         // Tracks validation errors
  const [submitted, setSubmitted] = useState(false); // Tracks whether user has submitted

  // Populate form fields if editing an existing task
  useEffect(() => {
    if (taskToEdit) {
      setFormData(taskToEdit);
    }
  }, [taskToEdit]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      // Update checkbox list for storyStats
      const updated = checked
        ? [...formData.storyStats, value]
        : formData.storyStats.filter((s) => s !== value);
      setFormData({ ...formData, storyStats: updated });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Validate form fields
  const validate = () => {
    const errs = {};
    const titleRegex = /^[a-zA-Z0-9_\-: ]+$/;

    if (!formData.title || !titleRegex.test(formData.title)) {
      errs.title = true;
    }
    if (!formData.description) errs.description = true;
    if (!formData.startDate) errs.startDate = true;
    if (!formData.endDate) errs.endDate = true;
    if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
      toast.error('Start date cannot be after end date');
      errs.startDate = true;
      errs.endDate = true;
    }
    if (!formData.worklog) errs.worklog = true;
    if (!formData.priority) errs.priority = true;
    if (formData.storyStats.length === 0) errs.storyStats = true;

    setErrors(errs);

    if (Object.keys(errs).length > 0) {
      toast.error('Please correct the highlighted fields.');
    }

    return Object.keys(errs).length === 0;
  };

  // Handle form submit for Add/Update
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);

    if (validate()) {
      if (taskToEdit) {
        updateTask({ ...formData }); // Update existing task
      } else {
        addTask(formData);           // Add new task
      }
    }
  };

  // Reset form fields and validation state
  const handleReset = () => {
    setFormData({
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      status: 'Not Started',
      worklog: '',
      priority: '',
      storyStats: [],
    });
    setErrors({});
    setSubmitted(false);
  };

  // Helper for showing label with asterisk if field has error
  const label = (fieldKey, text) => (
    <>
      {text} {submitted && errors[fieldKey] && <span className="text-danger">*</span>}
    </>
  );

  return (
    <div className="card bg-white p-4 shadow-sm">
      <form onSubmit={handleSubmit}>
        {/* Title field */}
        <div className="mb-3">
          <label className="form-label">{label('title', 'Title')}</label>
          <input
            className={`form-control ${errors.title ? 'is-invalid' : ''}`}
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            onInvalid={(e) => e.target.setCustomValidity('Title is required')}
            onInput={(e) => e.target.setCustomValidity('')}
          />
        </div>

        {/* Description field */}
        <div className="mb-3">
          <label className="form-label">{label('description', 'Description')}</label>
          <textarea
            className={`form-control ${errors.description ? 'is-invalid' : ''}`}
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            onInvalid={(e) => e.target.setCustomValidity('Description is required')}
            onInput={(e) => e.target.setCustomValidity('')}
          ></textarea>
        </div>

        {/* Start and End Date fields */}
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">{label('startDate', 'Start Date')}</label>
            <input
              type="date"
              className={`form-control ${errors.startDate ? 'is-invalid' : ''}`}
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
              onInvalid={(e) => e.target.setCustomValidity('Start date is required')}
              onInput={(e) => e.target.setCustomValidity('')}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">{label('endDate', 'End Date')}</label>
            <input
              type="date"
              className={`form-control ${errors.endDate ? 'is-invalid' : ''}`}
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
              onInvalid={(e) => e.target.setCustomValidity('End date is required')}
              onInput={(e) => e.target.setCustomValidity('')}
            />
          </div>
        </div>

        {/* Status and Worklog fields */}
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">{label('status', 'Status')}</label>
            <select
              className="form-select"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option>Not Started</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label">{label('worklog', 'Worklog')}</label>
            <input
              className={`form-control ${errors.worklog ? 'is-invalid' : ''}`}
              name="worklog"
              value={formData.worklog}
              onChange={handleChange}
              required
              onInvalid={(e) => e.target.setCustomValidity('Worklog is required')}
              onInput={(e) => e.target.setCustomValidity('')}
            />
          </div>
        </div>

        {/* Priority radio buttons */}
        <div className="mb-3">
          <label className="form-label">{label('priority', 'Priority')}</label>
          <div className="d-flex gap-3">
            {['High', 'Medium', 'Low'].map((p) => (
              <label key={p} className={errors.priority ? 'is-invalid' : ''}>
                <input
                  type="radio"
                  name="priority"
                  value={p}
                  checked={formData.priority === p}
                  onChange={handleChange}
                  required
                />{' '}
                {p}
              </label>
            ))}
          </div>
        </div>

        {/* Story Stats checkboxes */}
        <div className="mb-3">
          <label className="form-label">{label('storyStats', 'Story Stats')}</label>
          <div className="d-flex gap-3 flex-wrap">
            {['Development', 'Unit Testing', 'Dev Testing', 'Deployment'].map((s) => (
              <label key={s} className={errors.storyStats ? 'is-invalid' : ''}>
                <input
                  type="checkbox"
                  value={s}
                  checked={formData.storyStats.includes(s)}
                  onChange={handleChange}
                  required={formData.storyStats.length === 0}
                />{' '}
                {s}
              </label>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <button className="btn btn-success me-2" type="submit">
          {taskToEdit ? 'Update' : 'Add'} Task
        </button>
        <button className="btn btn-warning me-2" type="button" onClick={handleReset}>
          Reset
        </button>
        <button className="btn btn-secondary" type="button" onClick={onCancel}>
          Cancel
        </button>
      </form>
    </div>
  );
}

export default TaskForm;
