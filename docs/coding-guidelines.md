# Coding Guidelines

## Overview
This document outlines the coding standards and best practices for the task management application. All code contributions must adhere to these guidelines to ensure consistency, maintainability, and quality across the codebase.

## General Principles

### Code Quality Standards
- **Readability First**: Write code that is easy to read and understand
- **Consistency**: Follow established patterns and conventions throughout the codebase
- **Simplicity**: Prefer simple, straightforward solutions over complex ones
- **Maintainability**: Write code that is easy to modify and extend

### DRY Principle (Don't Repeat Yourself)
- **Avoid Code Duplication**: Extract repeated code into reusable functions or components
- **Create Abstractions**: Identify common patterns and create shared utilities
- **Reuse Components**: Build modular, reusable components instead of duplicating UI code
- **Share Logic**: Move business logic to services or utility functions for reuse across components

#### Example: Before DRY
```javascript
// ❌ Duplicated code
function formatUserName(user) {
  return `${user.firstName} ${user.lastName}`;
}

function formatAuthorName(author) {
  return `${author.firstName} ${author.lastName}`;
}
```

#### Example: After DRY
```javascript
// ✅ Reusable function
function formatFullName(person) {
  return `${person.firstName} ${person.lastName}`;
}
```

### KISS Principle (Keep It Simple, Stupid)
- Avoid over-engineering solutions
- Choose clarity over cleverness
- Break complex problems into smaller, manageable pieces
- Prefer explicit code over implicit behavior

### YAGNI Principle (You Aren't Gonna Need It)
- Don't add functionality until it's needed
- Avoid premature optimization
- Build features based on actual requirements, not speculation
- Refactor when new requirements emerge

## Code Formatting

### General Formatting Rules
- **Indentation**: Use 2 spaces for indentation (no tabs)
- **Line Length**: Maximum 100 characters per line (prefer 80)
- **Semicolons**: Always use semicolons in JavaScript
- **Trailing Commas**: Use trailing commas in multi-line arrays and objects
- **Quotes**: Use single quotes for strings (except in JSX where double quotes are preferred)
- **Whitespace**: Add whitespace for readability, but avoid excessive blank lines

#### Example
```javascript
const task = {
  id: 1,
  title: 'Example Task',
  priority: 'high',
  dueDate: '2026-02-01',
};

function createTask(data) {
  const newTask = {
    ...data,
    id: generateId(),
    createdAt: new Date(),
  };
  
  return newTask;
}
```

### Naming Conventions

#### Variables and Functions
- **camelCase**: Use camelCase for variables and functions
- **Descriptive Names**: Use meaningful, descriptive names
- **Avoid Abbreviations**: Prefer full words over abbreviations (unless widely known)
- **Boolean Prefixes**: Prefix boolean variables with `is`, `has`, `should`, `can`

```javascript
// ✅ Good
const taskList = [];
const isCompleted = true;
const hasDeadline = false;
function calculateDueDate() {}

// ❌ Bad
const tl = [];
const completed = true;
function calc() {}
```

#### Constants
- **UPPER_SNAKE_CASE**: Use UPPER_SNAKE_CASE for constants
- **Group Related Constants**: Use objects to group related constants

```javascript
const MAX_TASK_TITLE_LENGTH = 100;
const DEFAULT_PRIORITY = 'medium';

const TASK_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
};
```

#### Components (React)
- **PascalCase**: Use PascalCase for React components
- **Descriptive Names**: Component names should describe what they render

```javascript
// ✅ Good
function TaskList() {}
function TaskEditDialog() {}

// ❌ Bad
function taskList() {}
function Dialog() {}
```

#### Files and Directories
- **camelCase**: Use camelCase for JavaScript/React files
- **PascalCase**: Use PascalCase for component files
- **kebab-case**: Use kebab-case for directories (optional)

```
src/
  components/
    TaskList.js
    TaskEditDialog.js
  services/
    taskService.js
    apiClient.js
  utils/
    dateFormatter.js
```

## Import Organization

### Import Order
Organize imports in the following order:
1. External libraries (React, third-party packages)
2. Internal absolute imports (services, utils)
3. Relative imports (local components, styles)
4. CSS/Style imports

Add a blank line between each group.

