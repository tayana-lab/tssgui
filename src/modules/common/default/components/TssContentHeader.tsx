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
  const [versionOpen,      setVersionOpen]      = useState(false);

  const modulePath        = localStorage.getItem('modulePath')      ?? '';
  const moduleVersionType = localStorage.getItem('moduleVersionType') ?? '0';
  const moduleHeading     = localStorage.getItem('moduleHeading')   ?? '';
  const manual            = localStorage.getItem('manual')          ?? '';
  const landingPage       = localStorage.getItem('landingPage')     ?? '';

  /* Normalise -> to / */
  const breadcrumbParts = modulePath
    ? modulePath.split('->').map((s) => s.trim()).filter(Boolean)
    : [];

  useEffect(() => {
    setSelectedVersion(t('topnavi.label.version') + ' 1');
  }, [t('topnavi.label.version')]);

  useEffect(() => {
    setFilePathIncluded(!!(manual && manual.includes('File:')));
  }, [manual]);

  /* ---- Manual download ---- */
  const handleManualDownload = () => {
    if (!manual) return;
    const cleanedFilePath = manual.replace(/^File:\//, '');
    const filePath = cleanedFilePath.split('/').slice(0, -1).join('/');
    const fileName = cleanedFilePath.substring(cleanedFilePath.lastIndexOf('/') + 1);
    const url = `${TssConf.SERVER_JS_API_URI}/download?filePath=${encodeURIComponent(filePath)}&fileName=${encodeURIComponent(fileName)}`;
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

  const handleManualClick = () => {
    if (filePathIncluded) handleManualDownload();
    else setManualModalOpen(true);
  };

  /* ---- Home navigation ---- */
  const handleHomeClick = () => {
    localStorage.setItem('modulePath', '');
    localStorage.setItem('moduleVersionType', '0');
    if (landingPage === 'SiteMap') {
      localStorage.setItem('moduleHeading', 'Sitemap');
      navigate('/sitemap');
    } else {
      localStorage.setItem('moduleHeading', 'Dashboard');
      navigate('/dashboard');
    }
  };

  return (
    <>
      {/*
       * Single-row page header:
       *  LEFT  — page title
       *  RIGHT — breadcrumb trail + optional controls
       * Height is 44px matching the topbar.
       */}
      <section className="tss-page-header" aria-label="Page header">

        {/* Page title */}
        <h2 className="tss-page-title">{moduleHeading}</h2>

        {/* Right zone: breadcrumb + version + manual */}
        <div className="flex items-center gap-3 shrink-0">

          {/* Manual button — only when inside a module */}
          {modulePath !== '' && (
            <button
              type="button"
              className="tss-topbar-icon-btn"
              title="View manual"
              onClick={handleManualClick}
              aria-label="Open manual"
            >
              <TssIcon iconKey="tss_manual" size={14} />
            </button>
          )}

          {/* Breadcrumb */}
          <nav className="tss-breadcrumb" aria-label="Breadcrumb">
            <span
              className="tss-breadcrumb-link"
              onClick={handleHomeClick}
              role="link"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleHomeClick()}
            >
              Home
            </span>

            {breadcrumbParts.map((part, idx) => (
              <React.Fragment key={idx}>
                <span className="tss-breadcrumb-sep" aria-hidden="true">/</span>
                {idx === breadcrumbParts.length - 1 ? (
                  <span className="tss-breadcrumb-current">{part}</span>
                ) : (
                  <span className="tss-breadcrumb-link">{part}</span>
                )}
              </React.Fragment>
            ))}
          </nav>

          {/* Version selector */}
          {moduleVersionType !== '0' && moduleVersionType !== null && (
            <div className="relative">
              <button
                type="button"
                className="tss-btn-outline flex items-center gap-1"
                style={{ padding: '0.125rem 0.5rem', fontSize: '0.6875rem' }}
                onClick={() => setVersionOpen((v) => !v)}
              >
                {selectedVersion}
                <i className="fas fa-chevron-down" style={{ fontSize: '9px' }} />
              </button>

              {versionOpen && (
                <div
                  className="tss-dropdown"
                  style={{ right: 0, top: 'calc(100% + 4px)', minWidth: '110px' }}
                >
                  {[1, 2, 3].map((v) => (
                    <div
                      key={v}
                      className="tss-dropdown-item"
                      onClick={() => {
                        setSelectedVersion(t('topnavi.label.version') + ` ${v}`);
                        setVersionOpen(false);
                      }}
                    >
                      {t('topnavi.label.version')} {v}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Manual text modal */}
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
