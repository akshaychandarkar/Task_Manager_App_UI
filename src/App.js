// React core imports
import React, { useState, useEffect } from 'react';
// Component imports
import Header from './components/Header';
import SideMenu from './components/SideMenu';
import Footer from './components/Footer';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';


// Notification libraries
import { ToastContainer, toast } from 'react-toastify';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import 'react-toastify/dist/ReactToastify.css';
import '@fortawesome/fontawesome-free/css/all.min.css';


function App() {
  const [view, setView] = useState('list'); //Track current view add or list
  const [tasks, setTasks] = useState(() => {  // Load tasks from localStorage or initialize empty
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [deleteId, setDeleteId] = useState(null); // Track the task to delete (by ID)
  const [editTask, setEditTask] = useState(null);  // Track the task being edited

  const addTask = (task) => {
    const newTask = {
      ...task,
      id: Date.now(), // Generate a  Unique ID based on timestamp
      createdAt: new Date().toISOString(), // Save creation time
    };
    setTasks([...tasks, newTask]); // Add to task list
    toast.success('Task added successfully!');
    setView('list'); // Return to task list
  };
  // Replaces the old task with the updated one using id
  const updateTask = (updatedTask) => {
    setTasks(tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t))); // Replace old task
    toast.success('Task updated successfully!');
    setEditTask(null); // Clear edit mode
    setView('list');
  };

  const confirmDeleteTask = (id) => setDeleteId(id); // Show confirmation modal

  const deleteTask = () => {
    setTasks(tasks.filter((task) => task.id !== deleteId)); // Remove from task list by ID
    toast.info('Task deleted');
    setDeleteId(null); // Close modal
  };

  const handleEdit = (task) => {
    setEditTask(task); // Set task to prefill the form (edit mode)
    setView('add'); // Show TaskForm
  };

  useEffect(() => {  // Every time task changes it saves to Local Storage
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header /> {/* Top header */}
      <div className="d-flex flex-grow-1">
        <SideMenu onSelect={(v) => { setView(v); setEditTask(null); }} /> {/* Sidebar */}
        <div className="flex-grow-1 p-3">
          {/* Main content area: shows either TaskForm or TaskList */}
          {view === 'add' ? (
            <TaskForm
              addTask={addTask}
              updateTask={updateTask}
              taskToEdit={editTask}
              onCancel={() => { setEditTask(null); setView('list'); }}
            />
          ) : (
            <TaskList tasks={tasks} deleteTask={confirmDeleteTask} onEdit={handleEdit} />
          )}
        </div>
      </div>
      <Footer /> {/* Bottom footer */}
      {/* Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={1500}
        //hideProgressBar
        closeOnClick
        pauseOnHover={false}
        draggable={false}
      />
      {/* Modal for Delete Confirmation */}
      <DeleteConfirmModal
        show={!!deleteId}
        onHide={() => setDeleteId(null)}
        onConfirm={deleteTask}
      />
    </div>
  );
}

export default App;
