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
  const [searchQuery, setSearchQuery] = useState('');

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

  const handleToggleMenuSidebar = () => {
    dispatch(toggleSidebarMenu());
  };

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
    const filePath  = cleanedFilePath.split('/').slice(0, -1).join('/');
    const fileName  = cleanedFilePath.substring(cleanedFilePath.lastIndexOf('/') + 1);
    const url = `${conf.SERVER_JS_API_URI}/download?filePath=${encodeURIComponent(filePath)}&fileName=${encodeURIComponent(fileName)}`;

    fetch(url)
      .then((response) => {
        if (response.ok) return response.blob();
        throw new Error('Network response was not ok');
      })
      .then((blob) => {
        const fileURL = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = fileURL;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      })
      .catch((error) => console.error('Error downloading file:', error));
  };

  return (
    <header
      className="tss-topbar"
      role="banner"
    >
      {/* ──────── LEFT ZONE: MENU + BRANDING ──────── */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Hamburger/collapse button */}
        <button
          type="button"
          className="tss-topbar-icon-btn"
          onClick={handleToggleMenuSidebar}
          aria-label="Toggle sidebar"
          title="Toggle sidebar"
        >
          <TssIcon iconKey="tss_bars" />
        </button>

        {/* Product title */}
        <div className="hidden sm:block">
          <h1
            className="text-sm font-bold leading-none select-none"
            style={{ color: 'var(--color-primary)', fontWeight: 700 }}
          >
            {productTitle}
          </h1>
        </div>
      </div>

      {/* ──────── CENTER ZONE: GLOBAL SEARCH ──────── */}
      <div className="hidden md:flex flex-1 mx-6 max-w-md">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="tss-search-input"
            style={{
              width: '100%',
              padding: '0.375rem 0.75rem 0.375rem 2.25rem',
              fontSize: '14px',
              backgroundColor: 'var(--color-input-bg)',
              color: 'var(--color-text)',
              border: '1px solid var(--color-input-border)',
              borderRadius: '6px',
              transition: 'all 150ms ease',
              outline: 'none',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--color-primary)';
              e.target.style.boxShadow = '0 0 0 2px rgba(52, 125, 193, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--color-input-border)';
              e.target.style.boxShadow = 'none';
            }}
          />
          <TssIcon
            iconKey="tss_search"
            className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={16}
          />
        </div>
      </div>

      {/* ──────── RIGHT ZONE: ACTIONS + UTILITY + USER ──────── */}
      <div className="flex items-center gap-1 ml-auto">
        {/* Sitemap shortcut */}
        <button
          type="button"
          className="tss-topbar-icon-btn hidden sm:flex"
          onClick={handleSitemap}
          title={t('topnavi.title.siteMap')}
          aria-label={t('topnavi.title.siteMap')}
        >
          <TssIcon iconKey="tss_sitemap" size={18} />
        </button>

        {/* Manual/Help */}
        <button
          type="button"
          className="tss-topbar-icon-btn hidden sm:flex"
          onClick={downloadManual}
          title={t('topnavi.title.manual')}
          aria-label={t('topnavi.title.manual')}
        >
          <TssIcon iconKey="tss_manual" size={18} />
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
            <TssIcon iconKey="tss_dashboard" size={18} />
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
            <TssIcon iconKey="tss_upload" size={18} />
          </button>
        )}

        {/* Language selector */}
        {conf.DISPLAY_TRANSLATOR_ICON === true && (
          <LanguagesDropdown title={t('topnavi.title.language')} />
        )}

        {/* Products dropdown */}
        {conf.DISPLAY_PRODUCTS_ICON === true && (
          <ProductsDropdown />
        )}

        {/* Tenant selector */}
        <TenantDropdown />

        {/* Themes/Dark mode */}
        {conf.DISPLAY_THEMES_ICON === true && (
          <ThemesDropdown />
        )}

        {/* User profile dropdown */}
        <UserDropdown />
      </div>
    </header>
  );
};

export default Header;
