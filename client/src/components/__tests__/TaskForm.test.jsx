import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskForm from '../TaskForm';

// Mock functions
const mockOnAdd = jest.fn();
const mockOnUpdate = jest.fn();
const mockSetTitle = jest.fn();
const mockSetDescription = jest.fn();
const mockCancelEdit = jest.fn();
const mockValidateForm = jest.fn();

const defaultProps = {
  onAdd: mockOnAdd,
  onUpdate: mockOnUpdate,
  setTitle: mockSetTitle,
  setDescription: mockSetDescription,
  title: '',
  description: '',
  cancelEdit: mockCancelEdit,
  errors: [],
  validateForm: mockValidateForm
};

describe('TaskForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    test('renders the form with correct title', () => {
      render(<TaskForm {...defaultProps} />);
      expect(screen.getByText('Add a Task')).toBeInTheDocument();
    });

    test('renders title and description inputs', () => {
      render(<TaskForm {...defaultProps} />);
      expect(screen.getByPlaceholderText('Title')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Description')).toBeInTheDocument();
    });

    test('renders Add button when not editing', () => {
      render(<TaskForm {...defaultProps} />);
      expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Update' })).not.toBeInTheDocument();
    });

    test('renders Update and Cancel buttons when editing', () => {
      const editingProps = {
        ...defaultProps,
        editingTask: { id: 1, title: 'Test Task', description: 'Test Description' },
        title: 'Test Task',
        description: 'Test Description'
      };
      render(<TaskForm {...editingProps} />);
      expect(screen.getByRole('button', { name: 'Update' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Add' })).not.toBeInTheDocument();
    });
  });

  describe('Form Input Handling', () => {
    test('calls setTitle when title input changes', async () => {
      render(<TaskForm {...defaultProps} />);
      
      const titleInput = screen.getByPlaceholderText('Title');
      fireEvent.change(titleInput, { target: { value: 'New Task' } });
      
      expect(mockSetTitle).toHaveBeenCalledWith('New Task');
    });

    test('calls setDescription when description input changes', async () => {
      render(<TaskForm {...defaultProps} />);
      
      const descriptionInput = screen.getByPlaceholderText('Description');
      fireEvent.change(descriptionInput, { target: { value: 'New Description' } });
      
      expect(mockSetDescription).toHaveBeenCalledWith('New Description');
    });

    test('displays current title and description values', () => {
      const propsWithValues = {
        ...defaultProps,
        title: 'Current Title',
        description: 'Current Description'
      };
      render(<TaskForm {...propsWithValues} />);
      
      expect(screen.getByDisplayValue('Current Title')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Current Description')).toBeInTheDocument();
    });
  });

  describe('Form Submission', () => {
    test('calls onAdd with trimmed values when adding new task', async () => {
      const user = userEvent.setup();
      mockValidateForm.mockReturnValue(true);
      
      const propsWithValues = {
        ...defaultProps,
        title: '  Test Task  ',
        description: '  Test Description  '
      };
      render(<TaskForm {...propsWithValues} />);
      
      const submitButton = screen.getByRole('button', { name: 'Add' });
      await user.click(submitButton);
      
      expect(mockValidateForm).toHaveBeenCalled();
      expect(mockOnAdd).toHaveBeenCalledWith({
        title: 'Test Task',
        description: 'Test Description'
      });
    });

    test('calls onUpdate with trimmed values when editing task', async () => {
      const user = userEvent.setup();
      mockValidateForm.mockReturnValue(true);
      
      const editingProps = {
        ...defaultProps,
        editingTask: { id: 1, title: 'Old Task', description: 'Old Description' },
        title: '  Updated Task  ',
        description: '  Updated Description  '
      };
      render(<TaskForm {...editingProps} />);
      
      const submitButton = screen.getByRole('button', { name: 'Update' });
      await user.click(submitButton);
      
      expect(mockValidateForm).toHaveBeenCalled();
      expect(mockOnUpdate).toHaveBeenCalledWith(1, {
        title: 'Updated Task',
        description: 'Updated Description'
      });
    });

    test('does not submit if validation fails', async () => {
      const user = userEvent.setup();
      mockValidateForm.mockReturnValue(false);
      
      render(<TaskForm {...defaultProps} />);
      
      const submitButton = screen.getByRole('button', { name: 'Add' });
      await user.click(submitButton);
      
      expect(mockValidateForm).toHaveBeenCalled();
      expect(mockOnAdd).not.toHaveBeenCalled();
    });
  });

  describe('Cancel Edit', () => {
    test('calls cancelEdit when cancel button is clicked', async () => {
      const user = userEvent.setup();
      const editingProps = {
        ...defaultProps,
        editingTask: { id: 1, title: 'Test Task', description: 'Test Description' },
        title: 'Test Task',
        description: 'Test Description'
      };
      render(<TaskForm {...editingProps} />);
      
      const cancelButton = screen.getByRole('button', { name: 'Cancel' });
      await user.click(cancelButton);
      
      expect(mockCancelEdit).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    test('displays title error when title is required', () => {
      const propsWithErrors = {
        ...defaultProps,
        errors: ['Title is required'],
        title: ''
      };
      render(<TaskForm {...propsWithErrors} />);
      
      expect(screen.getByText('Title is required')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Title is required')).toBeInTheDocument();
    });

    test('displays description error when description is required', () => {
      const propsWithErrors = {
        ...defaultProps,
        errors: ['Description is required'],
        description: ''
      };
      render(<TaskForm {...propsWithErrors} />);
      
      expect(screen.getByText('Description is required')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Description is required')).toBeInTheDocument();
    });

    test('displays other errors in error box', () => {
      const propsWithErrors = {
        ...defaultProps,
        errors: ['Some other error', 'Another error']
      };
      render(<TaskForm {...propsWithErrors} />);
      
      expect(screen.getByText('Some other error')).toBeInTheDocument();
      expect(screen.getByText('Another error')).toBeInTheDocument();
    });

    test('applies error styling to inputs with errors', () => {
      const propsWithErrors = {
        ...defaultProps,
        errors: ['Title is required'],
        title: ''
      };
      render(<TaskForm {...propsWithErrors} />);
      
      const titleInput = screen.getByPlaceholderText('Title is required');
      expect(titleInput).toHaveClass('border-red-500');
    });

    test('applies normal styling to inputs without errors', () => {
      render(<TaskForm {...defaultProps} />);
      
      const titleInput = screen.getByPlaceholderText('Title');
      const descriptionInput = screen.getByPlaceholderText('Description');
      
      expect(titleInput).toHaveClass('border-blue-500');
      expect(descriptionInput).toHaveClass('border-blue-500');
    });
  });

  describe('Accessibility', () => {
    test('form has proper structure', () => {
      const { container } = render(<TaskForm {...defaultProps} />);
      
      const form = container.querySelector('form');
      expect(form).toBeInTheDocument();
    });

    test('inputs have proper labels and placeholders', () => {
      render(<TaskForm {...defaultProps} />);
      
      const titleInput = screen.getByPlaceholderText('Title');
      const descriptionInput = screen.getByPlaceholderText('Description');
      
      expect(titleInput).toBeInTheDocument();
      expect(descriptionInput).toBeInTheDocument();
    });
  });
}); 