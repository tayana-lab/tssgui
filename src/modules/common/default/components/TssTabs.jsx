import React, { useState } from 'react';

/**
 * TssTabs — horizontal tab bar with content panel.
 * Replaces Bootstrap .nav-tabs + .tab-content pattern.
 *
 * Props
 * -----
 * tabsList    – Array of { Name: string, Component: ReactNode }
 * defaultTab  – Name of the initially active tab
 */
const TssTabs = ({ tabsList = [], defaultTab }) => {
  const [activeTab, setActiveTab] = useState(
    defaultTab || (tabsList.length > 0 ? tabsList[0].Name : '')
  );

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
    localStorage.setItem('activeTab', tabName);
  };

  const selectedTabComponent = tabsList.find((tab) => tab.Name === activeTab)?.Component;

  return (
    <div>
      {/* ---- Tab navigation bar ---- */}
      <div className="tss-tabs-nav" role="tablist">
        {tabsList.map((tab, index) => (
          <button
            key={index}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.Name}
            aria-controls={`tabpanel-${tab.Name}`}
            id={`tab-${tab.Name}`}
            className={`tss-tab-btn ${activeTab === tab.Name ? 'active' : ''}`}
            title={tab.Name}
            onClick={() => handleTabClick(tab.Name)}
          >
            {tab.Name}
          </button>
        ))}
      </div>

      {/* ---- Tab content ---- */}
      <div
        className="tss-tab-body"
        role="tabpanel"
        id={`tabpanel-${activeTab}`}
        aria-labelledby={`tab-${activeTab}`}
      >
        {selectedTabComponent}
      </div>
    </div>
  );
};

export default TssTabs;
