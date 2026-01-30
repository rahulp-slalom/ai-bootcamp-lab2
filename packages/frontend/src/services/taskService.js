const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

/**
 * Task service for managing task operations
 */
const taskService = {
  /**
   * Get all tasks with optional filtering and sorting
   * @param {Object} options - Query options
   * @param {string} options.status - Filter by status ('all', 'active', 'completed')
   * @param {string} options.priority - Filter by priority
   * @param {string} options.sortBy - Sort field
   * @param {string} options.sortOrder - Sort direction ('asc', 'desc')
   * @returns {Promise<Array>} Array of tasks
   */
  async getAll(options = {}) {
    const { status, priority, sortBy, sortOrder } = options;
    const params = new URLSearchParams();

    if (status && status !== 'all') params.append('status', status);
    if (priority) params.append('priority', priority);
    if (sortBy) params.append('sortBy', sortBy);
    if (sortOrder) params.append('sortOrder', sortOrder);

    const queryString = params.toString();
    const url = `${API_BASE_URL}/tasks${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch tasks');
    }

    const result = await response.json();
    return result.data;
  },

  /**
   * Get a single task by ID
   * @param {number} id - Task ID
   * @returns {Promise<Object>} Task object
   */
  async getById(id) {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`);
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Task not found');
      }
      throw new Error('Failed to fetch task');
    }

    const result = await response.json();
    return result.data;
  },

  /**
   * Create a new task
   * @param {Object} taskData - Task data
   * @param {string} taskData.title - Task title (required)
   * @param {string} taskData.description - Task description
   * @param {string} taskData.priority - Task priority ('low', 'medium', 'high')
   * @param {string} taskData.due_date - Due date (YYYY-MM-DD)
   * @returns {Promise<Object>} Created task
   */
  async create(taskData) {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.details?.[0] || error.error || 'Failed to create task');
    }

    const result = await response.json();
    return result.data;
  },

  /**
   * Update an existing task
   * @param {number} id - Task ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} Updated task
   */
  async update(id, updates) {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Task not found');
      }
      const error = await response.json();
      throw new Error(error.details?.[0] || error.error || 'Failed to update task');
    }

    const result = await response.json();
    return result.data;
  },

  /**
   * Toggle task completion status
   * @param {number} id - Task ID
   * @returns {Promise<Object>} Updated task
   */
  async toggleComplete(id) {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}/complete`, {
      method: 'PATCH',
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Task not found');
      }
      throw new Error('Failed to toggle task completion');
    }

    const result = await response.json();
    return result.data;
  },

  /**
   * Delete a task
   * @param {number} id - Task ID
   * @returns {Promise<void>}
   */
  async delete(id) {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Task not found');
      }
      throw new Error('Failed to delete task');
    }
  },
};

export default taskService;
