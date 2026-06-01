import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Location } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { IMenuItem } from '@app/modules/welcome/HomePage_leftbar';
import config from '@modules/conf/TssGui.json';

interface MenuItemProps {
  menuItem: IMenuItem;
  level?: number;
  moduleName: string;
  isSidebarHovered?: boolean;
  menuSidebarCollapsed?: boolean;
}

/* ---- Recursive helper: is any child/descendant the active page? ---- */
const hasActiveChild = (submodules: IMenuItem[] | undefined, pathname: string): boolean => {
  if (!submodules) return false;
  return submodules.some(
    (child) => child.modulePage === pathname || hasActiveChild(child.submodules, pathname)
  );
};

const HomePage_leftMenuItem: React.FC<MenuItemProps> = ({
  menuItem,
  level = 0,
  moduleName,
  isSidebarHovered = false,
  menuSidebarCollapsed = false,
}) => {
  const [t] = useTranslation();
  const location  = useLocation();
  const navigate  = useNavigate();

  const [isMenuExtended,        setIsMenuExtended]        = useState(level === 0);
  const [isMainActive,          setIsMainActive]          = useState(false);
  const [isOneOfChildrenActive, setIsOneOfChildrenActive] = useState(false);
  const [selectedMenuItem,      setSelectedMenuItem]      = useState('');

  const firstRenderRef = useRef(true);

  const hasChildren = menuItem.submodules && menuItem.submodules.length > 0;

  /* ---- Sidebar expanded = not collapsed OR mouse is hovering ---- */
  const shouldShowExpanded = !menuSidebarCollapsed || isSidebarHovered;

  /* ---- Handle click: toggle submenu or navigate ---- */
  const handleMainMenuAction = () => {
    if (hasChildren) {
      setIsMenuExtended((prev) => !prev);
    } else {
      navigate(menuItem.modulePage ?? '/');
      setSelectedMenuItem(moduleName);
      localStorage.setItem('module',            moduleName);
      localStorage.setItem('moduleVersionType', menuItem.versionType         ?? '0');
      localStorage.setItem('modulePath',        menuItem.modulePathHierarchy ?? '');
      localStorage.setItem('moduleHeading',     menuItem.moduleHeading       ?? '');
      localStorage.setItem('manual',            menuItem.helpText            ?? '');
    }
  };

  /* ---- Active state from location ---- */
  useEffect(() => {
    if (!location) return;
    setIsMainActive(menuItem.modulePage === location.pathname);
    setIsOneOfChildrenActive(hasActiveChild(menuItem.submodules, location.pathname));
    if (hasActiveChild(menuItem.submodules, location.pathname)) {
      setIsMenuExtended(true);
    }
  }, [location, menuItem]);

  /* ---- Auto-collapse when not active (PRODUCT_ID != 0 only) ---- */
  useEffect(() => {
    if (config.PRODUCT_ID !== 0) {
      if (!isMainActive && !isOneOfChildrenActive) {
        setIsMenuExtended(false);
      }
    } else {
      if (!firstRenderRef.current) {
        if (!isMainActive && !isOneOfChildrenActive && level !== 0) {
          setIsMenuExtended(false);
        }
      } else {
        firstRenderRef.current = false;
      }
    }
  }, [isMainActive, isOneOfChildrenActive, level]);

  /* ---- Collapsed sidebar: show only icon + short name ---- */
  const collapsed = menuSidebarCollapsed && !isSidebarHovered;
  const label     = collapsed && menuItem.shortModuleName
    ? menuItem.shortModuleName
    : menuItem.moduleName;

  /* ---- Combined active flag ---- */
  const isActive = isMainActive || isOneOfChildrenActive;

  return (
    <li
      style={{ position: 'relative' }}
      role="none"
    >
      {/* ---- Menu item row ---- */}
      <a
        role="menuitem"
        tabIndex={0}
        onClick={handleMainMenuAction}
        onKeyDown={(e) => e.key === 'Enter' && handleMainMenuAction()}
        className={[
          'tss-menu-item',
          isActive     ? 'active' : '',
          isMenuExtended && hasChildren ? 'open' : '',
        ].join(' ')}
        style={{
          paddingLeft: collapsed ? undefined : `${12 + level * 14}px`,
          flexDirection: collapsed ? 'column' : 'row',
          alignItems:   'center',
          textAlign:    collapsed ? 'center' : 'left',
          gap:           collapsed ? '2px' : undefined,
        }}
        title={menuItem.moduleName}
        aria-expanded={hasChildren ? isMenuExtended : undefined}
        aria-current={isMainActive ? 'page' : undefined}
      >
        {/* Icon */}
        <i
          className={`tss-menu-icon ${menuItem.moduleIcon || 'fa fa-angle-double-right'}`}
        />

        {/* Label */}
        {shouldShowExpanded && (
          <span
            className="tss-menu-label"
            style={{
              fontSize:  collapsed ? '9px'    : '13px',
              maxWidth:  collapsed ? '48px'   : 'none',
              whiteSpace: collapsed ? 'normal' : 'nowrap',
              lineHeight: collapsed ? '1.2'   : undefined,
            }}
          >
            {label}
          </span>
        )}

        {/* Chevron — only when expanded and has children */}
        {shouldShowExpanded && hasChildren && (
          <i
            className={`tss-menu-chevron fas fa-angle-left ml-auto ${isMenuExtended ? 'open' : ''}`}
            style={{ transform: isMenuExtended ? 'rotate(-90deg)' : 'none' }}
          />
        )}
      </a>

      {/* ---- Submenu (recursive) ---- */}
      {shouldShowExpanded && isMenuExtended && hasChildren && (
        <ul
          className="list-none m-0 p-0"
          role="menu"
          style={{
            borderLeft: `2px solid var(--color-border)`,
            marginLeft: `${16 + level * 14}px`,
            marginRight: '8px',
          }}
        >
          {menuItem.submodules!.map((child, index) => (
            <HomePage_leftMenuItem
              key={index}
              menuItem={child}
              level={level + 1}
              moduleName={selectedMenuItem}
              isSidebarHovered={isSidebarHovered}
              menuSidebarCollapsed={menuSidebarCollapsed}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

export default HomePage_leftMenuItem;
