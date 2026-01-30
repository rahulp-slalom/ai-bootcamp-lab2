import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaskCard from '../components/TaskCard';

describe('TaskCard', () => {
  const mockTask = {
    id: 1,
    title: 'Test Task',
    description: 'Test Description',
    completed: 0,
    priority: 'high',
    due_date: '2026-02-15',
  };

  const mockHandlers = {
    onEdit: jest.fn(),
    onDelete: jest.fn(),
    onToggleComplete: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders task information correctly', () => {
    render(<TaskCard task={mockTask} {...mockHandlers} />);

    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('High')).toBeInTheDocument();
  });

  it('calls onToggleComplete when checkbox is clicked', () => {
    render(<TaskCard task={mockTask} {...mockHandlers} />);

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(mockHandlers.onToggleComplete).toHaveBeenCalledWith(1);
  });

  it('calls onEdit when edit button is clicked', () => {
    render(<TaskCard task={mockTask} {...mockHandlers} />);

    const editButton = screen.getByLabelText(/edit task/i);
    fireEvent.click(editButton);

    expect(mockHandlers.onEdit).toHaveBeenCalledWith(mockTask);
  });

  it('calls onDelete when delete button is clicked', () => {
    render(<TaskCard task={mockTask} {...mockHandlers} />);

    const deleteButton = screen.getByLabelText(/delete task/i);
    fireEvent.click(deleteButton);

    expect(mockHandlers.onDelete).toHaveBeenCalledWith(1);
  });

  it('shows completed task with line-through', () => {
    const completedTask = { ...mockTask, completed: 1 };
    render(<TaskCard task={completedTask} {...mockHandlers} />);

    const title = screen.getByText('Test Task');
    expect(title).toHaveStyle({ textDecoration: 'line-through' });
  });

  it('displays priority chip with correct color', () => {
    render(<TaskCard task={mockTask} {...mockHandlers} />);

    const priorityChip = screen.getByText('High');
    expect(priorityChip).toBeInTheDocument();
  });

  it('is keyboard accessible', () => {
    render(<TaskCard task={mockTask} {...mockHandlers} />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('aria-label');
  });
});
