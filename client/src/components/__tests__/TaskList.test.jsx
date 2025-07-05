import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskList from '../TaskList';
import { TASK_STATUSES } from '../../constants/taskConstants';

// Mock the TaskItem component
jest.mock('../TaskItem', () => {
  return function MockTaskItem({ task, onComplete, onEdit, onDelete, onRestore, onPermanentDelete }) {
    return (
      <div data-testid={`task-item-${task.id}`}>
        <span>{task.title}</span>
        <button onClick={() => onComplete(task.id)}>Complete</button>
        <button onClick={() => onEdit(task.id)}>Edit</button>
        <button onClick={() => onDelete(task.id)}>Delete</button>
        <button onClick={() => onRestore(task.id)}>Restore</button>
        <button onClick={() => onPermanentDelete(task.id)}>Permanent Delete</button>
      </div>
    );
  };
});

// Mock the LoadingSpinner component
jest.mock('../LoadingSpinner', () => {
  return function MockLoadingSpinner({ size, text }) {
    return <div data-testid="loading-spinner">{text}</div>;
  };
});

const mockTasks = [
  { id: 1, title: 'Active Task 1', description: 'Description 1', status: TASK_STATUSES.ACTIVE },
  { id: 2, title: 'Active Task 2', description: 'Description 2', status: TASK_STATUSES.ACTIVE },
  { id: 3, title: 'Completed Task 1', description: 'Description 3', status: TASK_STATUSES.COMPLETED },
  { id: 4, title: 'Completed Task 2', description: 'Description 4', status: TASK_STATUSES.COMPLETED },
  { id: 5, title: 'Deleted Task 1', description: 'Description 5', status: TASK_STATUSES.DELETED },
  { id: 6, title: 'Active Task 3', description: 'Description 6', status: TASK_STATUSES.ACTIVE },
  { id: 7, title: 'Active Task 4', description: 'Description 7', status: TASK_STATUSES.ACTIVE },
  { id: 8, title: 'Active Task 5', description: 'Description 8', status: TASK_STATUSES.ACTIVE },
  { id: 9, title: 'Active Task 6', description: 'Description 9', status: TASK_STATUSES.ACTIVE },
  { id: 10, title: 'Active Task 7', description: 'Description 10', status: TASK_STATUSES.ACTIVE },
  { id: 11, title: 'Active Task 8', description: 'Description 11', status: TASK_STATUSES.ACTIVE }
];

const mockHandlers = {
  onComplete: jest.fn(),
  onEdit: jest.fn(),
  onDelete: jest.fn(),
  onRestore: jest.fn(),
  onPermanentDelete: jest.fn()
};

const defaultProps = {
  tasks: mockTasks,
  currentTab: 'active',
  loading: false,
  ...mockHandlers
};

