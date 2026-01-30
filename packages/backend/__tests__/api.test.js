const request = require('supertest');
const app = require('../src/app');

describe('Task API Integration Tests', () => {
  describe('GET /api/tasks', () => {
    it('should return all tasks with success flag', async () => {
      const response = await request(app)
        .get('/api/tasks')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('count');
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should filter tasks by status', async () => {
      const response = await request(app)
        .get('/api/tasks?status=completed')
        .expect(200);

      expect(response.body.success).toBe(true);
      response.body.data.forEach((task) => {
        expect(task.completed).toBe(1);
      });
    });

    it('should filter tasks by priority', async () => {
      const response = await request(app)
        .get('/api/tasks?priority=high')
        .expect(200);

      expect(response.body.success).toBe(true);
      response.body.data.forEach((task) => {
        expect(task.priority).toBe('high');
      });
    });

    it('should sort tasks by due_date', async () => {
      const response = await request(app)
        .get('/api/tasks?sortBy=due_date&sortOrder=asc')
        .expect(200);

      expect(response.body.success).toBe(true);
      const tasks = response.body.data;
      for (let i = 1; i < tasks.length; i++) {
        if (tasks[i - 1].due_date && tasks[i].due_date) {
          expect(tasks[i - 1].due_date <= tasks[i].due_date).toBe(true);
        }
      }
    });
  });

  describe('GET /api/tasks/:id', () => {
    it('should return a single task by ID', async () => {
      const response = await request(app).get('/api/tasks/1').expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id', 1);
      expect(response.body.data).toHaveProperty('title');
    });

    it('should return 404 for non-existent task', async () => {
      const response = await request(app).get('/api/tasks/9999').expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Task not found');
    });
  });

  describe('POST /api/tasks', () => {
    it('should create a new task with valid data', async () => {
      const newTask = {
        title: 'Test Task',
        description: 'Test description',
        priority: 'high',
        due_date: '2026-03-01',
      };

      const response = await request(app)
        .post('/api/tasks')
        .send(newTask)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.title).toBe(newTask.title);
      expect(response.body.data.description).toBe(newTask.description);
      expect(response.body.data.priority).toBe(newTask.priority);
      expect(response.body.data.completed).toBe(0);
    });

    it('should create task with only required fields', async () => {
      const newTask = {
        title: 'Minimal Task',
      };

      const response = await request(app)
        .post('/api/tasks')
        .send(newTask)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(newTask.title);
      expect(response.body.data.priority).toBe('medium');
    });

    it('should return 400 for missing title', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({ description: 'No title' })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Validation failed');
    });

    it('should return 400 for invalid priority', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({ title: 'Test', priority: 'urgent' })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should return 400 for invalid due_date format', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({ title: 'Test', due_date: '01/31/2026' })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/tasks/:id', () => {
    it('should update an existing task', async () => {
      const updates = {
        title: 'Updated Task',
        priority: 'low',
      };

      const response = await request(app)
        .put('/api/tasks/1')
        .send(updates)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(updates.title);
      expect(response.body.data.priority).toBe(updates.priority);
    });

    it('should return 404 for non-existent task', async () => {
      const response = await request(app)
        .put('/api/tasks/9999')
        .send({ title: 'Update' })
        .expect(404);

      expect(response.body.success).toBe(false);
    });

    it('should return 400 for invalid update data', async () => {
      const response = await request(app)
        .put('/api/tasks/1')
        .send({ priority: 'invalid' })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PATCH /api/tasks/:id/complete', () => {
    it('should toggle task completion status', async () => {
      // Get current status
      const getResponse = await request(app).get('/api/tasks/1');
      const currentStatus = getResponse.body.data.completed;

      // Toggle status
      const patchResponse = await request(app)
        .patch('/api/tasks/1/complete')
        .expect(200);

      expect(patchResponse.body.success).toBe(true);
      expect(patchResponse.body.data.completed).toBe(currentStatus === 1 ? 0 : 1);
    });

    it('should return 404 for non-existent task', async () => {
      const response = await request(app)
        .patch('/api/tasks/9999/complete')
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('should delete an existing task', async () => {
      // Create a task to delete
      const createResponse = await request(app)
        .post('/api/tasks')
        .send({ title: 'Task to Delete' });

      const taskId = createResponse.body.data.id;

      // Delete the task
      const deleteResponse = await request(app)
        .delete(`/api/tasks/${taskId}`)
        .expect(200);

      expect(deleteResponse.body.success).toBe(true);
      expect(deleteResponse.body.message).toBe('Task deleted successfully');

      // Verify task is deleted
      await request(app).get(`/api/tasks/${taskId}`).expect(404);
    });

    it('should return 404 for non-existent task', async () => {
      const response = await request(app)
        .delete('/api/tasks/9999')
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/health', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/api/health').expect(200);

      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('404 handler', () => {
    it('should return 404 for unknown routes', async () => {
      const response = await request(app).get('/api/unknown').expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Resource not found');
    });
  });
});
