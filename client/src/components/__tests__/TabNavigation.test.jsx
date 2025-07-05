import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TabNavigation from '../TabNavigation';
import { TABS, TAB_LABELS } from '../../constants/taskConstants';

const mockSetCurrentTab = jest.fn();

const defaultProps = {
  currentTab: 'active',
  setCurrentTab: mockSetCurrentTab
};

describe('TabNavigation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    test('renders all three tabs with correct labels', () => {
      render(<TabNavigation {...defaultProps} />);
      
      expect(screen.getByText(TAB_LABELS[TABS.ACTIVE])).toBeInTheDocument();
      expect(screen.getByText(TAB_LABELS[TABS.COMPLETED])).toBeInTheDocument();
      expect(screen.getByText(TAB_LABELS[TABS.DELETED])).toBeInTheDocument();
    });

    test('renders tabs as buttons', () => {
      render(<TabNavigation {...defaultProps} />);
      
      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(3);
    });

    test('renders with correct container structure', () => {
      render(<TabNavigation {...defaultProps} />);
      
      const container = screen.getByText(TAB_LABELS[TABS.ACTIVE]).closest('div');
      expect(container).toHaveClass('flex', 'gap-2', 'mb-6', 'w-full', 'sticky', 'top-0', 'bg-white', 'z-10', 'py-2');
    });
  });

  describe('Tab Click Handling', () => {
    test('calls setCurrentTab with active tab when active tab is clicked', async () => {
      const user = userEvent.setup();
      render(<TabNavigation {...defaultProps} />);
      
      const activeTab = screen.getByText(TAB_LABELS[TABS.ACTIVE]);
      await user.click(activeTab);
      
      expect(mockSetCurrentTab).toHaveBeenCalledWith(TABS.ACTIVE);
    });

    test('calls setCurrentTab with completed tab when completed tab is clicked', async () => {
      const user = userEvent.setup();
      render(<TabNavigation {...defaultProps} />);
      
      const completedTab = screen.getByText(TAB_LABELS[TABS.COMPLETED]);
      await user.click(completedTab);
      
      expect(mockSetCurrentTab).toHaveBeenCalledWith(TABS.COMPLETED);
    });

    test('calls setCurrentTab with deleted tab when deleted tab is clicked', async () => {
      const user = userEvent.setup();
      render(<TabNavigation {...defaultProps} />);
      
      const deletedTab = screen.getByText(TAB_LABELS[TABS.DELETED]);
      await user.click(deletedTab);
      
      expect(mockSetCurrentTab).toHaveBeenCalledWith(TABS.DELETED);
    });

    test('calls setCurrentTab only once per click', async () => {
      const user = userEvent.setup();
      render(<TabNavigation {...defaultProps} />);
      
      const activeTab = screen.getByText(TAB_LABELS[TABS.ACTIVE]);
      await user.click(activeTab);
      
      expect(mockSetCurrentTab).toHaveBeenCalledTimes(1);
    });
  });

  describe('Active Tab Styling', () => {
    test('applies active styling to current tab', () => {
      render(<TabNavigation {...defaultProps} currentTab="active" />);
      
      const activeTab = screen.getByText(TAB_LABELS[TABS.ACTIVE]);
      expect(activeTab).toHaveClass('bg-blue-600', 'text-white');
    });

    test('applies active styling to completed tab when it is current', () => {
      render(<TabNavigation {...defaultProps} currentTab="completed" />);
      
      const completedTab = screen.getByText(TAB_LABELS[TABS.COMPLETED]);
      expect(completedTab).toHaveClass('bg-blue-600', 'text-white');
    });

    test('applies active styling to deleted tab when it is current', () => {
      render(<TabNavigation {...defaultProps} currentTab="deleted" />);
      
      const deletedTab = screen.getByText(TAB_LABELS[TABS.DELETED]);
      expect(deletedTab).toHaveClass('bg-blue-600', 'text-white');
    });
  });

  describe('Inactive Tab Styling', () => {
    test('applies inactive styling to non-current tabs', () => {
      render(<TabNavigation {...defaultProps} currentTab="active" />);
      
      const completedTab = screen.getByText(TAB_LABELS[TABS.COMPLETED]);
      const deletedTab = screen.getByText(TAB_LABELS[TABS.DELETED]);
      
      expect(completedTab).toHaveClass('bg-gray-200', 'text-gray-700', 'hover:bg-gray-300');
      expect(deletedTab).toHaveClass('bg-gray-200', 'text-gray-700', 'hover:bg-gray-300');
    });

    test('applies inactive styling to active tab when completed is current', () => {
      render(<TabNavigation {...defaultProps} currentTab="completed" />);
      
      const activeTab = screen.getByText(TAB_LABELS[TABS.ACTIVE]);
      expect(activeTab).toHaveClass('bg-gray-200', 'text-gray-700', 'hover:bg-gray-300');
    });

    test('applies inactive styling to active tab when deleted is current', () => {
      render(<TabNavigation {...defaultProps} currentTab="deleted" />);
      
      const activeTab = screen.getByText(TAB_LABELS[TABS.ACTIVE]);
      expect(activeTab).toHaveClass('bg-gray-200', 'text-gray-700', 'hover:bg-gray-300');
    });
  });

  describe('Common Styling', () => {
    test('all tabs have common base classes', () => {
      render(<TabNavigation {...defaultProps} />);
      
      const allTabs = screen.getAllByRole('button');
      allTabs.forEach(tab => {
        expect(tab).toHaveClass('flex-1', 'px-4', 'py-1', 'rounded-t', 'font-semibold', 'shadow', 'transition-colors');
      });
    });
  });

  describe('Accessibility', () => {
    test('all tabs are keyboard accessible', () => {
      render(<TabNavigation {...defaultProps} />);
      
      const tabs = screen.getAllByRole('button');
      tabs.forEach(tab => {
        expect(tab).toBeEnabled();
      });
    });

    test('tabs have proper button semantics', () => {
      render(<TabNavigation {...defaultProps} />);
      
      const tabs = screen.getAllByRole('button');
      expect(tabs).toHaveLength(3);
    });
  });

}); 