#### Example
```javascript
// 1. External libraries
import React, { useState, useEffect } from 'react';
import { Button, TextField } from '@mui/material';
import axios from 'axios';

// 2. Internal absolute imports
import { taskService } from '../services/taskService';
import { formatDate } from '../utils/dateFormatter';

// 3. Relative imports
import TaskList from './TaskList';
import TaskEditDialog from './TaskEditDialog';

// 4. Styles
import './App.css';
```

### Import Best Practices
- **Named Imports**: Prefer named imports over default imports when possible
- **Destructuring**: Destructure imports to only import what you need
- **Avoid Wildcards**: Avoid wildcard imports (`import * as`)
- **Sort Alphabetically**: Within each group, sort imports alphabetically

```javascript
// ✅ Good
import { useState, useEffect } from 'react';
import { Button, TextField, Card } from '@mui/material';

// ❌ Bad
import * as React from 'react';
import { TextField, Button, Card } from '@mui/material';
```

## Linter Usage

### ESLint Configuration
- **Mandatory**: All code must pass ESLint checks before committing
- **Standard Rules**: Use ESLint with recommended rules
- **Automatic Fixing**: Use `eslint --fix` to automatically fix formatting issues
- **Pre-commit Hooks**: Configure pre-commit hooks to run ESLint

### Required ESLint Rules
```json
{
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended"
  ],
  "rules": {
    "no-console": "warn",
    "no-unused-vars": "error",
    "semi": ["error", "always"],
    "quotes": ["error", "single"],
    "indent": ["error", 2],
    "comma-dangle": ["error", "always-multiline"]
  }
}
```

### Prettier Configuration
- **Code Formatter**: Use Prettier for consistent code formatting
- **Integration**: Configure Prettier to work with ESLint
- **Format on Save**: Enable format on save in your editor

```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2
}
```

### Running Linters
```bash
# Run ESLint
npm run lint

# Fix auto-fixable issues
npm run lint:fix

# Format with Prettier
npm run format
```

## JavaScript Best Practices

### Variable Declarations
- **const by Default**: Use `const` for variables that won't be reassigned
- **let for Reassignment**: Use `let` only when reassignment is needed
- **Avoid var**: Never use `var`

```javascript
// ✅ Good
const API_URL = 'https://api.example.com';
let counter = 0;
counter += 1;

// ❌ Bad
var apiUrl = 'https://api.example.com';
```

### Functions
- **Arrow Functions**: Prefer arrow functions for callbacks and short functions
- **Named Functions**: Use named functions for better stack traces
- **Single Responsibility**: Functions should do one thing well
- **Pure Functions**: Prefer pure functions (no side effects) when possible

```javascript
// ✅ Good
const calculateTotal = (items) => {
  return items.reduce((sum, item) => sum + item.price, 0);
};

// Named function for better debugging
function handleTaskCreation(taskData) {
  validateTask(taskData);
  return taskService.create(taskData);
}

// ❌ Bad
function doEverything(data) {
  // 100 lines of code doing multiple things
}
```

### Async/Await
- **Prefer async/await**: Use async/await over promises when possible
- **Error Handling**: Always use try/catch with async/await
- **Avoid Promise Chains**: Avoid deeply nested promise chains

```javascript
// ✅ Good
async function fetchTasks() {
  try {
    const response = await taskService.getAll();
    return response.data;
  } catch (error) {
    console.error('Failed to fetch tasks:', error);
    throw error;
  }
}

// ❌ Bad
function fetchTasks() {
  return taskService.getAll()
    .then(response => response.data)
    .catch(error => {
      console.error(error);
    });
}
```

### Object and Array Operations
- **Destructuring**: Use destructuring for cleaner code
- **Spread Operator**: Use spread operator for copying and merging
- **Array Methods**: Prefer array methods (map, filter, reduce) over loops

```javascript
// ✅ Good - Destructuring
const { title, priority, dueDate } = task;

// ✅ Good - Spread operator
const updatedTask = { ...task, completed: true };
const allTasks = [...existingTasks, newTask];

// ✅ Good - Array methods
const completedTasks = tasks.filter(task => task.completed);
const taskTitles = tasks.map(task => task.title);

// ❌ Bad
const title = task.title;
const priority = task.priority;
const updatedTask = Object.assign({}, task, { completed: true });
```

