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

      <div
        className="relative flex items-center"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Trigger button */}
        <button
          type="button"
          className="tss-topbar-icon-btn"
          title="Switch Tenant"
          aria-label="Switch Tenant"
          aria-haspopup="true"
          aria-expanded={isHovered}
        >
          <TssIcon iconKey="tss_tenantSwitch" title="Switch Tenant" />
        </button>

        {/* Dropdown panel */}
        {isHovered && (
          <div
            className="tss-dropdown"
            style={{ top: '36px', right: 0, position: 'absolute', minWidth: '240px' }}
            role="menu"
            aria-label="Tenant switcher"
          >
            {/* Panel header */}
            <div className="px-3 py-2 border-b" style={{ borderColor: 'var(--color-border)' }}>
              <p
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: 'var(--color-text-muted)' }}
              >
                Switch Tenant
              </p>
            </div>

            {/* Tenant list */}
            <div className="p-2 flex flex-col gap-1">
              {tenants.map((tenant, idx) => {
                const color     = avatarColors[idx % avatarColors.length];
                const isCurrent = tenant.TENANT_ID === currentTenantId;
                const initials  = tenant.TENANT_NAME
                  .split(' ')
                  .map((w) => w[0])
                  .slice(0, 2)
                  .join('')
                  .toUpperCase();

                return (
                  <button
                    key={tenant.TENANT_ID}
                    type="button"
                    role="menuitem"
                    onClick={() => !isCurrent && handleSwitch(tenant)}
                    disabled={isCurrent}
                    className="flex items-center gap-2.5 w-full rounded-md px-2.5 py-2 text-left transition-colors"
                    style={{
                      background: isCurrent
                        ? `color-mix(in srgb, ${color} 10%, transparent)`
                        : 'transparent',
                      border: `1.5px solid ${isCurrent ? color : 'transparent'}`,
                      cursor: isCurrent ? 'default' : 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      if (!isCurrent) e.currentTarget.style.background = 'var(--color-table-row-hover)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = isCurrent
                        ? `color-mix(in srgb, ${color} 10%, transparent)`
                        : 'transparent';
                    }}
                  >
                    {/* Avatar */}
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 text-white"
                      style={{ backgroundColor: color }}
                      aria-hidden="true"
                    >
                      {initials}
                    </div>

                    {/* Name + code */}
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-xs font-semibold truncate"
                        style={{ color: 'var(--color-text)' }}
                      >
                        {tenant.TENANT_NAME}
                      </p>
                      <p
                        className="text-xs truncate"
                        style={{ color: 'var(--color-text-muted)' }}
                      >
                        {tenant.TENANT_CODE}
                      </p>
                    </div>

                    {/* Active badge */}
                    {isCurrent && (
                      <span
                        className="text-xs font-semibold rounded-full px-2 py-0.5 text-white shrink-0"
                        style={{ backgroundColor: color }}
                      >
                        Active
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default TenantDropdown;
