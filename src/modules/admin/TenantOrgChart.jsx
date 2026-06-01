import React, { useState, useEffect, useRef, useCallback } from 'react';
import TssSpinner from '@app/modules/common/default/components/TssSpinner';
import { useTranslation } from 'react-i18next';
import tssguiConf from '@app/modules/conf/TssGui.json';
import TenantOrgChartView from '@app/modules/admin/TenantOrgChartView';

const url = tssguiConf.SERVER_JS_API_URI;

// ── Demo / fallback data ─────────────────────────────────────────────────────
// Structure: Telna → Tenant → Tenant Admin → Sub-Tenant (created by admin) → User
const DEMO_TENANTS = [
  {
    tenantId: 1, tenantName: 'Airtel India', tenantCode: 'airtel_in',
    domainName: 'airtel.in', status: 1,
    accounts: [
      {
        name: 'Rajesh Kumar', role: 'Tenant Admin', status: 1,
        subTenants: [
          {
            tenantId: '1-1', tenantName: 'Airtel Tenant 1', tenantCode: 'airtel_t1', status: 1,
            users: [
              { name: 'Priya Sharma', role: 'User', status: 1 },
              { name: 'Arjun Mehta',  role: 'User', status: 0 },
            ],
          },
        ],
      },
    ],
  },
  {
    tenantId: 2, tenantName: 'Jio', tenantCode: 'jio_in',
    domainName: 'jio.com', status: 1,
    accounts: [
      {
        name: 'Rajesh Kumar', role: 'Tenant Admin', status: 1,
        subTenants: [
          {
            tenantId: '2-1', tenantName: 'Jio Tenant 1', tenantCode: 'jio_t1', status: 1,
            users: [
              { name: 'Vikram Patel', role: 'User', status: 1 },
            ],
          },
        ],
      },
      {
        name: 'Ananya Singh', role: 'Tenant Admin', status: 1,
        subTenants: [
          {
            tenantId: '2-2', tenantName: 'Jio Tenant 2', tenantCode: 'jio_t2', status: 1,
            users: [
              { name: 'Vikram Patel', role: 'User', status: 1 },
            ],
          },
        ],
      },
    ],
  },
  {
    tenantId: 3, tenantName: 'Vodafone Idea', tenantCode: 'vi_in',
    domainName: 'myvi.in', status: 1,
    accounts: [
      {
        name: 'Neha Reddy', role: 'Tenant Admin', status: 1,
        subTenants: [
          {
            tenantId: '3-1', tenantName: 'VI Tenant 1', tenantCode: 'vi_t1', status: 1,
            users: [
              { name: 'Suresh Nair', role: 'User', status: 0 },
              { name: 'Meena Iyer',  role: 'User', status: 1 },
            ],
          },
        ],
      },
    ],
  },
];

// ── Helpers ──────────────────────────────────────────────────────────────────
// Tree: Telna → Tenant → Tenant Admin → Sub-Tenant → User
const buildTree = (tenants) => ({
  id: 'root',
  label: 'Telna',
  type: 'root',
  children: tenants.map((t) => ({
    id: `tenant-${t.tenantId}`,
    label: t.tenantName,
    sublabel: t.tenantCode,
    domain: t.domainName,
    status: t.status,
    type: 'tenant',
    children: (t.accounts || []).map((admin, idx) => ({
      id: `admin-${t.tenantId}-${idx}`,
      label: admin.name,
      sublabel: admin.role,
      status: admin.status,
      type: 'account',
      children: (admin.subTenants || []).map((st, stIdx) => ({
        id: `subtenant-${t.tenantId}-${idx}-${stIdx}`,
        label: st.tenantName,
        sublabel: st.tenantCode,
        status: st.status,
        type: 'tenant',
        children: (st.users || []).map((u, uIdx) => ({
          id: `user-${t.tenantId}-${idx}-${stIdx}-${uIdx}`,
          label: u.name,
          sublabel: u.role,
          status: u.status,
          type: 'account',
        })),
      })),
    })),
  })),
});

const collectIds = (node) => {
  const ids = [node.id];
  (node.children || []).forEach((c) => ids.push(...collectIds(c)));
  return ids;
};

// ── Component ────────────────────────────────────────────────────────────────
const TenantOrgChart = () => {
  const [t] = useTranslation();
  const [loading, setLoading]       = useState(false);
  const [tree, setTree]             = useState(null);
  const [collapsed, setCollapsed]   = useState(new Set());
  const [search, setSearch]         = useState('');
  const [zoom, setZoom]             = useState(1);
  const [highlighted, setHighlighted] = useState(new Set());

  // ── Fetch (falls back to demo data if API not ready) ─────────────────────
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const sessionId = localStorage.getItem('sessionID');
      const clientId  = localStorage.getItem('acctID');
      const clientIp  = localStorage.getItem('clientIP');
      const serverIp  = localStorage.getItem('serverIP');

      const res = await fetch(`${url}/tenant/list`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ i_session_id: sessionId, i_client_id: clientId,
                               i_client_ip: clientIp,   i_server_ip: serverIp }),
      });
      if (res.ok) {
        const raw = await res.json();
        const tenants = Array.isArray(raw) ? raw : raw.data || [];
        if (tenants.length > 0) {
          setTree(buildTree(tenants));
          return;
        }
      }
    } catch (_) { /* fall through to demo */ }
    // Demo fallback
    setTree(buildTree(DEMO_TENANTS));
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // initialise all nodes expanded
  useEffect(() => {
    if (tree) setCollapsed(new Set());
  }, [tree]);

  // ── Search highlighting ───────────────────────────────────────────────────
  useEffect(() => {
    if (!tree || !search.trim()) { setHighlighted(new Set()); return; }
    const q = search.toLowerCase();
    const matched = new Set();
    const walk = (node) => {
      if ((node.label || '').toLowerCase().includes(q) ||
          (node.sublabel || '').toLowerCase().includes(q)) {
        matched.add(node.id);
      }
      (node.children || []).forEach(walk);
    };
    walk(tree);
    setHighlighted(matched);
  }, [search, tree]);

  // ── Expand / Collapse ─────────────────────────────────────────────────────
  const toggleNode = (id) =>
    setCollapsed((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const expandAll = () => setCollapsed(new Set());

  const collapseAll = () => {
    if (!tree) return;
    const allIds = collectIds(tree);
    setCollapsed(new Set(allIds));
  };

  // ── Zoom ──────────────────────────────────────────────────────────────────
  const zoomIn  = () => setZoom((z) => Math.min(z + 0.1, 2));
  const zoomOut = () => setZoom((z) => Math.max(z - 0.1, 0.4));
  const zoomReset = () => setZoom(1);

  return (
    <>
      {loading && <TssSpinner isLoading={loading} />}
      <TenantOrgChartView
        tree={tree}
        collapsed={collapsed}
        highlighted={highlighted}
        search={search}
        zoom={zoom}
        onToggleNode={toggleNode}
        onExpandAll={expandAll}
        onCollapseAll={collapseAll}
        onSearchChange={setSearch}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onZoomReset={zoomReset}
        onRefresh={loadData}
      />
    </>
  );
};

export default TenantOrgChart;
