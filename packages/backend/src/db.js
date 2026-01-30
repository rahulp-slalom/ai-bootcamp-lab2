const Database = require('better-sqlite3');

// Initialize in-memory SQLite database
const db = new Database(':memory:');

// Create tasks table with full schema
db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    completed INTEGER DEFAULT 0,
    priority TEXT DEFAULT 'medium' CHECK(priority IN ('low', 'medium', 'high')),
    due_date TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);

// Insert sample tasks
const sampleTasks = [
  {
    title: 'Complete project documentation',
    description: 'Write comprehensive documentation for the task management system',
    priority: 'high',
    due_date: '2026-02-05',
    completed: 0,
  },
  {
    title: 'Review pull requests',
    description: 'Review and merge pending pull requests from team members',
    priority: 'medium',
    due_date: '2026-02-02',
    completed: 0,
  },
  {
    title: 'Update dependencies',
    description: 'Update all npm packages to latest stable versions',
    priority: 'low',
    due_date: '2026-02-10',
    completed: 0,
  },
  {
    title: 'Fix login bug',
    description: 'Resolve authentication issue reported by users',
    priority: 'high',
    due_date: '2026-01-31',
    completed: 1,
  },
  {
    title: 'Design new landing page',
    description: 'Create mockups for the new landing page redesign',
    priority: 'medium',
    due_date: '2026-02-15',
    completed: 0,
  },
];

const insertStmt = db.prepare(`
  INSERT INTO tasks (title, description, priority, due_date, completed)
  VALUES (@title, @description, @priority, @due_date, @completed)
`);

sampleTasks.forEach((task) => {
  insertStmt.run(task);
});

console.log('Database initialized with sample tasks');

/**
 * Get all tasks with optional filtering and sorting
 * @param {Object} options - Query options
 * @param {string} options.status - Filter by completion status ('all', 'active', 'completed')
 * @param {string} options.priority - Filter by priority level
 * @param {string} options.sortBy - Sort field (due_date, priority, created_at, title)
 * @param {string} options.sortOrder - Sort direction (asc, desc)
 * @returns {Array} Array of tasks
 */
function getAllTasks(options = {}) {
  const { status, priority, sortBy = 'created_at', sortOrder = 'desc' } = options;

  let query = 'SELECT * FROM tasks WHERE 1=1';
  const params = [];

  if (status === 'active') {
    query += ' AND completed = 0';
  } else if (status === 'completed') {
    query += ' AND completed = 1';
  }

  if (priority) {
    query += ' AND priority = ?';
    params.push(priority);
  }

  const validSortFields = ['due_date', 'priority', 'created_at', 'title', 'updated_at'];
  const sortField = validSortFields.includes(sortBy) ? sortBy : 'created_at';
  const sortDirection = sortOrder === 'asc' ? 'ASC' : 'DESC';

  query += ` ORDER BY ${sortField} ${sortDirection}`;

  const stmt = db.prepare(query);
  return stmt.all(...params);
}

/**
 * Get a single task by ID
 * @param {number} id - Task ID
 * @returns {Object|undefined} Task object or undefined if not found
 */
function getTaskById(id) {
  const stmt = db.prepare('SELECT * FROM tasks WHERE id = ?');
  return stmt.get(id);
}

/**
 * Create a new task
 * @param {Object} taskData - Task data
 * @returns {Object} Created task
 */
function createTask(taskData) {
  const { title, description = null, priority = 'medium', due_date = null } = taskData;

  const stmt = db.prepare(`
    INSERT INTO tasks (title, description, priority, due_date)
    VALUES (?, ?, ?, ?)
  `);

  const result = stmt.run(title, description, priority, due_date);
  return getTaskById(result.lastInsertRowid);
}

/**
 * Update an existing task
 * @param {number} id - Task ID
 * @param {Object} updates - Fields to update
 * @returns {Object|null} Updated task or null if not found
 */
function updateTask(id, updates) {
  const task = getTaskById(id);
  if (!task) return null;

  const allowedFields = ['title', 'description', 'priority', 'due_date', 'completed'];
  const fields = [];
  const values = [];

  Object.keys(updates).forEach((key) => {
    if (allowedFields.includes(key)) {
      fields.push(`${key} = ?`);
      values.push(updates[key]);
    }
  });

  if (fields.length === 0) return task;

  fields.push('updated_at = CURRENT_TIMESTAMP');
  values.push(id);

  const stmt = db.prepare(`
    UPDATE tasks
    SET ${fields.join(', ')}
    WHERE id = ?
  `);

  stmt.run(...values);
  return getTaskById(id);
}

/**
 * Toggle task completion status
 * @param {number} id - Task ID
 * @returns {Object|null} Updated task or null if not found
 */
function toggleTaskCompletion(id) {
  const task = getTaskById(id);
  if (!task) return null;

  const newStatus = task.completed === 1 ? 0 : 1;
  return updateTask(id, { completed: newStatus });
}

/**
 * Delete a task
 * @param {number} id - Task ID
 * @returns {boolean} True if deleted, false if not found
 */
function deleteTask(id) {
  const stmt = db.prepare('DELETE FROM tasks WHERE id = ?');
  const result = stmt.run(id);
  return result.changes > 0;
}

module.exports = {
  db,
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  toggleTaskCompletion,
  deleteTask,
};
