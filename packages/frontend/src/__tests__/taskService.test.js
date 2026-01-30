import taskService from '../services/taskService';

// Mock fetch globally
global.fetch = jest.fn();

describe('TaskService', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  describe('getAll', () => {
    it('should fetch all tasks', async () => {
      const mockTasks = [
        { id: 1, title: 'Task 1', completed: 0 },
        { id: 2, title: 'Task 2', completed: 1 },
      ];

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockTasks }),
      });

      const result = await taskService.getAll();

      expect(fetch).toHaveBeenCalledWith('/api/tasks');
      expect(result).toEqual(mockTasks);
    });

    it('should apply filters and sorting', async () => {
      const mockTasks = [{ id: 1, title: 'Task 1', priority: 'high' }];

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockTasks }),
      });

      await taskService.getAll({
        status: 'active',
        priority: 'high',
        sortBy: 'due_date',
        sortOrder: 'asc',
      });

      expect(fetch).toHaveBeenCalledWith(
        '/api/tasks?status=active&priority=high&sortBy=due_date&sortOrder=asc'
      );
    });

    it('should throw error on fetch failure', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
      });

      await expect(taskService.getAll()).rejects.toThrow('Failed to fetch tasks');
    });
  });

  describe('create', () => {
    it('should create a new task', async () => {
      const newTask = { title: 'New Task', priority: 'medium' };
      const createdTask = { id: 1, ...newTask, completed: 0 };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: createdTask }),
      });

      const result = await taskService.create(newTask);

      expect(fetch).toHaveBeenCalledWith('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
      });
      expect(result).toEqual(createdTask);
    });

    it('should throw error on validation failure', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Validation failed', details: ['Title is required'] }),
      });

      await expect(taskService.create({ title: '' })).rejects.toThrow('Title is required');
    });
  });

  describe('update', () => {
    it('should update an existing task', async () => {
      const updates = { title: 'Updated Task' };
      const updatedTask = { id: 1, ...updates, completed: 0 };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: updatedTask }),
      });

      const result = await taskService.update(1, updates);

      expect(fetch).toHaveBeenCalledWith('/api/tasks/1', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      expect(result).toEqual(updatedTask);
    });

    it('should throw error for non-existent task', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ error: 'Task not found' }),
      });

      await expect(taskService.update(999, { title: 'Update' })).rejects.toThrow(
        'Task not found'
      );
    });
  });

  describe('toggleComplete', () => {
    it('should toggle task completion', async () => {
      const toggledTask = { id: 1, title: 'Task', completed: 1 };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: toggledTask }),
      });

      const result = await taskService.toggleComplete(1);

      expect(fetch).toHaveBeenCalledWith('/api/tasks/1/complete', {
        method: 'PATCH',
      });
      expect(result).toEqual(toggledTask);
    });
  });

  describe('delete', () => {
    it('should delete a task', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, message: 'Task deleted' }),
      });

      await taskService.delete(1);

      expect(fetch).toHaveBeenCalledWith('/api/tasks/1', {
        method: 'DELETE',
      });
    });

    it('should throw error for non-existent task', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ error: 'Task not found' }),
      });

      await expect(taskService.delete(999)).rejects.toThrow('Task not found');
    });
  });
});
