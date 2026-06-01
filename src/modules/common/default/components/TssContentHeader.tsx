import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import TssIcon from '@modules/common/default/components/TssIcon';
import TssConf from '@modules/conf/TssGui.json';
import TssModal from '@modules/common/default/components/TssModal';
import { useNavigate } from 'react-router-dom';

const ContentHeader = () => {
  const [t] = useTranslation();
  const navigate = useNavigate();

  const [selectedVersion,  setSelectedVersion]  = useState('Version 1');
  const [filePathIncluded, setFilePathIncluded] = useState(false);
  const [manualModalOpen,  setManualModalOpen]  = useState(false);

  const modulePath      = localStorage.getItem('modulePath');
  const moduleVersionType = localStorage.getItem('moduleVersionType');
  const moduleHeading   = localStorage.getItem('moduleHeading');
  const manual          = localStorage.getItem('manual');
  const landingPage     = localStorage.getItem('landingPage');

  /* ---- Normalise breadcrumb arrows ---- */
  const updatedModulePath = modulePath
    ? modulePath.replace(/->/g, '  /  ')
    : '';

  useEffect(() => {
    setSelectedVersion(t('topnavi.label.version') + ' 1');
  }, [t('topnavi.label.version')]);

  useEffect(() => {
    setFilePathIncluded(!!(manual && manual.includes('File:')));
  }, [manual]);

  /* ---- Manual download (file:// path) ---- */
  const handleManualDownload = () => {
    if (!manual) return;
    const cleanedFilePath = manual.replace(/^File:\//, '');
    const filePath  = cleanedFilePath.split('/').slice(0, -1).join('/');
    const fileName  = cleanedFilePath.substring(cleanedFilePath.lastIndexOf('/') + 1);
    const url = `${TssConf.SERVER_JS_API_URI}/download?filePath=${encodeURIComponent(filePath)}&fileName=${encodeURIComponent(fileName)}`;

    fetch(url)
      .then((r) => (r.ok ? r.blob() : Promise.reject('Bad response')))
      .then((blob) => {
        const fileURL = window.URL.createObjectURL(new Blob([blob]));
        const link    = document.createElement('a');
        link.href     = fileURL;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      })
      .catch((e) => console.error('Error downloading file:', e));
  };

  /* ---- Manual icon click: open inline modal or download file ---- */
  const handleManualClick = () => {
    if (filePathIncluded) {
      handleManualDownload();
    } else {
      setManualModalOpen(true);
    }
  };

  /* ---- Home breadcrumb click ---- */
  const handleHomeClick = () => {
    if (landingPage === 'SiteMap') {
      localStorage.setItem('modulePath', '');
      localStorage.setItem('moduleVersionType', '0');
      localStorage.setItem('moduleHeading', 'Sitemap');
      navigate('/sitemap');
    } else {
      localStorage.setItem('modulePath', '');
      localStorage.setItem('moduleVersionType', '0');
      localStorage.setItem('moduleHeading', 'Dashboard');
      navigate('/dashboard');
    }
  };

  return (
    <>
      <section
        className="tss-content-header"
        aria-label="Page header"
      >
        {/* Left: page title */}
        <h2 className="tss-page-title m-0">{moduleHeading}</h2>

        {/* Right: breadcrumb + version */}
        <nav className="tss-breadcrumb" aria-label="Breadcrumb">
          {/* Manual icon — only shown when there is a module path */}
          {modulePath !== '' && (
            <button
              type="button"
              className="tss-topbar-icon-btn w-auto h-auto px-1"
              title="Click to get manual"
              onClick={handleManualClick}
              aria-label="Open manual"
            >
              <TssIcon iconKey="tss_manual" className="tss-primary-icon" />
            </button>
          )}

          <span>&nbsp;</span>

          {/* Home link */}
          <a
            className="tss-breadcrumb-home"
            onClick={handleHomeClick}
            style={{ cursor: 'pointer' }}
            role="link"
          >
            Home
          </a>

          {updatedModulePath && (
            <>
              <span style={{ margin: '0 4px', color: 'var(--color-text-muted)' }}>/</span>
              <span style={{ color: 'var(--color-text-muted)' }}>{updatedModulePath}</span>
            </>
          )}

          {/* Version selector */}
          {moduleVersionType !== '0' && moduleVersionType !== null && (
            <div className="relative ml-2 inline-block">
              <div
                className="flex items-center gap-1 px-2 py-0.5 rounded border text-xs cursor-pointer"
                style={{
                  borderColor: 'var(--color-border)',
                  backgroundColor: 'var(--color-bg-alt)',
                  color: 'var(--color-text)',
                }}
              >
                {selectedVersion}
                <i className="fas fa-chevron-down text-xs" style={{ color: 'var(--color-text-muted)' }} />
              </div>
              {/* Version dropdown (simple) */}
              <div
                className="absolute right-0 top-full z-50 tss-dropdown mt-1"
                style={{ minWidth: '100px' }}
              >
                {[1, 2, 3].map((v) => (
                  <div
                    key={v}
                    className="tss-dropdown-item"
                    onClick={() =>
                      setSelectedVersion(t('topnavi.label.version') + ` ${v}`)
                    }
                  >
                    {t('topnavi.label.version')} {v}
                  </div>
                ))}
              </div>
            </div>
          )}
        </nav>
      </section>

      {/* ---- Manual text modal ---- */}
      <TssModal
        modalId="tssManualModal"
        modalBodyId="tssManualModalBody"
        modalHeaderId="tssManualModalHeader"
        header="Manual"
        className="modal-lg"
        isOpen={manualModalOpen}
        onClose={() => setManualModalOpen(false)}
      >
        <div style={{ whiteSpace: 'pre-wrap', fontSize: '13px', lineHeight: 1.6 }}>
          {manual}
        </div>
      </TssModal>
    </>
  );
};

export default ContentHeader;
