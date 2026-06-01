import React, { useState, useEffect,useRef } from 'react';
import { NavLink, useNavigate ,useLocation, Location } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { IMenuItem } from '@app/modules/welcome/HomePage_leftbar';
import '@app/modules/welcome/HomePage_topnav'
//import ReactDOM from 'react-dom';
//import { BrowserRouter as Router } from 'react-router-dom'; 
import { useSelector } from 'react-redux';
import config  from '@modules/conf/TssGui.json';

const HomePage_leftMenuItem = ({ menuItem, level = 0, moduleName,isSidebarHovered = false,
  menuSidebarCollapsed = false, }: { menuItem: IMenuItem; level?: number; moduleName:string; isSidebarHovered?: boolean;
  menuSidebarCollapsed?: boolean;}) => {
  const [t] = useTranslation();
  const [isMenuExtended, setIsMenuExtended] = useState(level === 0);
  const [isMainActive, setIsMainActive] = useState(false);
  const [isOneOfChildrenActive, setIsOneOfChildrenActive] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  //const menuSidebarCollapsed = useSelector((state: any) => state.ui.menuSidebarCollapsed);
  const firstRenderRef = useRef(true);

  const toggleMenu = () => {
    setIsMenuExtended(!isMenuExtended);
  };

  const handleMainMenuAction = async () => { 
	  if (menuItem.submodules && menuItem.submodules.length > 0) {
		  toggleMenu();
	  } else {
		  navigate(menuItem.modulePage ? menuItem.modulePage : '/');
		  setSelectedMenuItem(moduleName);
		  localStorage.setItem("module" , moduleName);
		 // localStorage.setItem("modulePath",menuItem.modulePage);
		  localStorage.setItem("moduleVersionType", menuItem.versionType?menuItem.versionType:'0');
		  localStorage.setItem("modulePath", menuItem.modulePathHierarchy?menuItem.modulePathHierarchy:'');
		  localStorage.setItem("moduleHeading", menuItem.moduleHeading?menuItem.moduleHeading:'');
                  localStorage.setItem("manual",menuItem.helpText?menuItem.helpText:'');
	  }
  };

const hasActiveChild = (submodules: IMenuItem[] | undefined, pathname: string): boolean => {
  if (!submodules) return false;

  return submodules.some((child) => {
    if (child.modulePage === pathname) {
      return true;
    }
    return hasActiveChild(child.submodules, pathname);
  });
};


  const calculateIsActive = (url: Location, item: IMenuItem) => {
    setIsMainActive(false);
    setIsOneOfChildrenActive(false);

    if (item.modulePage === url.pathname) {
      setIsMainActive(true);
    } else if (item.submodules) {
	    const isChildActive = hasActiveChild(item.submodules, url.pathname);
	    if (isChildActive) {
		    setIsOneOfChildrenActive(true);
		    setIsMenuExtended(true);
	    }
    }
  };

  useEffect(() => {
    if (location) {
      calculateIsActive(location, menuItem);
    }
  }, [location, menuItem]);


const shouldShowExpanded = !menuSidebarCollapsed || isSidebarHovered;

useEffect(() => {
if (config.PRODUCT_ID != 0){

 if (!isMainActive && !isOneOfChildrenActive) {
      setIsMenuExtended(false);
    }

}else{
    if (!firstRenderRef.current) {
      if (!isMainActive && !isOneOfChildrenActive && level !== 0) {
        setIsMenuExtended(false);
      }
    } else {
      firstRenderRef.current = false;
    }

}
  }, [isMainActive, isOneOfChildrenActive, level]);





  return (
    <>
    {/* <Header module={selectedMenuItem}/>
    <li className={`tss-menu-nav-item nav-item${isMenuExtended ? ' menu-open' : ''}`} style={{ marginLeft: `${level * 10}px` }} >
    */}
{config.PRODUCT_ID != 0 ? (
<li
      className={`tss-menu-nav-item nav-item${isMenuExtended ? ' menu-open' : ''}`}
      style={{ position: 'relative' }}
    >
      <a
        className={`tss-menu-item nav-link${isMainActive || isOneOfChildrenActive ? ' active' : ''}`}
        role="link"
        onClick={handleMainMenuAction}
        style={{
          cursor: 'pointer',
          padding: '9px',
          display: 'flex',
          flexDirection: menuSidebarCollapsed && !isSidebarHovered ? 'column' : 'row',
          alignItems: 'center',
          textAlign: menuSidebarCollapsed && !isSidebarHovered ? 'center' : 'left',
        }}
      >
        <div
          style={{
            display: 'flex',
	    paddingLeft: `${level * 15}px`,
            display: 'flex',
            alignItems: 'center',      width: '100%',
            flexDirection: menuSidebarCollapsed && !isSidebarHovered ? 'column' : 'row',
            alignItems: 'center',
          }}
        >
          <i
            className={menuItem.moduleIcon || 'fa fa-angle-double-right'}
            style={{
              fontSize: '16px',
              marginRight: !menuSidebarCollapsed || isSidebarHovered ? '8px' : '0',
            }}
          />
          <span
            style={{
              fontSize: menuSidebarCollapsed && !isSidebarHovered ? '10px' : '',
              marginTop: menuSidebarCollapsed && !isSidebarHovered ? '5px' : '0',
              whiteSpace: menuSidebarCollapsed && !isSidebarHovered ? 'normal' : 'nowrap',
              overflow: 'hidden',
              maxWidth: menuSidebarCollapsed && !isSidebarHovered ? '50px' : 'none',
            }}
          >
        	{menuSidebarCollapsed && !isSidebarHovered && menuItem.shortModuleName
              ? menuItem.shortModuleName
              : menuItem.moduleName}  
	</span>
        </div>

	<p className="sidemenu" >
        {shouldShowExpanded && menuItem.submodules?.length > 0 && (
          <i className="right fas fa-angle-left"/>
        )}
	</p>
      </a>

      {shouldShowExpanded && isMenuExtended && menuItem.submodules && (
        <ul className="tss-menu-nav-sidebar nav nav-treeview" >
          {menuItem.submodules.map((childMenuItem, index) => (
            <HomePage_leftMenuItem
              key={index}
	     style={{ paddingLeft: '10px' }}
              menuItem={childMenuItem}
              level={level + 1}
              moduleName={selectedMenuItem}
              isSidebarHovered={isSidebarHovered}
              menuSidebarCollapsed={menuSidebarCollapsed}
            />
          ))}
        </ul>
      )}
    </li>
):
(
<li
      className={`tss-menu-nav-item nav-item${(isMenuExtended || level === 0) ? ' menu-open' : ''}`}
      style={{ position: 'relative' }}
    >
      <a
        className={`tss-menu-item nav-link${isMainActive || isOneOfChildrenActive ? ' active' : ''}`}
        role="link"
        onClick={handleMainMenuAction}
        style={{
          cursor: 'pointer',
          padding: '9px',
          display: 'flex',
          flexDirection: menuSidebarCollapsed && !isSidebarHovered ? 'column' : 'row',
          alignItems: 'center',
          textAlign: menuSidebarCollapsed && !isSidebarHovered ? 'center' : 'left',
        }}
      >
        <div
          style={{
            display: 'flex',
            paddingLeft: `${level * 15}px`,
            display: 'flex',
            alignItems: 'center',      width: '100%',
            flexDirection: menuSidebarCollapsed && !isSidebarHovered ? 'column' : 'row',
            alignItems: 'center',
          }}
        >
          <i
            className={menuItem.moduleIcon || 'fa fa-angle-double-right'}
            style={{
              fontSize: '16px',
              marginRight: !menuSidebarCollapsed || isSidebarHovered ? '8px' : '0',
            }}
          />
          <span
            style={{
              fontSize: menuSidebarCollapsed && !isSidebarHovered ? '10px' : '',
              marginTop: menuSidebarCollapsed && !isSidebarHovered ? '5px' : '0',
              whiteSpace: menuSidebarCollapsed && !isSidebarHovered ? 'normal' : 'nowrap',
              overflow: 'hidden',
              maxWidth: menuSidebarCollapsed && !isSidebarHovered ? '50px' : 'none',
            }}
          >
                {menuSidebarCollapsed && !isSidebarHovered && menuItem.moduleShortName
              ? menuItem.moduleShortName
              : menuItem.moduleName}
        </span>
        </div>

        <p className="sidemenu" >
        {shouldShowExpanded && menuItem.submodules?.length > 0 && (
          <i className="right fas fa-angle-left"/>
        )}
        </p>
      </a>

      {shouldShowExpanded && isMenuExtended && menuItem.submodules && (
        <ul className="tss-menu-nav-sidebar nav nav-treeview" >
          {menuItem.submodules.map((childMenuItem, index) => (
            <HomePage_leftMenuItem
              key={index}
             style={{ paddingLeft: '10px' }}
              menuItem={childMenuItem}
              level={level + 1}
              moduleName={selectedMenuItem}
              isSidebarHovered={isSidebarHovered}
              menuSidebarCollapsed={menuSidebarCollapsed}
            />
          ))}
        </ul>
      )}
    </li>


)}

    </>
  );
};

export default HomePage_leftMenuItem;

