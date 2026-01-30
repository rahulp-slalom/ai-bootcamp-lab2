const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  toggleTaskCompletion,
  deleteTask,
} = require('./db');
const { validate, createTaskSchema, updateTaskSchema } = require('./middleware/validation');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// API Routes

/**
 * GET /api/tasks - Get all tasks with optional filtering and sorting
 * Query params: status, priority, sortBy, sortOrder
 */
app.get('/api/tasks', (req, res, next) => {
  try {
    const { status, priority, sortBy, sortOrder } = req.query;
    const tasks = getAllTasks({ status, priority, sortBy, sortOrder });
    res.json({
      success: true,
      data: tasks,
      count: tasks.length,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/tasks/:id - Get a single task by ID
 */
app.get('/api/tasks/:id', (req, res, next) => {
  try {
    const { id } = req.params;
    const task = getTaskById(parseInt(id, 10));

    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found',
      });
    }

    res.json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/tasks - Create a new task
 */
app.post('/api/tasks', validate(createTaskSchema), (req, res, next) => {
  try {
    const task = createTask(req.validatedBody);

    res.status(201).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/tasks/:id - Update a task
 */
app.put('/api/tasks/:id', validate(updateTaskSchema), (req, res, next) => {
  try {
    const { id } = req.params;
    const task = updateTask(parseInt(id, 10), req.validatedBody);

    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found',
      });
    }

    res.json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PATCH /api/tasks/:id/complete - Toggle task completion
 */
app.patch('/api/tasks/:id/complete', (req, res, next) => {
  try {
    const { id } = req.params;
    const task = toggleTaskCompletion(parseInt(id, 10));

    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found',
      });
    }

    res.json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/tasks/:id - Delete a task
 */
app.delete('/api/tasks/:id', (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = deleteTask(parseInt(id, 10));

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Task not found',
      });
    }

    res.json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler
app.use(notFoundHandler);

// Error handler
app.use(errorHandler);

module.exports = app;