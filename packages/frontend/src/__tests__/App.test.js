import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';
import taskService from '../services/taskService';

jest.mock('../services/taskService');

describe('App', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders task manager header', async () => {
    taskService.getAll.mockResolvedValue([]);

    render(<App />);

    expect(screen.getByText('Task Manager')).toBeInTheDocument();
    expect(screen.getByText('My Tasks')).toBeInTheDocument();
  });

  it('displays loading state initially', () => {
    taskService.getAll.mockImplementation(() => new Promise(() => {}));

    render(<App />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('displays tasks when loaded', async () => {
    const mockTasks = [
      {
        id: 1,
        title: 'Test Task 1',
        description: 'Description 1',
        completed: 0,
        priority: 'high',
        due_date: '2026-02-15',
      },
      {
        id: 2,
        title: 'Test Task 2',
        description: 'Description 2',
        completed: 1,
        priority: 'low',
        due_date: '2026-02-15',
      },
    ];

    taskService.getAll.mockResolvedValue(mockTasks);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
      expect(screen.getByText('Test Task 2')).toBeInTheDocument();
    });
  });

  it('displays empty state when no tasks', async () => {
    taskService.getAll.mockResolvedValue([]);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('No tasks found')).toBeInTheDocument();
    });
  });

  it('has accessible add task button', async () => {
    taskService.getAll.mockResolvedValue([]);

    render(<App />);

    await waitFor(() => {
      const addButton = screen.getByLabelText('Add new task');
      expect(addButton).toBeInTheDocument();
    });
  });
});