### Error Handling
- **Specific Errors**: Catch specific errors when possible
- **Meaningful Messages**: Provide clear, actionable error messages
- **Log Errors**: Always log errors for debugging
- **User-Friendly**: Show user-friendly error messages to end users

```javascript
async function deleteTask(taskId) {
  try {
    await taskService.delete(taskId);
    showSuccessMessage('Task deleted successfully');
  } catch (error) {
    console.error('Failed to delete task:', error);
    
    if (error.response?.status === 404) {
      showErrorMessage('Task not found');
    } else {
      showErrorMessage('Failed to delete task. Please try again.');
    }
  }
}
```

## React Best Practices

### Component Structure
- **Functional Components**: Use functional components with hooks
- **Small Components**: Keep components small and focused
- **Component Order**: Follow consistent component structure

```javascript
// ✅ Good component structure
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

function TaskList({ tasks, onTaskSelect }) {
  // 1. Hooks
  const [selectedTask, setSelectedTask] = useState(null);
  
  // 2. Side effects
  useEffect(() => {
    // Effect logic
  }, [tasks]);
  
  // 3. Event handlers
  const handleTaskClick = (task) => {
    setSelectedTask(task);
    onTaskSelect?.(task);
  };
  
  // 4. Render helpers
  const renderTask = (task) => {
    return <div key={task.id}>{task.title}</div>;
  };
  
  // 5. Return JSX
  return (
    <div>
      {tasks.map(renderTask)}
    </div>
  );
}

// 6. PropTypes
TaskList.propTypes = {
  tasks: PropTypes.array.isRequired,
  onTaskSelect: PropTypes.func,
};

export default TaskList;
```

### Hooks Best Practices
- **Rules of Hooks**: Always follow the Rules of Hooks
- **Custom Hooks**: Extract complex logic into custom hooks
- **Dependency Arrays**: Always specify dependency arrays correctly
- **useCallback**: Use `useCallback` for functions passed as props

```javascript
// ✅ Custom hook
function useTaskList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    loadTasks();
  }, []);
  
  const loadTasks = async () => {
    setLoading(true);
    try {
      const data = await taskService.getAll();
      setTasks(data);
    } finally {
      setLoading(false);
    }
  };
  
  return { tasks, loading, refreshTasks: loadTasks };
}
```

### Props and PropTypes
- **Type Checking**: Always define PropTypes for components
- **Required Props**: Mark required props explicitly
- **Default Props**: Provide default values when appropriate
- **Destructure Props**: Destructure props in function parameters

```javascript
import PropTypes from 'prop-types';

function TaskCard({ task, onEdit, onDelete, showActions = true }) {
  return (
    <div>
      <h3>{task.title}</h3>
      {showActions && (
        <div>
          <button onClick={() => onEdit(task)}>Edit</button>
          <button onClick={() => onDelete(task.id)}>Delete</button>
        </div>
      )}
    </div>
  );
}

TaskCard.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    completed: PropTypes.bool,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  showActions: PropTypes.bool,
};

export default TaskCard;
```

### State Management
- **Local State**: Keep state as local as possible
- **Lift State Up**: Only lift state when needed by multiple components
- **Immutable Updates**: Always update state immutably
- **Single Source of Truth**: Avoid duplicating state

```javascript
// ✅ Good - Immutable state update
const addTask = (newTask) => {
  setTasks(prevTasks => [...prevTasks, newTask]);
};

const updateTask = (taskId, updates) => {
  setTasks(prevTasks =>
    prevTasks.map(task =>
      task.id === taskId ? { ...task, ...updates } : task
    )
  );
};

// ❌ Bad - Mutating state
const addTask = (newTask) => {
  tasks.push(newTask);
  setTasks(tasks);
};
```

## Backend Best Practices (Node.js/Express)

### Route Handlers
- **Async Handlers**: Use async/await in route handlers
- **Error Handling**: Always handle errors appropriately
- **Validation**: Validate input before processing
- **Response Format**: Use consistent response formats

