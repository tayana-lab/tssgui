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

  const handleToggleMenuSidebar = useCallback(() => {
    dispatch(toggleSidebarMenu());
  }, [dispatch]);

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
    <>
      {/* ── Fixed top navigation bar (out of normal flow) ── */}
      <Header />

      {/*
       * Body zone: sits below the fixed topbar.
       * height = 100vh minus the topbar so it fills the remaining screen.
       * flex-row lets sidebar and content sit side by side.
       */}
      <div
        className="flex overflow-hidden"
        style={{
          height:    'calc(100vh - var(--topbar-height))',
          marginTop: 'var(--topbar-height)',
        }}
      >
        {/* ── Collapsible left sidebar ── */}
        <HomePage_leftbar />

        {/*
         * Main content column.
         * margin-left matches the sidebar width so content never slides
         * under the sidebar. Transition keeps it smooth on collapse.
         */}
        <main
          id="rightSectionDiv"
          className="flex flex-col flex-1 overflow-hidden transition-all duration-200"
          style={{
            marginLeft: menuSidebarCollapsed
              ? 'var(--sidebar-width-sm)'
              : 'var(--sidebar-width)',
            backgroundColor: 'var(--color-bg)',
          }}
        >
          {/* Breadcrumb / page-title bar */}
          <TssContentHeader />

          {/* Scrollable page content */}
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

      {/* ── Mobile sidebar backdrop ── */}
      {!menuSidebarCollapsed && (
        <div
          className="tss-sidebar-overlay lg:hidden"
          role="presentation"
          onClick={handleToggleMenuSidebar}
          onKeyDown={() => {}}
        />
      )}
    </>
  );
};

export default Main;
