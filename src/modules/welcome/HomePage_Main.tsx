import { useEffect, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSidebarMenu, setWindowSize } from '@app/modules/common/default/store/reducers/ui';
import Header from '@app/modules/welcome/HomePage_topnav';
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
        /* non-critical */
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
   * ──────────────
   * tss-topbar  → position: fixed, height: 44px, full width, z-index 1030
   * tss-sidebar → position: fixed, from top 44px to bottom, z-index 1020
   * <main>      → margin-left matches sidebar width; padding-top clears topbar
   *               Contains: page-header (44px) + scrollable content
   */
  const sidebarWidth = menuSidebarCollapsed
    ? 'var(--sidebar-width-sm)'
    : 'var(--sidebar-width)';

  return (
    <>
      {/* Fixed topbar */}
      <Header />

      {/* Fixed sidebar */}
      <HomePage_leftbar />

      {/* Main content — offset from sidebar and topbar */}
      <main
        id="rightSectionDiv"
        style={{
          paddingTop:      'var(--topbar-height)',
          marginLeft:      sidebarWidth,
          minHeight:       '100vh',
          transition:      'margin-left var(--transition)',
          backgroundColor: 'var(--color-bg)',
          display:         'flex',
          flexDirection:   'column',
        }}
      >
        {/* Compact page header with title + breadcrumb */}
        <TssContentHeader />

        {/* Scrollable content area — fills remaining viewport */}
        <div className="tss-content-scroll">
          <div className="tss-content-body">
            <Outlet />
          </div>
        </div>
      </main>

      {/* Mobile sidebar backdrop */}
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
