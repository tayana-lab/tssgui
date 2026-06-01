import { useState, useEffect, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSidebarMenu, setWindowSize } from '@app/modules/common/default/store/reducers/ui';
import Header from '@app/modules/welcome/HomePage_topnav';
import Footer from '@app/modules/welcome/HomePage_footer';
import HomePage_leftbar from '@app/modules/welcome/HomePage_leftbar';
import TssContentHeader from '@app/modules/common/default/components/TssContentHeader';
import TssConf from '@app/modules/conf/TssGui.json';
import { useTranslation } from 'react-i18next';

const Main = () => {
  const { i18n } = useTranslation();
  const dispatch = useDispatch();

  const menuSidebarCollapsed = useSelector((state: any) => state.ui.menuSidebarCollapsed);
  const authentication = useSelector((state: any) => state.auth.authentication);

  const handleToggleMenuSidebar = () => {
    dispatch(toggleSidebarMenu());
  };

  /* ---- Sync language preference on mount ---- */
  useEffect(() => {
    const languageDetails = async () => {
      try {
        const acctId = localStorage.getItem('acctID');
        const languageData = await fetch(
          `${TssConf.SERVER_JS_API_URI}/tssgui/get/account/details?accountId=${acctId}`
        );
        const data = await languageData.json();
        const languageId = data[0]?.languageId;
        i18n.changeLanguage(languageId === '1' ? 'en' : 'in');
      } catch {
        // non-critical — language falls back to default
      }
    };

    const acctName  = localStorage.getItem('acctName');
    const acctID    = localStorage.getItem('acctID');
    const username  = localStorage.getItem('username');
    const productId = localStorage.getItem('productId');
    const serverIP  = localStorage.getItem('serverIP');
    const clientIP  = localStorage.getItem('clientIP');
    const sessionID = localStorage.getItem('sessionID');

    localStorage.setItem('acctName',  acctName);
    localStorage.setItem('acctID',    acctID);
    localStorage.setItem('username',  username);
    localStorage.setItem('productId', productId);
    localStorage.setItem('serverIP',  serverIP);
    localStorage.setItem('clientIP',  clientIP);
    localStorage.setItem('sessionID', sessionID);

    languageDetails();
  }, []);

  /* ---- Responsive window-size tracking ---- */
  useEffect(() => {
    const onResize = () => {
      const w = window.innerWidth;
      const size = w >= 1200 ? 'lg' : w >= 992 ? 'md' : w >= 768 ? 'sm' : 'xs';
      dispatch(setWindowSize(size));
    };
    window.addEventListener('resize', onResize);
    onResize();
    return () => window.removeEventListener('resize', onResize);
  }, [dispatch]);

  return (
    /* Outer flex column takes the full viewport */
    <div className="flex flex-col h-screen overflow-hidden" style={{ backgroundColor: 'var(--color-bg)' }}>

      {/* ---- Fixed top navigation bar ---- */}
      <Header />

      {/* ---- Below topbar: sidebar + content side by side ---- */}
      <div className="flex flex-1 overflow-hidden" style={{ paddingTop: 'var(--topbar-height)' }}>

        {/* ---- Collapsible left sidebar ---- */}
        <HomePage_leftbar />

        {/* ---- Main scrollable content area ---- */}
        <main
          id="rightSectionDiv"
          className="flex flex-col flex-1 overflow-hidden transition-all duration-200"
          style={{
            marginLeft: menuSidebarCollapsed ? 'var(--sidebar-width-sm)' : 'var(--sidebar-width)',
          }}
        >
          {/* Breadcrumb / page title bar */}
          <TssContentHeader />

          {/* Page content */}
          <div
            className="flex-1 overflow-y-auto tss-content-body"
            style={{ backgroundColor: 'var(--color-bg)' }}
          >
            <Outlet />
          </div>

          {/* Footer */}
          <Footer />
        </main>
      </div>

      {/* ---- Mobile sidebar overlay ---- */}
      {!menuSidebarCollapsed && (
        <div
          className="tss-sidebar-overlay lg:hidden"
          role="presentation"
          onClick={handleToggleMenuSidebar}
          onKeyDown={() => {}}
        />
      )}
    </div>
  );
};

export default Main;