describe('TaskList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Loading State', () => {
    test('shows loading spinner when loading is true', () => {
      render(<TaskList {...defaultProps} loading={true} />);
      
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
      expect(screen.getByText('Loading tasks...')).toBeInTheDocument();
    });

    test('does not show loading spinner when loading is false', () => {
      render(<TaskList {...defaultProps} loading={false} />);
      
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    });
  });

  describe('Task Filtering', () => {
    test('filters tasks by active status when currentTab is active', () => {
      render(<TaskList {...defaultProps} currentTab="active" />);
      
      // Should show only active tasks
      expect(screen.getByText('Active Task 1')).toBeInTheDocument();
      expect(screen.getByText('Active Task 2')).toBeInTheDocument();
      expect(screen.queryByText('Completed Task 1')).not.toBeInTheDocument();
      expect(screen.queryByText('Deleted Task 1')).not.toBeInTheDocument();
    });

    test('filters tasks by completed status when currentTab is completed', () => {
      render(<TaskList {...defaultProps} currentTab="completed" />);
      
      // Should show only completed tasks
      expect(screen.getByText('Completed Task 1')).toBeInTheDocument();
      expect(screen.getByText('Completed Task 2')).toBeInTheDocument();
      expect(screen.queryByText('Active Task 1')).not.toBeInTheDocument();
      expect(screen.queryByText('Deleted Task 1')).not.toBeInTheDocument();
    });

    test('filters tasks by deleted status when currentTab is deleted', () => {
      render(<TaskList {...defaultProps} currentTab="deleted" />);
      
      // Should show only deleted tasks
      expect(screen.getByText('Deleted Task 1')).toBeInTheDocument();
      expect(screen.queryByText('Active Task 1')).not.toBeInTheDocument();
      expect(screen.queryByText('Completed Task 1')).not.toBeInTheDocument();
    });

    test('shows all tasks when currentTab is not recognized', () => {
      render(<TaskList {...defaultProps} currentTab="unknown" />);
      
      // Should show all tasks
      expect(screen.getByText('Active Task 1')).toBeInTheDocument();
      expect(screen.getByText('Completed Task 1')).toBeInTheDocument();
      expect(screen.getByText('Deleted Task 1')).toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    test('shows empty message when no tasks match current tab', () => {
      render(<TaskList {...defaultProps} tasks={[]} currentTab="active" />);
      
      expect(screen.getByText('No active tasks yet.')).toBeInTheDocument();
    });

    test('shows empty message for completed tab when no completed tasks', () => {
      render(<TaskList {...defaultProps} tasks={mockTasks.filter(t => t.status !== TASK_STATUSES.COMPLETED)} currentTab="completed" />);
      
      expect(screen.getByText('No completed tasks yet.')).toBeInTheDocument();
    });

    test('shows empty message for deleted tab when no deleted tasks', () => {
      render(<TaskList {...defaultProps} tasks={mockTasks.filter(t => t.status !== TASK_STATUSES.DELETED)} currentTab="deleted" />);
      
      expect(screen.getByText('No deleted tasks yet.')).toBeInTheDocument();
    });
  });

  describe('Pagination', () => {
    test('shows only first 5 tasks initially when more than 5 tasks exist', () => {
      render(<TaskList {...defaultProps} currentTab="active" />);
      
      // Should show first 5 active tasks
      expect(screen.getByText('Active Task 1')).toBeInTheDocument();
      expect(screen.getByText('Active Task 2')).toBeInTheDocument();
      expect(screen.getByText('Active Task 3')).toBeInTheDocument();
      expect(screen.getByText('Active Task 4')).toBeInTheDocument();
      expect(screen.getByText('Active Task 5')).toBeInTheDocument();
      
      // Should not show the 6th task initially
      expect(screen.queryByText('Active Task 6')).not.toBeInTheDocument();
    });

    test('shows "Show More" button when more than 5 tasks exist', () => {
      render(<TaskList {...defaultProps} currentTab="active" />);
      
      expect(screen.getByRole('button', { name: 'Show More' })).toBeInTheDocument();
    });

    test('does not show "Show More" button when 5 or fewer tasks exist', () => {
      const fewTasks = mockTasks.filter(t => t.status === TASK_STATUSES.COMPLETED);
      render(<TaskList {...defaultProps} tasks={fewTasks} currentTab="completed" />);
      
      expect(screen.queryByRole('button', { name: 'Show More' })).not.toBeInTheDocument();
    });

    test('shows all tasks when "Show More" button is clicked', async () => {
      const user = userEvent.setup();
      render(<TaskList {...defaultProps} currentTab="active" />);
      
      const showMoreButton = screen.getByRole('button', { name: 'Show More' });
      await user.click(showMoreButton);
      
      // Should now show all active tasks
      expect(screen.getByText('Active Task 6')).toBeInTheDocument();
      expect(screen.getByText('Active Task 7')).toBeInTheDocument();
      expect(screen.getByText('Active Task 8')).toBeInTheDocument();
      
      // Show More button should disappear
      expect(screen.queryByRole('button', { name: 'Show More' })).not.toBeInTheDocument();
    });
  });

  describe('Task Item Rendering', () => {
    test('renders TaskItem components with correct props', () => {
      render(<TaskList {...defaultProps} currentTab="active" />);
      
      // Check that TaskItem components are rendered
      expect(screen.getByTestId('task-item-1')).toBeInTheDocument();
      expect(screen.getByTestId('task-item-2')).toBeInTheDocument();
    });

    test('passes correct props to TaskItem components', () => {
      render(<TaskList {...defaultProps} currentTab="active" />);
      
      // The mock TaskItem will render buttons that call the handlers
      const completeButton = screen.getAllByText('Complete')[0];
      const editButton = screen.getAllByText('Edit')[0];
      const deleteButton = screen.getAllByText('Delete')[0];
      
      fireEvent.click(completeButton);
      expect(mockHandlers.onComplete).toHaveBeenCalledWith(1);
      
      fireEvent.click(editButton);
      expect(mockHandlers.onEdit).toHaveBeenCalledWith(1);
      
      fireEvent.click(deleteButton);
      expect(mockHandlers.onDelete).toHaveBeenCalledWith(1);
    });

    test('passes restore and permanent delete handlers for deleted tasks', () => {
      render(<TaskList {...defaultProps} currentTab="deleted" />);
      
      const restoreButton = screen.getByText('Restore');
      const permanentDeleteButton = screen.getByText('Permanent Delete');
      
      fireEvent.click(restoreButton);
      expect(mockHandlers.onRestore).toHaveBeenCalledWith(5);
      
      fireEvent.click(permanentDeleteButton);
      expect(mockHandlers.onPermanentDelete).toHaveBeenCalledWith(5);
    });
  });

}); 