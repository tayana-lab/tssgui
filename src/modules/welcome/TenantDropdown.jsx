import React, { useState } from 'react';
import TssIcon from '@app/modules/common/default/components/TssIcon';
import TenantSelectPage from '@app/modules/welcome/TenantSelectPage';

const avatarColors = [
  '#1565c0', '#6a1b9a', '#00695c', '#e65100',
  '#558b2f', '#c62828', '#4527a0', '#00838f',
];

// Dummy per-user tenant mapping — replace with real API data
const dummyUserTenantMap = {
  john:  [{ TENANT_ID: 100, TENANT_NAME: 'Airtel India',  TENANT_CODE: 'airtel_in' }, { TENANT_ID: 200, TENANT_NAME: 'Jio', TENANT_CODE: 'jio_in' }, { TENANT_ID: 300, TENANT_NAME: 'Vodafone Idea', TENANT_CODE: 'vi_in' }],
  jane:  [{ TENANT_ID: 200, TENANT_NAME: 'Jio', TENANT_CODE: 'jio_in' }, { TENANT_ID: 300, TENANT_NAME: 'Vodafone Idea', TENANT_CODE: 'vi_in' }],
  bob:   [{ TENANT_ID: 300, TENANT_NAME: 'Vodafone Idea', TENANT_CODE: 'vi_in' }],
  alice: [{ TENANT_ID: 400, TENANT_NAME: 'BSNL', TENANT_CODE: 'bsnl_in' }, { TENANT_ID: 500, TENANT_NAME: 'Test Operator', TENANT_CODE: 'test01' }, { TENANT_ID: 600, TENANT_NAME: 'Demo Tenant', TENANT_CODE: 'demo' }],
  raj:   [{ TENANT_ID: 100, TENANT_NAME: 'Airtel India',  TENANT_CODE: 'airtel_in' }],
  'tenantadmin@tayana.in': [{ TENANT_ID: 100, TENANT_NAME: 'Airtel India',  TENANT_CODE: 'airtel_in' }, { TENANT_ID: 200, TENANT_NAME: 'Jio', TENANT_CODE: 'jio_in' }, { TENANT_ID: 300, TENANT_NAME: 'Vodafone Idea', TENANT_CODE: 'vi_in' }],
};

const TenantDropdown = () => {
  const [isHovered, setIsHovered]           = useState(false);
  const [showSwitchPage, setShowSwitchPage] = useState(false);

  const username        = (localStorage.getItem('username') || '').toLowerCase();
  const tenants         = dummyUserTenantMap[username] || [];
  const currentTenantId = parseInt(localStorage.getItem('selectedTenantId') || '0');
  const currentName     = localStorage.getItem('selectedTenantName') || 'Tenant';

  const handleSwitch = (tenant) => {
    localStorage.setItem('selectedTenantId',   String(tenant.TENANT_ID));
    localStorage.setItem('selectedTenantName', tenant.TENANT_NAME);
    localStorage.setItem('selectedTenantCode', tenant.TENANT_CODE);
    setIsHovered(false);
    window.location.reload();
  };

  // Only show dropdown if user has more than 1 tenant
  if (tenants.length <= 1) return null;

  return (
    <>
      <div className="ml-4" />
      {showSwitchPage && (
        <TenantSelectPage
          tenants={tenants}
          userName={username}
          onSelect={(tenant) => {
            handleSwitch(tenant);
            setShowSwitchPage(false);
          }}
        />
      )}

      <li style={{ listStyle: 'none' }}>
        <div
          className="dropdown"
          style={{ position: 'relative' }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Topnav icon */}
          <a style={{ fontWeight: 'normal', cursor: 'pointer' }} title="Switch Tenant">
            <div className="mt-2">
              <TssIcon iconKey="tss_tenantSwitch" title="Switch Tenant" />
            </div>
          </a>

          {/* Dropdown panel */}
          <div
            className="dropdown-menu dropdown-menu-right"
            style={{
              position: 'absolute',
              top: '18px',
              right: '-4px',
              left: 'auto',
              minWidth: '240px',
              background: 'linear-gradient(180deg, #FFFFFF 0%, #DFE8F9 100%)',
              boxShadow: '0px 0px 4px 0px #00000040',
              padding: '10px',
              display: isHovered ? 'block' : 'none',
              zIndex: 9999,
            }}
          >
            {/* Header */}
            <div style={{
              fontWeight: 'bold',
              textAlign: 'center',
              fontSize: '0.95rem',
              color: '#3C5A94',
              paddingBottom: '6px',
              borderBottom: '2px solid #3C5A94',
              marginBottom: '8px',
            }}>
              Switch Tenant
            </div>

            {/* Tenant items */}
            {tenants.map((tenant, idx) => {
              const color      = avatarColors[idx % avatarColors.length];
              const isCurrent  = tenant.TENANT_ID === currentTenantId;
              const initials   = tenant.TENANT_NAME.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();

              return (
                <div
                  key={tenant.TENANT_ID}
                  onClick={() => !isCurrent && handleSwitch(tenant)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    cursor: isCurrent ? 'default' : 'pointer',
                    background: isCurrent ? `${color}18` : 'transparent',
                    border: isCurrent ? `1.5px solid ${color}` : '1.5px solid transparent',
                    marginBottom: '4px',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) => { if (!isCurrent) e.currentTarget.style.background = '#e3f0ff'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = isCurrent ? `${color}18` : 'transparent'; }}
                >
                  {/* Avatar */}
                  <div style={{
                    width: '34px', height: '34px', borderRadius: '50%',
                    background: color, color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: '13px', flexShrink: 0,
                  }}>
                    {initials}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, color: '#1a237e', fontSize: '13px' }}>{tenant.TENANT_NAME}</div>
                    <div style={{ fontSize: '11px', color: '#607d8b' }}>{tenant.TENANT_CODE}</div>
                  </div>

                  {/* Active badge */}
                  {isCurrent && (
                    <span style={{
                      fontSize: '10px', background: color, color: '#fff',
                      borderRadius: '10px', padding: '1px 8px', fontWeight: 600,
                    }}>Active</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </li>
    </>
  );
};

export default TenantDropdown;
