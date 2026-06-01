import React, { useState } from 'react';
import TssConf from '@app/modules/conf/TssGui.json';
import '@app/modules/common/default/scss/Login.css';

interface Tenant {
  TENANT_ID: number;
  TENANT_NAME: string;
  TENANT_CODE: string;
}

interface Props {
  tenants: Tenant[];
  userName: string;
  onSelect: (tenant: Tenant) => void;
}

const TenantSelectPage: React.FC<Props> = ({ tenants, userName, onSelect }) => {
  const [hovered, setHovered] = useState<number | null>(null);
  const [selected, setSelected] = useState<number | null>(null);

  const handleSelect = (tenant: Tenant) => {
    setSelected(tenant.TENANT_ID);
    setTimeout(() => onSelect(tenant), 200);
  };

  const avatarColors = [
    '#1565c0', '#6a1b9a', '#00695c', '#e65100',
    '#558b2f', '#c62828', '#4527a0', '#00838f',
  ];

  return (
    <div className="login-screen-bg">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      {/* Logo */}
      <img
        src={`/images/${TssConf.PRODUCT_LOGO}`}
        alt="logo"
        style={{ height: '56px', marginBottom: '24px', objectFit: 'contain' }}
      />

      {/* Single card containing header + tenant cards */}
      <div style={{
        background: '#fff',
        borderRadius: '16px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
        padding: '52px 48px 80px 48px',
        maxWidth: '860px',
        width: '100%',
        textAlign: 'center',
        minHeight: '420px',
      }}>
        <div style={{ fontSize: '28px', marginBottom: '6px' }}>👋</div>
        <h2 style={{ margin: '0 0 6px', fontWeight: 700, color: '#1a237e', fontSize: '22px' }}>
          Welcome, {userName}
        </h2>
        <p style={{ color: '#607d8b', margin: '0 0 28px', fontSize: '14px' }}>
          Select a tenant to continue
        </p>

        {/* Tenant cards */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '20px',
          justifyContent: 'center',
        }}>
        {tenants.map((tenant, idx) => {
          const color = avatarColors[idx % avatarColors.length];
          const isHovered = hovered === tenant.TENANT_ID;
          const isSelected = selected === tenant.TENANT_ID;

          return (
            <div
              key={tenant.TENANT_ID}
              onClick={() => handleSelect(tenant)}
              onMouseEnter={() => setHovered(tenant.TENANT_ID)}
              onMouseLeave={() => setHovered(null)}
              style={{
                background: '#fff',
                borderRadius: '14px',
                boxShadow: isHovered || isSelected
                  ? `0 8px 32px rgba(0,0,0,0.18)`
                  : '0 2px 10px rgba(0,0,0,0.08)',
                padding: '28px 24px',
                width: '190px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
                transform: isHovered || isSelected ? 'translateY(-4px)' : 'none',
                transition: 'all 0.2s ease',
                border: isSelected ? `2px solid ${color}` : '2px solid transparent',
                outline: 'none',
              }}
            >
              {/* Avatar circle */}
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '22px',
                fontWeight: 700,
                color: '#fff',
                letterSpacing: '1px',
                flexShrink: 0,
              }}>
                {tenant.TENANT_NAME.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()}
              </div>

              {/* Name */}
              <div style={{
                fontWeight: 600,
                color: '#1a237e',
                fontSize: '15px',
                textAlign: 'center',
                lineHeight: 1.3,
              }}>
                {tenant.TENANT_NAME}
              </div>

              {/* Code badge */}
              <span style={{
                background: `${color}18`,
                color: color,
                borderRadius: '20px',
                padding: '2px 12px',
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.5px',
              }}>
                {tenant.TENANT_CODE}
              </span>
            </div>
          );
        })}
        </div>{/* end tenant cards row */}
      </div>{/* end single card */}

      {/* Footer note */}
      <p style={{ color: '#90a4ae', fontSize: '12px', marginTop: '28px' }}>
        {TssConf.PRODUCT_TITLE} · Tenant Selection
      </p>
      </div>{/* end flex column wrapper */}
    </div>
  );
};

export default TenantSelectPage;
