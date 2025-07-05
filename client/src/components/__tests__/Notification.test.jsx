import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import Notification from '../Notification';

jest.useFakeTimers();

const mockOnClose = jest.fn();

const defaultProps = {
  message: 'Test notification message',
  type: 'success',
  onClose: mockOnClose,
  autoClose: true
};

describe('Notification', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  describe('Rendering', () => {
    test('renders notification with message', () => {
      render(<Notification {...defaultProps} />);
      
      expect(screen.getByText('Test notification message')).toBeInTheDocument();
    });

    test('does not render when message is empty', () => {
      render(<Notification {...defaultProps} message="" />);
      
      expect(screen.queryByText('Test notification message')).not.toBeInTheDocument();
    });

    test('does not render when message is null', () => {
      render(<Notification {...defaultProps} message={null} />);
      
      expect(screen.queryByText('Test notification message')).not.toBeInTheDocument();
    });

    test('renders close button', () => {
      render(<Notification {...defaultProps} />);
      
      const closeButton = screen.getByRole('button');
      expect(closeButton).toBeInTheDocument();
    });

    test('renders with correct base styles', () => {
      render(<Notification {...defaultProps} />);
      const notification = screen.getByText('Test notification message').closest('div').parentElement.parentElement;
      expect(notification).toHaveClass('fixed');
      expect(notification).toHaveClass('top-4');
      expect(notification).toHaveClass('right-4');
      expect(notification).toHaveClass('z-50');
      expect(notification).toHaveClass('p-4');
      expect(notification).toHaveClass('rounded-lg');
      expect(notification).toHaveClass('shadow-lg');
      expect(notification).toHaveClass('max-w-sm');
    });
  });

  describe('Notification Types', () => {
    test('renders success notification with correct styling', () => {
      render(<Notification {...defaultProps} type="success" />);
      const notification = screen.getByText('Test notification message').closest('div').parentElement.parentElement;
      expect(notification).toHaveClass('bg-green-500');
      expect(notification).toHaveClass('text-white');
      expect(notification).toHaveClass('border-green-600');
    });

    test('renders error notification with correct styling', () => {
      render(<Notification {...defaultProps} type="error" />);
      const notification = screen.getByText('Test notification message').closest('div').parentElement.parentElement;
      expect(notification).toHaveClass('bg-red-500');
      expect(notification).toHaveClass('text-white');
      expect(notification).toHaveClass('border-red-600');
    });

    test('renders default notification with correct styling when type is not specified', () => {
      render(<Notification {...defaultProps} type="info" />);
      const notification = screen.getByText('Test notification message').closest('div').parentElement.parentElement;
      expect(notification).toHaveClass('bg-blue-500');
      expect(notification).toHaveClass('text-white');
      expect(notification).toHaveClass('border-blue-600');
    });

    test('renders default notification with correct styling when type is unknown', () => {
      render(<Notification {...defaultProps} type="unknown" />);
      const notification = screen.getByText('Test notification message').closest('div').parentElement.parentElement;
      expect(notification).toHaveClass('bg-blue-500');
      expect(notification).toHaveClass('text-white');
      expect(notification).toHaveClass('border-blue-600');
    });
  });

  describe('Icons', () => {
    test('renders success icon for success type', () => {
      render(<Notification {...defaultProps} type="success" />);
      const icon = screen.getByText('Test notification message').closest('div').querySelector('svg');
      expect(icon).toBeInTheDocument();
    });

    test('renders error icon for error type', () => {
      render(<Notification {...defaultProps} type="error" />);
      const icon = screen.getByText('Test notification message').closest('div').querySelector('svg');
      expect(icon).toBeInTheDocument();
    });

    test('renders info icon for info type', () => {
      render(<Notification {...defaultProps} type="info" />);
      const icon = screen.getByText('Test notification message').closest('div').querySelector('svg');
      expect(icon).toBeInTheDocument();
    });
  });

  describe('Auto-Close Functionality', () => {
    test('calls onClose after 3 seconds when autoClose is true', () => {
      render(<Notification {...defaultProps} autoClose={true} />);
      
      // Fast-forward time by 3 seconds
      act(() => {
        jest.advanceTimersByTime(3000);
      });
      
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    test('does not auto-close when autoClose is false', () => {
      render(<Notification {...defaultProps} autoClose={false} />);
      
      // Fast-forward time by 3 seconds
      act(() => {
        jest.advanceTimersByTime(3000);
      });
      
      expect(mockOnClose).not.toHaveBeenCalled();
    });

    test('does not auto-close when message is empty', () => {
      render(<Notification {...defaultProps} message="" autoClose={true} />);
      
      // Fast-forward time by 3 seconds
      act(() => {
        jest.advanceTimersByTime(3000);
      });
      
      expect(mockOnClose).not.toHaveBeenCalled();
    });

    test('clears timer when component unmounts', () => {
      const { unmount } = render(<Notification {...defaultProps} autoClose={true} />);
      
      // Unmount before timer completes
      unmount();
      
      // Fast-forward time by 3 seconds
      act(() => {
        jest.advanceTimersByTime(3000);
      });
      
      expect(mockOnClose).not.toHaveBeenCalled();
    });

    test('resets timer when message changes', () => {
      const { rerender } = render(<Notification {...defaultProps} autoClose={true} />);
      
      // Fast-forward time by 1 second
      act(() => {
        jest.advanceTimersByTime(1000);
      });
      
      // Change message
      rerender(<Notification {...defaultProps} message="New message" autoClose={true} />);
      
      // Fast-forward time by 1 second (should not trigger close yet)
      act(() => {
        jest.advanceTimersByTime(1000);
      });
      
      expect(mockOnClose).not.toHaveBeenCalled();
      
      // Fast-forward time by 2 more seconds (total 3 seconds from message change)
      act(() => {
        jest.advanceTimersByTime(2000);
      });
      
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Manual Close', () => {
    test('calls onClose when close button is clicked', async () => {
      render(<Notification {...defaultProps} />);
      const closeButton = screen.getByRole('button');
      fireEvent.click(closeButton);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    test('close button has correct styling', () => {
      render(<Notification {...defaultProps} />);
      
      const closeButton = screen.getByRole('button');
      expect(closeButton).toHaveClass('ml-4', 'text-white', 'hover:text-gray-200', 'focus:outline-none');
    });
  });

  describe('Accessibility', () => {
    test('close button is keyboard accessible', () => {
      render(<Notification {...defaultProps} />);
      
      const closeButton = screen.getByRole('button');
      expect(closeButton).toBeEnabled();
    });

    test('notification has proper structure', () => {
      render(<Notification {...defaultProps} />);
      
      const notification = screen.getByText('Test notification message').closest('div');
      expect(notification).toBeInTheDocument();
    });
  });

  describe('Animation and Transitions', () => {
    test('has transition classes', () => {
      render(<Notification {...defaultProps} />);
      const notification = screen.getByText('Test notification message').closest('div').parentElement.parentElement;
      expect(notification).toHaveClass('transform');
      expect(notification).toHaveClass('transition-all');
      expect(notification).toHaveClass('duration-300');
      expect(notification).toHaveClass('ease-in-out');
    });
  });

  describe('Edge Cases', () => {
    test('handles very long messages', () => {
      const longMessage = 'A'.repeat(1000);
      render(<Notification {...defaultProps} message={longMessage} />);
      
      expect(screen.getByText(longMessage)).toBeInTheDocument();
    });

    test('handles special characters in message', () => {
      const specialMessage = 'Test message with special chars: !@#$%^&*()_+-=[]{}|;:,.<>?';
      render(<Notification {...defaultProps} message={specialMessage} />);
      
      expect(screen.getByText(specialMessage)).toBeInTheDocument();
    });

    test('handles HTML-like content in message', () => {
      const htmlMessage = 'Test message with <script>alert("xss")</script>';
      render(<Notification {...defaultProps} message={htmlMessage} />);
      
      expect(screen.getByText(htmlMessage)).toBeInTheDocument();
    });
  });
}); 