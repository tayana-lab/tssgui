import { useEffect, useCallback } from 'react';
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

  /*
   * LAYOUT STRATEGY
   * ---------------
   * The topbar (.tss-topbar) is position:fixed — out of normal flow.
   * The sidebar (.tss-sidebar) is also position:fixed — out of normal flow.
   *
   * Therefore the <main> element must NOT be inside a flex row with the
   * sidebar (that only works when the sidebar is in-flow). Instead we
   * offset <main> with margin-left matching the current sidebar width,
   * and pad the top to clear the fixed topbar.
   *
   * Transitions on margin-left give the smooth sidebar-collapse animation.
   */
  const sidebarWidth = menuSidebarCollapsed
    ? 'var(--sidebar-width-sm)'
    : 'var(--sidebar-width)';

  return (
    <>
      {/* ── Fixed top navigation bar ── */}
      <Header />

      {/* ── Fixed left sidebar ── */}
      <HomePage_leftbar />

      {/*
       * ── Main content area ──
       * padding-top clears the fixed topbar.
       * margin-left clears the fixed sidebar.
       * Both transition smoothly when sidebar collapses.
       */}
      <main
        id="rightSectionDiv"
        style={{
          paddingTop:  'var(--topbar-height)',
          marginLeft:  sidebarWidth,
          minHeight:   '100vh',
          transition:  'margin-left var(--transition)',
          backgroundColor: 'var(--color-bg)',
          display:     'flex',
          flexDirection: 'column',
        }}
      >
        {/* Breadcrumb / page-title bar */}
        <TssContentHeader />

        {/* Scrollable page content */}
        <div
          className="flex-1 overflow-y-auto"
          style={{ backgroundColor: 'var(--color-bg)' }}
        >
          <div className="tss-content-body">
            <Outlet />
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </main>

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
