import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
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

/*
 * Group menu items into named sections.
 * The server may return items with a `modulePid` of "0" as top-level
 * groups.  We preserve that natural grouping and just render each group
 * with a visual section label if the sidebar is expanded.
 *
 * If no grouping info exists we fall back to a single "Navigation" section.
 */
const groupMenuItems = (items: IMenuItem[]): { label: string; items: IMenuItem[] }[] => {
  if (!items || items.length === 0) return [];

  // Top-level items that have children act as section headers
  const sections: { label: string; items: IMenuItem[] }[] = [];

  items.forEach((item) => {
    if (item.submodules && item.submodules.length > 0) {
      sections.push({ label: item.moduleName, items: [item] });
    } else {
      // Flat item — put in the last section or create a default
      if (sections.length === 0) {
        sections.push({ label: 'Navigation', items: [] });
      }
      sections[sections.length - 1].items.push(item);
    }
  });

  return sections;
};

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

  /* ---- Expand state: open if not collapsed OR hovered ---- */
  const isExpanded = !menuSidebarCollapsed || isHovered;
  const collapsed  = menuSidebarCollapsed && !isHovered;

  const sections = useMemo(() => groupMenuItems(menu), [menu]);

  const currentYear = new Date().getFullYear();

  return (
    <aside
      className="tss-sidebar"
      style={{ width: isExpanded ? 'var(--sidebar-width)' : 'var(--sidebar-width-sm)' }}
      onMouseEnter={() => menuSidebarCollapsed && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="Main navigation"
    >
      {/* ── Brand logo ── */}
      <div className="tss-sidebar-brand">
        <img
          src={isExpanded
            ? `/images/${tssguiConf.PRODUCT_LOGO}`
            : `/images/${tssguiConf.PRODUCT_LOGO_MIN}`}
          alt="Product logo"
          style={{
            height:     isExpanded ? '28px' : '22px',
            width:      isExpanded ? 'auto' : '32px',
            objectFit:  'contain',
            transition: 'all 150ms ease',
          }}
        />
      </div>

      {/* ── Sidebar search (expanded only) ── */}
      {isExpanded && (
        <div className="tss-sidebar-search-wrap">
          <SidebarSearch menu={menu} />
        </div>
      )}

      {/* ── Navigation ── */}
      <nav className="tss-sidebar-scroll" aria-label="Sidebar navigation">
        {sections.length > 0 ? (
          sections.map((section, sIdx) => (
            <div key={sIdx}>
              {/* Section label — only when expanded and more than one section */}
              {isExpanded && sections.length > 1 && (
                <div className="tss-sidebar-section">
                  <span className="tss-sidebar-section-label">{section.label}</span>
                </div>
              )}

              {/* Divider between sections (not before first) */}
              {sIdx > 0 && !isExpanded && (
                <div className="tss-sidebar-divider" />
              )}

              <ul role="menu" className="list-none m-0 p-0 pb-1">
                {section.items.map((menuItem) => (
                  <HomePage_leftMenuItem
                    key={menuItem.moduleName + (menuItem.modulePage ?? '')}
                    menuItem={menuItem}
                    moduleName={menuItem.moduleName}
                    isSidebarHovered={isHovered}
                    menuSidebarCollapsed={menuSidebarCollapsed}
                  />
                ))}
              </ul>
            </div>
          ))
        ) : (
          /* Fallback flat list */
          <ul role="menu" className="list-none m-0 p-0">
            {menu.map((menuItem) => (
              <HomePage_leftMenuItem
                key={menuItem.moduleName + (menuItem.modulePage ?? '')}
                menuItem={menuItem}
                moduleName={menuItem.moduleName}
                isSidebarHovered={isHovered}
                menuSidebarCollapsed={menuSidebarCollapsed}
              />
            ))}
          </ul>
        )}
      </nav>

      {/* ── Sidebar footer branding (replaces removed page footer) ── */}
      {isExpanded && (
        <div className="tss-sidebar-footer">
          <div className="truncate" title="Tayana Mobility Technologies">
            &copy; {currentYear} Tayana Mobility
          </div>
        </div>
      )}
    </aside>
  );
};

export default HomePage_leftbar;
