import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TssConf from "@app/modules/conf/TssGui.json";
import productFeatures from '@app/modules/conf/Products.json';

/* ────────────────────────────────────────────────────────────
   Panel — used when PRODUCT_ID != 0 (single-product mode)
   Shows a module header + flat list of sub-items
   ──────────────────────────────────────────────────────────── */
const Panel = ({ module, submodules, onItemClick }) => {
  const renderItems = (items, depth = 0) =>
    items.map((item) => {
      const icon = item.moduleIcon || 'fa fa-circle';
      return (
        <li key={item.moduleId}>
          <a
            href="javascript:void(0);"
            onClick={() => onItemClick(item)}
            className="flex items-center gap-2 rounded transition-colors"
            style={{
              padding:    '0.25rem 0.375rem',
              fontSize:   '0.8125rem',
              color:      'var(--color-text-secondary)',
              fontWeight: 400,
              marginLeft: depth > 0 ? `${depth * 12}px` : 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-sidebar-hover)';
              e.currentTarget.style.color = 'var(--color-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '';
              e.currentTarget.style.color = 'var(--color-text-secondary)';
            }}
          >
            <i
              className={icon}
              style={{ width: '14px', fontSize: '10px', flexShrink: 0, opacity: 0.6 }}
            />
            <span className="truncate">{item.moduleHeading}</span>
          </a>

          {item.submodules && item.submodules.length > 0 && (
            <ul className="list-none m-0 p-0">
              {renderItems(item.submodules, depth + 1)}
            </ul>
          )}
        </li>
      );
    });

  return (
    <div className="tss-card flex flex-col h-full">
      {/* Card header */}
      <div
        className="tss-card-header no-collapse"
        style={{
          background:  'var(--color-card-header-bg)',
          borderBottom: '1px solid var(--color-card-border)',
        }}
      >
        <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
          {module.moduleHeading}
        </span>
      </div>

      {/* Card body */}
      <div className="tss-card-body flex-1" style={{ padding: '0.75rem' }}>
        <ul className="list-none m-0 p-0 space-y-0.5">
          {renderItems(submodules)}
        </ul>
      </div>
    </div>
  );
};

/* ────────────────────────────────────────────────────────────
   Product card — used when PRODUCT_ID == 0 (hub mode)
   ──────────────────────────────────────────────────────────── */
const aliasLabelMap = {
  BMP:        'Bulk Messaging',
  Monitoring: 'AMS',
  Analytics:  'Advanced Analytics',
  MCA:        'Call Mgt Services',
};

