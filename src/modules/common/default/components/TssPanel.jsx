import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

/**
 * TssPanel — collapsible card panel.
 * Replaces Bootstrap .card + .collapse pattern.
 *
 * Props
 * -----
 * panelId       – id on the outer wrapper
 * panelBodyId   – id on the body
 * header        – header node / string
 * footer        – footer node
 * className     – extra classes on the header
 * collapseReq   – whether the panel is collapsible (default true)
 * isCollapsed   – initial collapsed state
 * onClick       – callback on header click
 * children
 */
const TssPanel = ({
  panelId = '',
  panelBodyId = '',
  header,
  footer,
  className = '',
  collapseReq = true,
  isCollapsed = false,
  children,
  onClick = () => {},
}) => {
  const [collapsed, setCollapsed] = useState(isCollapsed);

  useEffect(() => {
    setCollapsed(isCollapsed);
  }, [isCollapsed]);

  const toggle = () => {
    if (!collapseReq) return;
    setCollapsed((prev) => !prev);
    onClick();
  };

  return (
    <div id={panelId} className="tss-card mb-3">

      {/* ---- Header ---- */}
      <div
        className={`tss-card-header ${!collapseReq ? 'no-collapse' : ''} ${className}`}
        onClick={toggle}
        aria-expanded={!collapsed}
        role={collapseReq ? 'button' : undefined}
        tabIndex={collapseReq ? 0 : undefined}
        onKeyDown={(e) => e.key === 'Enter' && toggle()}
      >
        <span className="flex-1">{header}</span>
        {collapseReq && (
          <FontAwesomeIcon
            icon={collapsed ? faChevronDown : faChevronUp}
            className="text-xs ml-2"
            style={{ color: 'var(--color-text-muted)' }}
          />
        )}
      </div>

      {/* ---- Body (collapses) ---- */}
      {!collapsed && children && (
        <div id={panelBodyId} className="tss-card-body">
          {children}
        </div>
      )}

      {/* ---- Footer ---- */}
      {footer && (
        <div className="tss-card-footer">{footer}</div>
      )}
    </div>
  );
};

export default TssPanel;