```javascript
// ✅ Good route handler
router.post('/tasks', async (req, res, next) => {
  try {
    // Validate input
    const { error } = validateTask(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message,
      });
    }
    
    // Process request
    const task = await taskService.create(req.body);
    
    // Send response
    res.status(201).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
});
```

### Middleware
- **Reusable Logic**: Extract common logic into middleware
- **Error Middleware**: Use error handling middleware
- **Async Middleware**: Support async operations in middleware

```javascript
// ✅ Good middleware
const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message,
      });
    }
    next();
  };
};

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error',
  });
};
```

## Comments and Documentation

### When to Comment
- **Complex Logic**: Explain non-obvious or complex logic
- **Why, Not What**: Explain why something is done, not what is being done
- **Warnings**: Document potential issues or gotchas
- **TODOs**: Mark areas that need improvement

### Comment Style
```javascript
// ✅ Good comments
// Calculate the due date based on priority (high priority tasks get 3 days, others get 7)
const calculateDueDate = (priority) => {
  const daysToAdd = priority === 'high' ? 3 : 7;
  return addDays(new Date(), daysToAdd);
};

// TODO: Optimize this query for large datasets
const fetchAllTasks = async () => {
  // Implementation
};

// ❌ Bad comments
// This function gets tasks
const getTasks = () => {
  // Loop through tasks
  for (let task of tasks) {
    // Check if completed
    if (task.completed) {
      // Do something
    }
  }
};
```

### JSDoc for Functions
- Use JSDoc for public APIs and utility functions
- Document parameters and return values
- Include usage examples when helpful

```javascript
/**
 * Creates a new task with the provided data
 * @param {Object} taskData - The task data
 * @param {string} taskData.title - The task title
 * @param {string} [taskData.priority='medium'] - The task priority
 * @returns {Promise<Object>} The created task
 * @throws {ValidationError} If task data is invalid
 */
async function createTask(taskData) {
  // Implementation
}
```

## Performance Considerations

### Optimization Guidelines
- **Premature Optimization**: Avoid premature optimization
- **Measure First**: Profile before optimizing
- **React Optimization**: Use React.memo, useMemo, useCallback when needed
- **Bundle Size**: Monitor and optimize bundle size

### React Performance
```javascript
// ✅ Memoize expensive calculations
const sortedTasks = useMemo(() => {
  return tasks.sort((a, b) => a.priority - b.priority);
}, [tasks]);

// ✅ Memoize callbacks
const handleTaskClick = useCallback((taskId) => {
  setSelectedTaskId(taskId);
}, []);

// ✅ Memoize components
const TaskCard = React.memo(({ task, onClick }) => {
  return <div onClick={() => onClick(task.id)}>{task.title}</div>;
});
```

## Security Best Practices

### Input Validation
- **Validate All Input**: Never trust user input
- **Sanitize Data**: Sanitize input to prevent XSS
- **Type Checking**: Validate data types and formats

### API Security
- **Authentication**: Implement proper authentication
- **Authorization**: Check permissions for all operations
- **Rate Limiting**: Implement rate limiting on APIs
- **CORS**: Configure CORS properly

### Sensitive Data
- **No Secrets in Code**: Never commit secrets or API keys
- **Environment Variables**: Use environment variables for configuration
- **Logging**: Don't log sensitive information

## Git and Version Control

### Commit Messages
- **Clear Messages**: Write clear, descriptive commit messages
- **Present Tense**: Use present tense ("Add feature" not "Added feature")
- **Atomic Commits**: Make small, focused commits

```
✅ Good commit messages:
- Add task filtering by priority
- Fix due date validation error
- Refactor TaskList component for better performance
- Update API endpoint to handle pagination

❌ Bad commit messages:
- fix
- update stuff
- WIP
- final changes
```

### Branch Naming
- **Descriptive Names**: Use descriptive branch names
- **Convention**: Follow a consistent naming convention

```
feature/task-filtering
bugfix/due-date-validation
refactor/task-service
hotfix/api-timeout
```

## Code Review Guidelines

### Before Submitting
- All tests pass
- Code follows style guidelines
- No linter errors
- Documentation is updated
- Self-review completed

### Reviewing Code
- Check for logic errors
- Verify test coverage
- Ensure code follows guidelines
- Provide constructive feedback
- Approve only when ready to merge
