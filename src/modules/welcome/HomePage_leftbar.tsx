import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Image } from '@profabric/react-components';
import styled from 'styled-components';
import { SidebarSearch } from '@app/modules/common/default/components/TssSidebarSearch';
import HomePage_leftMenuItem from '@app/modules/welcome/HomePage_leftMenuItem';
import tssguiConf from '@app/modules/conf/TssGui.json';

// Define the IMenuItem interface
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
  submodules?: Array<IMenuItem>;
}

// Define new menu items
const newMenuItems: IMenuItem[] = [
  {
    alias: 'Tssgui Demo',
    modulePage: '/demopage',
    linkPath: '/demoPage',
  },
  {
    alias: 'Demo',
    modulePage: '/demo',
    linkPath: '/demo',
  },
];

const StyledBrandImage = styled(Image)`
  cursor: auto;
  float: left;
  line-height: 0.8;
  margin: -1px 8px 0 6px;
  opacity: 0.8;
  --pf-box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19),
    0 6px 6px rgba(0, 0, 0, 0.23) !important;
`;

const HomePage_leftbar: React.FC = () => {
  const authentication = useSelector((state: any) => state.auth.authentication);
  const sidebarSkin = useSelector((state: any) => state.ui.sidebarSkin);
  const menuItemFlat = useSelector((state: any) => state.ui.menuItemFlat);
  const menuChildIndent = useSelector((state: any) => state.ui.menuChildIndent);
  const menuSidebarCollapsed = useSelector((state: any) => state.ui.menuSidebarCollapsed);

  const [minLogo, setMinLogo] = useState<string | null>(null);
  const [fullLogo, setFullLogo] = useState<string | null>(null);
  const [menu, setMenu] = useState<IMenuItem[]>([]);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Fetch and combine menu items
    const modulesJSON = localStorage.getItem('productModules');
    const modules: IMenuItem[] = modulesJSON ? JSON.parse(modulesJSON) : [];
    const updatedModules: IMenuItem[] = [...modules];
    setMenu(updatedModules);
  }, []);

  useEffect(() => {
    const getProductLogo = async () => {
      try {
        const minLogoPath = `../common/default/img/${tssguiConf.PRODUCT_LOGO_MIN}`;
        const fullLogoPath = `../common/default/img/${tssguiConf.PRODUCT_LOGO}`;

        const { default: minlogo } = await import(minLogoPath);
        const { default: fulllogo } = await import(fullLogoPath);

        setMinLogo(minlogo);
        setFullLogo(fulllogo);
      } catch (error) {
      //  console.error('Error importing logo:', error);
      }
    };

    getProductLogo();
  }, []);

  const determineLogo = () => (menuSidebarCollapsed ? minLogo : fullLogo);

  return (
    <aside className={`main-sidebar elevation-4 ${sidebarSkin}`} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <Link className="brand-link" style={{ cursor: 'auto', textAlign: 'center', height: '61px' }} >

        {menuSidebarCollapsed && !isHovered ? (
          <img src={`/images/${tssguiConf.PRODUCT_LOGO_MIN}` || ''} alt="Logo" style={{ width: '100px', height: '45px', marginTop: '-5px' }} />
        ) : (
          <img src={`/images/${tssguiConf.PRODUCT_LOGO}` || ''} alt="Logo" style={{ width: '112px', height: 'auto', marginTop: '-5px' }} />
        )}
      </Link>

      <section className="sidebar">
        <div className="form-inline pt-2">
          <SidebarSearch menu={menu} />
        </div>

        <nav className="mt-2">
          <ul
            className={`tss-menu-nav-sidebar nav nav-pills nav-sidebar flex-column ${
              menuItemFlat ? ' nav-flat' : ''
            }${menuChildIndent ? ' nav-child-indent' : ''}`}
            role="menu"
            data-widget="treeview"
            data-accordion="false"
          >
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
      </section>
    </aside>
  );
};

export default HomePage_leftbar;

