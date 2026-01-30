import React, { useState, useEffect } from 'react';
import {
  ThemeProvider,
  CssBaseline,
  Container,
  Box,
  Typography,
  Fab,
  Stack,
  CircularProgress,
  Snackbar,
  Alert,
  AppBar,
  Toolbar,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import theme from './theme';
import taskService from './services/taskService';
import TaskCard from './components/TaskCard';
import TaskForm from './components/TaskForm';
import TaskFilters from './components/TaskFilters';
import ConfirmDialog from './components/ConfirmDialog';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'all',
    priority: '',
    sortBy: 'created_at',
    sortOrder: 'desc',
  });
  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, taskId: null });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Load tasks on mount and when filters change
  useEffect(() => {
    loadTasks();
  }, [filters]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await taskService.getAll(filters);
      setTasks(data);
    } catch (error) {
      showSnackbar('Failed to load tasks', 'error');
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleCreateTask = () => {
    setEditingTask(null);
    setFormOpen(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setFormOpen(true);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setEditingTask(null);
  };

  const handleSaveTask = async (taskData) => {
    try {
      if (editingTask) {
        await taskService.update(editingTask.id, taskData);
        showSnackbar('Task updated successfully');
      } else {
        await taskService.create(taskData);
        showSnackbar('Task created successfully');
      }
      handleFormClose();
      loadTasks();
    } catch (error) {
      showSnackbar(error.message || 'Failed to save task', 'error');
      console.error('Error saving task:', error);
    }
  };

  const handleDeleteClick = (taskId) => {
    setDeleteDialog({ open: true, taskId });
  };

  const handleDeleteConfirm = async () => {
    try {
      await taskService.delete(deleteDialog.taskId);
      showSnackbar('Task deleted successfully');
      setDeleteDialog({ open: false, taskId: null });
      loadTasks();
    } catch (error) {
      showSnackbar(error.message || 'Failed to delete task', 'error');
      console.error('Error deleting task:', error);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, taskId: null });
  };

  const handleToggleComplete = async (taskId) => {
    try {
      await taskService.toggleComplete(taskId);
      showSnackbar('Task updated');
      loadTasks();
    } catch (error) {
      showSnackbar(error.message || 'Failed to update task', 'error');
      console.error('Error toggling task:', error);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <AppBar position="static" elevation={0}>
        <Toolbar>
          <Typography variant="h6" component="h1" sx={{ flexGrow: 1 }}>
            Task Manager
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h2" gutterBottom>
            My Tasks
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your tasks efficiently
          </Typography>
        </Box>

        <TaskFilters filters={filters} onFilterChange={handleFilterChange} />

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : tasks.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No tasks found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {filters.status !== 'all' || filters.priority
                ? 'Try adjusting your filters or create a new task'
                : 'Get started by creating your first task'}
            </Typography>
          </Box>
        ) : (
          <Stack spacing={2}>
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={handleEditTask}
                onDelete={handleDeleteClick}
                onToggleComplete={handleToggleComplete}
              />
            ))}
          </Stack>
        )}

        <Fab
          color="primary"
          aria-label="Add new task"
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
          }}
          onClick={handleCreateTask}
        >
          <AddIcon />
        </Fab>

        <TaskForm
          open={formOpen}
          task={editingTask}
          onClose={handleFormClose}
          onSave={handleSaveTask}
        />

        <ConfirmDialog
          open={deleteDialog.open}
          title="Delete Task"
          message="Are you sure you want to delete this task? This action cannot be undone."
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
        />

        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbar.severity}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </ThemeProvider>
  );
}

export default App;