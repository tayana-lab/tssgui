import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { toggleSidebarMenu } from '@app/modules/common/default/store/reducers/ui';
import TssIcon from '@app/modules/common/default/components/TssIcon';
import SearchDropdown from '@app/modules/welcome/SearchDropdown';
import LanguagesDropdown from '@app/modules/welcome/LanguagesDropdown';
import ProductsDropdown from '@app/modules/welcome/ProductsDropdown';
import ThemesDropdown from '@app/modules/welcome/ThemesDropdown';
import UserDropdown from '@app/modules/welcome/UserDropdown';
import TenantDropdown from '@app/modules/welcome/TenantDropdown';
import conf from '@modules/conf/TssGui.json';
import Log from '@app/modules/common/default/components/TssGUILog.js';

const productTitle = conf.PRODUCT_TITLE;

const Header = () => {
  const [t] = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [manualPath, setManualPath] = useState('');

  /* ---- Navigation helpers ---- */
  const handleSitemap = () => {
    localStorage.setItem('modulePath', '');
    localStorage.setItem('moduleVersionType', '0');
    localStorage.setItem('moduleHeading', 'Sitemap');
    navigate('/sitemap');
  };

  const handleDashboardClick = () => {
    localStorage.setItem('modulePath', '');
    localStorage.setItem('moduleVersionType', '0');
    localStorage.setItem('moduleHeading', 'Dashboard');
    navigate('/dashboard');
  };

  const handleUploadTrackerClick = () => {
    localStorage.setItem('modulePath', '');
    localStorage.setItem('moduleVersionType', '0');
    localStorage.setItem('moduleHeading', 'File Upload Tracker');
    navigate('/fileUploadTracker');
  };

  const handleToggleMenuSidebar = useCallback(() => {
    dispatch(toggleSidebarMenu());
  }, [dispatch]);

  /* ---- Fetch product manual path ---- */
  useEffect(() => {
    const fetchProductManualPath = async () => {
      try {
        const response = await fetch(
          `${conf.SERVER_JS_API_URI}/getProductManualPath?productId=${conf.PRODUCT_ID}`
        );
        if (!response.ok) throw new Error('Error fetching data');
        const data = await response.text();
        setManualPath(data);
        Log('Top Nav', 'INFO', 'Data fetched successfully : ' + JSON.stringify(data));
      } catch (error) {
        Log('Top Nav', 'ERROR', 'Error fetching data : ' + error);
      }
    };
    fetchProductManualPath();
  }, []);

  /* ---- Manual download ---- */
  const downloadManual = async () => {
    if (!manualPath || manualPath === '' || manualPath === null) return;
    const cleanedFilePath = manualPath.replace(/^File:\//, '');
    const filePath = cleanedFilePath.split('/').slice(0, -1).join('/');
    const fileName = cleanedFilePath.substring(cleanedFilePath.lastIndexOf('/') + 1);
    const url = `${conf.SERVER_JS_API_URI}/download?filePath=${encodeURIComponent(filePath)}&fileName=${encodeURIComponent(fileName)}`;
    fetch(url)
      .then((r) => (r.ok ? r.blob() : Promise.reject('Bad response')))
      .then((blob) => {
        const fileURL = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = fileURL;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      })
      .catch((e) => console.error('Error downloading file:', e));
  };

  return (
    <header className="tss-topbar" role="banner">

      {/* ── LEFT: toggle + branding ── */}
      <div className="flex items-center gap-2 shrink-0" style={{ minWidth: 0 }}>
        <button
          type="button"
          className="tss-topbar-icon-btn"
          onClick={handleToggleMenuSidebar}
          aria-label="Toggle sidebar"
        >
          <TssIcon iconKey="tss_bars" />
        </button>

        <span
          className="hidden sm:block text-sm font-semibold select-none truncate"
          style={{ color: 'var(--color-primary)', maxWidth: '120px' }}
        >
          {productTitle}
        </span>
      </div>

      {/* ── CENTER: global search ── */}
      <div className="hidden md:flex flex-1 justify-center px-4" style={{ maxWidth: '400px', margin: '0 auto' }}>
        <SearchDropdown />
      </div>

      {/* ── RIGHT: actions + user ── */}
      <div className="flex items-center gap-0.5 ml-auto shrink-0">

        {/* Sitemap */}
        <button
          type="button"
          className="tss-topbar-icon-btn hidden sm:inline-flex"
          onClick={handleSitemap}
          title={t('topnavi.title.siteMap')}
          aria-label={t('topnavi.title.siteMap')}
        >
          <TssIcon iconKey="tss_sitemap" size={16} />
        </button>

        {/* Manual */}
        <button
          type="button"
          className="tss-topbar-icon-btn hidden sm:inline-flex"
          onClick={downloadManual}
          title={t('topnavi.title.manual')}
          aria-label={t('topnavi.title.manual')}
        >
          <TssIcon iconKey="tss_manual" size={16} />
        </button>

        {/* Dashboard */}
        {conf.DISPLAY_DASHBOARD_ICON === true && (
          <button
            type="button"
            className="tss-topbar-icon-btn"
            onClick={handleDashboardClick}
            title={t('topnavi.title.dashboard')}
            aria-label={t('topnavi.title.dashboard')}
          >
            <TssIcon iconKey="tss_dashboard" size={16} />
          </button>
        )}

        {/* File upload tracker */}
        {conf.DISPLAY_FILE_UPLOAD_ICON === true && (
          <button
            type="button"
            className="tss-topbar-icon-btn"
            onClick={handleUploadTrackerClick}
            title={t('topnavi.title.fileUploadTracker')}
            aria-label={t('topnavi.title.fileUploadTracker')}
          >
            <TssIcon iconKey="tss_upload" size={16} />
          </button>
        )}

        {/* Divider */}
        <div className="tss-topbar-divider mx-1" />

        {/* Language */}
        {conf.DISPLAY_TRANSLATOR_ICON === true && (
          <LanguagesDropdown title={t('topnavi.title.language')} />
        )}

        {/* Products */}
        {conf.DISPLAY_PRODUCTS_ICON === true && (
          <ProductsDropdown />
        )}

        {/* Tenant */}
        <TenantDropdown />

        {/* Theme */}
        {conf.DISPLAY_THEMES_ICON === true && (
          <ThemesDropdown />
        )}

        {/* Divider */}
        <div className="tss-topbar-divider mx-1" />

        {/* User */}
        <UserDropdown />
      </div>
    </header>
  );
};

export default Header;
