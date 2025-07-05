import React from 'react';
import { TABS, TAB_LABELS } from '../constants/taskConstants';

const TabNavigation = ({ currentTab, setCurrentTab }) => {
  const tabs = [
    { id: TABS.ACTIVE, label: TAB_LABELS[TABS.ACTIVE] },
    { id: TABS.COMPLETED, label: TAB_LABELS[TABS.COMPLETED] },
    { id: TABS.DELETED, label: TAB_LABELS[TABS.DELETED] }
  ];

  const getTabClassName = (tabId) => {
    const baseClasses = "flex-1 px-4 py-1 rounded-t font-semibold shadow transition-colors";
    return currentTab === tabId 
      ? `${baseClasses} bg-blue-600 text-white` 
      : `${baseClasses} bg-gray-200 text-gray-700 hover:bg-gray-300`;
  };

  return (
    <div className="flex gap-2 mb-6 w-full sticky top-0 bg-white z-10 py-2">
      {tabs.map((tab) => (
        <button 
          key={tab.id}
          className={getTabClassName(tab.id)}
          onClick={() => setCurrentTab(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default TabNavigation; 