const ProductCard = ({ product, onRedirect }) => {
  const [hovered, setHovered] = useState(false);
  const isDisabled = product.status == 0;
  const label = aliasLabelMap[product.productName] || product.productName;
  const features = productFeatures[product.productId] || [];

  return (
    <div
      className="tss-card flex flex-col h-full cursor-pointer"
      onClick={!isDisabled ? () => onRedirect(product.productUrl, product.productId) : undefined}
      onMouseEnter={() => !isDisabled && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        opacity:       isDisabled ? 0.45 : 1,
        pointerEvents: isDisabled ? 'none' : 'auto',
        transition:    'box-shadow 150ms ease, border-color 150ms ease',
        boxShadow:     hovered ? 'var(--shadow-md)' : undefined,
        borderColor:   hovered ? 'var(--color-primary)' : undefined,
        minHeight:     '200px',
      }}
    >
      {/* Header */}
      <div
        className="tss-card-header no-collapse"
        style={{
          borderBottom: '1px solid var(--color-card-border)',
          justifyContent: 'center',
        }}
      >
        <span style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: '0.875rem' }}>
          {label}
        </span>
        {isDisabled && (
          <span
            className="tss-badge tss-badge-neutral ml-auto"
            style={{ fontSize: '0.625rem' }}
          >
            Unavailable
          </span>
        )}
      </div>

      {/* Body — image by default, features on hover */}
      <div
        className="tss-card-body flex-1 flex flex-col items-center justify-center"
        style={{ padding: '1rem', position: 'relative', overflow: 'hidden', minHeight: '140px' }}
      >
        {!hovered ? (
          <>
            <img
              src={`/images/${product.productName}.svg`}
              alt={label}
              style={{ maxHeight: '96px', maxWidth: '100%', objectFit: 'contain', marginBottom: '0.75rem' }}
                onError={(e) => { e.target.style.display = 'none'; }}
            />
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
              More info &rarr;
            </span>
          </>
        ) : (
          <div style={{ width: '100%', height: '100%' }}>
            <p
              style={{
                fontSize:    '0.6875rem',
                fontWeight:  600,
                color:       'var(--color-primary)',
                marginBottom: '0.375rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Features
            </p>
            <ul
              className="list-none m-0 p-0"
              style={{ maxHeight: '120px', overflowY: 'auto' }}
            >
              {features.length > 0 ? features.map((f, i) => (
                <li
                  key={i}
                  style={{
                    display:      'flex',
                    alignItems:   'flex-start',
                    gap:          '0.375rem',
                    fontSize:     '0.75rem',
                    color:        'var(--color-text-secondary)',
                    paddingBottom: '0.2rem',
                    lineHeight:   '1.4',
                  }}
                >
                  <span style={{ color: 'var(--color-primary)', flexShrink: 0, marginTop: '2px' }}>&#x2022;</span>
                  <span>{f}</span>
                </li>
              )) : (
                <li style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                  No features listed.
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

/* ────────────────────────────────────────────────────────────
   SiteMap — root component
   ──────────────────────────────────────────────────────────── */
const SiteMap = () => {
  const [modules,        setModules]        = useState([]);
  const [productDetails, setProductDetails] = useState([]);
  const navigate = useNavigate();

  const username  = localStorage.getItem('username');
  const password  = atob(localStorage.getItem('password') ?? '');
  const acctId    = localStorage.getItem('acctID');

  /* Load modules (single-product mode) */
  useEffect(() => {
    const modulesJSON = localStorage.getItem('productModules');
    if (modulesJSON) {
      try { setModules(JSON.parse(modulesJSON)); } catch { /* ignore */ }
    }
  }, []);

  /* Fetch product list (hub mode) */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          `${TssConf.SERVER_JS_API_URI}/productDetails?acctId=${acctId}&tenantCode=${localStorage.getItem('tenantCode')}`
        );
        if (!res.ok) throw new Error('Failed to fetch product details');
        setProductDetails(await res.json());
      } catch { /* ignore */ }
    };
    fetchProducts();
  }, []);

  /* Item navigation (single-product mode) */
  const handleItemClick = (submodule) => {
    if (!submodule.modulePage) return;
    localStorage.setItem('moduleVersionType', submodule.versionType ?? '0');
    localStorage.setItem('modulePath',        submodule.modulePathHierarchy ?? '');
    localStorage.setItem('moduleHeading',     submodule.moduleHeading ?? '');
    localStorage.setItem('manual',            submodule.helpText ?? '');
    navigate(submodule.modulePage);
  };

  /* Product redirect (hub mode) */
  const handleRedirect = async (url, productId) => {
    try {
      const res = await fetch(`${TssConf.SERVER_JS_API_URI}/generateToken`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ username, password, productId }),
      });
      if (!res.ok) throw new Error('Auth failed');
      const { token } = await res.json();

      if (productId == 70 || productId == 90) {
        window.open(url, '_blank');
      } else {
        window.location.href = `${url}?token=${token}`;
      }
    } catch { /* ignore */ }
  };

  /* ---- Render ---- */

  /* Hub mode: PRODUCT_ID == '0' */
  if (TssConf.PRODUCT_ID == '0') {
    const visibleProducts = productDetails.filter(
      (p) => p.productId !== TssConf.PRODUCT_ID
    );

    if (visibleProducts.length === 0) {
      return (
        <div className="flex items-center justify-center" style={{ minHeight: '360px' }}>
          <div className="text-center">
            <div
              className="flex items-center justify-center w-12 h-12 rounded-full mx-auto mb-4"
              style={{ backgroundColor: 'var(--color-primary-light)' }}
            >
              <i className="fas fa-inbox" style={{ color: 'var(--color-primary)', fontSize: '20px' }} />
            </div>
            <p className="tss-section-title mb-1">No Products Available</p>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
              Your product catalog will appear here once configured.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div
        className="grid gap-4"
        style={{
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        }}
      >
        {visibleProducts.map((product) => (
          <ProductCard
            key={product.productId}
            product={product}
            onRedirect={handleRedirect}
          />
        ))}
      </div>
    );
  }

  /* Single-product mode: PRODUCT_ID != '0' */
  return (
    <div
      className="grid gap-4"
      style={{
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
      }}
    >
      {modules.map((module) => (
        <Panel
          key={module.moduleId}
          module={module}
          submodules={module.submodules || []}
          onItemClick={handleItemClick}
        />
      ))}
    </div>
  );
};

export default SiteMap;
