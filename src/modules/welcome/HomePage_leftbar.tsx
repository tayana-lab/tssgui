import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { SidebarSearch } from '@app/modules/common/default/components/TssSidebarSearch';
import HomePage_leftMenuItem from '@app/modules/welcome/HomePage_leftMenuItem';
import tssguiConf from '@app/modules/conf/TssGui.json';

/* ---- Types ---- */
export interface IMenuItem {
  moduleName: string;
  shortModuleName?: string;
  moduleHeading?: string;
  modulePage?: string;
  moduleId?: string;
  modulePid?: string;
  moduleIcon?: string;
  modulePathHierarchy?: string;
  versionType?: string;
  helpText?: string;
  submodules?: Array<IMenuItem>;
}

const HomePage_leftbar: React.FC = () => {
  const menuSidebarCollapsed = useSelector((state: any) => state.ui.menuSidebarCollapsed);

  const [menu, setMenu]           = useState<IMenuItem[]>([]);
  const [isHovered, setIsHovered] = useState(false);

  /* ---- Load menu from localStorage ---- */
  useEffect(() => {
    const modulesJSON = localStorage.getItem('productModules');
    const modules: IMenuItem[] = modulesJSON ? JSON.parse(modulesJSON) : [];
    setMenu(modules);
  }, []);

  /* ---- Expand state: sidebar is "open" if not collapsed OR if hovered ---- */
  const isExpanded = !menuSidebarCollapsed || isHovered;

  return (
    <aside
      className="tss-sidebar"
      style={{ width: isExpanded ? 'var(--sidebar-width)' : 'var(--sidebar-width-sm)' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="Main navigation"
    >
      {/* ---- Brand logo ---- */}
      <div className="tss-sidebar-brand">
        <img
          src={isExpanded
            ? `/images/${tssguiConf.PRODUCT_LOGO}`
            : `/images/${tssguiConf.PRODUCT_LOGO_MIN}`}
          alt="Product logo"
          style={{
            height:    isExpanded ? '36px' : '28px',
            width:     isExpanded ? 'auto' : '40px',
            objectFit: 'contain',
            transition: 'all 200ms ease',
          }}
        />
      </div>

      {/* ---- Sidebar search (only when expanded) ---- */}
      {isExpanded && (
        <div className="px-3 py-2 shrink-0">
          <SidebarSearch menu={menu} />
        </div>
      )}

      {/* ---- Navigation menu ---- */}
      <nav className="tss-sidebar-scroll" aria-label="Sidebar navigation">
        <ul role="menu" className="list-none m-0 p-0">
          {menu.map((menuItem: IMenuItem) => (
            <HomePage_leftMenuItem
              key={menuItem.moduleName + menuItem.modulePage}
              menuItem={menuItem}
              moduleName={menuItem.moduleName}
              isSidebarHovered={isHovered}
              menuSidebarCollapsed={menuSidebarCollapsed}
            />
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default HomePage_leftbar;
