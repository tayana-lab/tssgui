import React, { useRef, useState, useEffect, useCallback } from 'react';
import TssIcon from '@app/modules/common/default/components/TssIcon';
import '@modules/common/default/scss/TssComponentsCss.scss';

// ── Colour palette per node type ─────────────────────────────────────────────
const TYPE_STYLE = {
  root:    { bg: '#1a237e', border: '#283593', text: '#fff', badge: null },
  tenant:  { bg: '#0d47a1', border: '#1565c0', text: '#fff', badge: null },
  group:   { bg: '#37474f', border: '#546e7a', text: '#eceff1', badge: null },
  account: { bg: '#4a148c', border: '#6a1b9a', text: '#fff', badge: null },
};

const STATUS_DOT = { 1: '#69f0ae', 0: '#ff5252' };

// ── Context menu ────────────────────────────────────────────────────────────
const ContextMenu = ({ x, y, node, onViewDetails, onClose }) => {
  useEffect(() => {
    const close = () => onClose();
    document.addEventListener('click', close);
    document.addEventListener('contextmenu', close);
    return () => {
      document.removeEventListener('click', close);
      document.removeEventListener('contextmenu', close);
    };
  }, [onClose]);

  return (
    <div
      style={{
        position: 'fixed',
        top: y,
        left: x,
        background: '#fff',
        border: '1px solid #dee2e6',
        borderRadius: '6px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
        zIndex: 99999,
        minWidth: '180px',
        overflow: 'hidden',
        fontSize: '13px',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div style={{
        padding: '7px 14px',
        background: '#f4f6f9',
        borderBottom: '1px solid #dee2e6',
        fontWeight: 600,
        fontSize: '12px',
        color: '#495057',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}>
        {node.label}
      </div>
      <ContextMenuItem
        icon="🔍"
        label="View Details"
        onClick={() => { onViewDetails(node); onClose(); }}
      />
    </div>
  );
};

const ContextMenuItem = ({ icon, label, onClick }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '9px 14px',
        cursor: 'pointer',
        color: '#212529',
        background: hovered ? '#f0f4ff' : 'transparent',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        transition: 'background 0.15s',
      }}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </div>
  );
};

// ── Single node card ─────────────────────────────────────────────────────────
const NodeCard = ({ node, collapsed, highlighted, onToggle, onContextMenu }) => {
  const hasChildren = node.children && node.children.length > 0;
  const isCollapsed = collapsed.has(node.id);
  const isHighlighted = highlighted.size > 0 && highlighted.has(node.id);
  const isDimmed = highlighted.size > 0 && !highlighted.has(node.id);
  const s = TYPE_STYLE[node.type] || TYPE_STYLE.group;

  const iconMap = {
    root: '🌐', tenant: '🏢', account: '👤', group: '👥',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Card */}
      <div
        onClick={() => hasChildren && onToggle(node.id)}
        onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); onContextMenu(e, node); }}
        style={{
          position: 'relative',
          background: s.bg,
          border: `2px solid ${isHighlighted ? '#ffeb3b' : s.border}`,
          borderRadius: '10px',
          padding: node.type === 'root' ? '10px 22px' : '8px 16px',
          minWidth: node.type === 'root' ? '140px' : node.type === 'tenant' ? '160px' : '130px',
          maxWidth: '200px',
          cursor: hasChildren ? 'pointer' : 'default',
          boxShadow: isHighlighted
            ? '0 0 0 3px #ffeb3b, 0 4px 16px rgba(0,0,0,0.4)'
            : '0 4px 12px rgba(0,0,0,0.35)',
          opacity: isDimmed ? 0.35 : 1,
          transition: 'all 0.25s ease',
          textAlign: 'center',
          userSelect: 'none',
        }}
      >
        {/* Status dot for tenant / account */}
        {node.status !== undefined && (
          <span style={{
            position: 'absolute', top: '6px', right: '8px',
            width: '9px', height: '9px', borderRadius: '50%',
            background: STATUS_DOT[node.status] || '#90a4ae',
            display: 'inline-block',
          }} title={node.status === 1 ? 'Active' : 'Inactive'} />
        )}

        {/* Icon + label */}
        <div style={{ fontSize: node.type === 'root' ? '20px' : '15px', marginBottom: '2px' }}>
          {iconMap[node.type] || '📋'}
        </div>
        <div style={{
          color: s.text,
          fontWeight: 700,
          fontSize: node.type === 'root' ? '13px' : '12px',
          lineHeight: 1.3,
          wordBreak: 'break-word',
        }}>
          {node.label}
        </div>
        {node.sublabel && (
          <div style={{ color: '#b0bec5', fontSize: '10px', marginTop: '2px' }}>
            {node.sublabel}
          </div>
        )}
        {node.domain && (
          <div style={{ color: '#80cbc4', fontSize: '10px', marginTop: '2px' }}>
            🔗 {node.domain}
          </div>
        )}

        {/* Expand / collapse badge */}
        {hasChildren && (
          <div style={{
            position: 'absolute', right: '-10px', top: '50%',
            transform: 'translateY(-50%)',
            background: isCollapsed ? '#ff9800' : '#37474f',
            color: '#fff',
            borderRadius: '50%',
            width: '20px', height: '20px',
            fontSize: '12px', lineHeight: '20px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
            zIndex: 2,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {isCollapsed ? '+' : '−'}
          </div>
        )}
      </div>
    </div>
  );
};

// ── Recursive tree renderer ──────────────────────────────────────────────────
const OrgNode = ({ node, collapsed, highlighted, onToggle, onContextMenu, depth = 0 }) => {
  const hasChildren = node.children && node.children.length > 0;
  const isCollapsed = collapsed.has(node.id);
  const visibleChildren = (!isCollapsed && hasChildren) ? node.children : [];

  const GAP = 16;
  const CONNECTOR_COLOR = '#546e7a';

  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
      {/* Self */}
      <NodeCard
        node={node}
        collapsed={collapsed}
        highlighted={highlighted}
        onToggle={onToggle}
        onContextMenu={onContextMenu}
      />

      {/* Children */}
      {visibleChildren.length > 0 && (
        <>
          {/* Horizontal stem from parent right to the vertical bar */}
          <div style={{ width: '22px', height: '2px', background: CONNECTOR_COLOR, flexShrink: 0 }} />

          {/* Children column — each child owns its connector segment */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: `${GAP}px` }}>
            {visibleChildren.map((child, idx) => {
              const isFirst = idx === 0;
              const isLast  = idx === visibleChildren.length - 1;
              const isOnly  = visibleChildren.length === 1;

              return (
                <div key={child.id} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                  {/* Connector: vertical bar + horizontal approach */}
                  <div style={{ position: 'relative', width: '22px', alignSelf: 'stretch' }}>
                    {/* Vertical line connecting siblings */}
                    {!isOnly && (
                      <div style={{
                        position: 'absolute',
                        left: 0,
                        top:    isFirst ? '50%' : `calc(-${GAP / 2}px)`,
                        bottom: isLast  ? '50%' : `calc(-${GAP / 2}px)`,
                        width: '2px',
                        background: CONNECTOR_COLOR,
                      }} />
                    )}
                    {/* Horizontal approach from vertical bar to child card */}
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      left: 0,
                      width: '100%',
                      height: '2px',
                      background: CONNECTOR_COLOR,
                    }} />
                  </div>

                  <OrgNode
                    node={child}
                    collapsed={collapsed}
                    highlighted={highlighted}
                    onToggle={onToggle}
                    onContextMenu={onContextMenu}
                    depth={depth + 1}
                  />
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

// ── Toolbar ──────────────────────────────────────────────────────────────────
const Toolbar = ({
  search, onSearchChange,
  zoom, onZoomIn, onZoomOut, onZoomReset,
  onExpandAll, onCollapseAll, onRefresh,
}) => (
  <div style={{
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 16px',
    background: '#f4f6f9',
    borderRadius: '8px',
    marginBottom: '16px',
  }}>
    {/* Search */}
    <div style={{ position: 'relative', flex: '1 1 200px' }}>
      <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#6c757d', fontSize: '14px' }}>🔍</span>
      <input
        type="text"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search tenants, accounts…"
        style={{
          width: '100%',
          paddingLeft: '32px',
          paddingRight: '10px',
          paddingTop: '7px',
          paddingBottom: '7px',
          background: '#fff',
          border: '1px solid #ced4da',
          borderRadius: '6px',
          color: '#212529',
          fontSize: '13px',
          outline: 'none',
          boxSizing: 'border-box',
        }}
      />
    </div>

    {/* Divider */}
    <div style={{ width: '1px', height: '28px', background: '#dee2e6' }} />

    {/* Zoom controls */}
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <ToolBtn onClick={onZoomOut}  title="Zoom Out"  label="−" />
      <span style={{ color: '#495057', fontSize: '12px', minWidth: '38px', textAlign: 'center' }}>
        {Math.round(zoom * 100)}%
      </span>
      <ToolBtn onClick={onZoomIn}   title="Zoom In"   label="+" />
      <ToolBtn onClick={onZoomReset} title="Reset Zoom" label="⊙" />
    </div>

    {/* Divider */}
    <div style={{ width: '1px', height: '28px', background: '#dee2e6' }} />

    {/* Expand / Collapse */}
    <div style={{ display: 'flex', gap: '6px' }}>
      <ToolBtn onClick={onExpandAll}   title="Expand All"   label="⊞" accent="#43a047" />
      <ToolBtn onClick={onCollapseAll} title="Collapse All" label="⊟" accent="#e53935" />
    </div>

    {/* Divider */}
    <div style={{ width: '1px', height: '28px', background: '#dee2e6' }} />

    {/* Refresh */}
    <ToolBtn onClick={onRefresh} title="Refresh" label="↺" />
  </div>
);

const ToolBtn = ({ onClick, title, label, accent = '#546e7a' }) => (
  <button
    onClick={onClick}
    title={title}
    style={{
      background: accent,
      border: 'none',
      borderRadius: '6px',
      color: '#fff',
      width: '30px', height: '30px',
      fontSize: '16px', lineHeight: '30px',
      cursor: 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      transition: 'opacity 0.2s',
    }}
    onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.75')}
    onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
  >
    {label}
  </button>
);

// ── Legend ───────────────────────────────────────────────────────────────────
const Legend = () => (
  <div style={{
    display: 'flex', flexWrap: 'wrap', gap: '12px',
    padding: '8px 14px',
    background: '#f4f6f9',
    borderRadius: '8px',
    marginBottom: '14px',
    fontSize: '11px',
    color: '#495057',
  }}>
    {[
      { color: TYPE_STYLE.root.bg,    label: 'Platform Root' },
      { color: TYPE_STYLE.tenant.bg,  label: 'Tenant' },
      { color: TYPE_STYLE.group.bg,   label: 'Group' },
      { color: TYPE_STYLE.account.bg, label: 'Account' },
    ].map(({ color, label }) => (
      <span key={label} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
        <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: color, display: 'inline-block' }} />
        {label}
      </span>
    ))}
    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
      <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: STATUS_DOT[1], display: 'inline-block' }} /> Active
    </span>
    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
      <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: STATUS_DOT[0], display: 'inline-block' }} /> Inactive
    </span>
  </div>
);

// ── Node details modal ───────────────────────────────────────────────────────
const NodeDetailsModal = ({ node, onClose }) => {
  if (!node) return null;
  const s = TYPE_STYLE[node.type] || TYPE_STYLE.group;

  const rows = [
    { label: 'Type',        value: node.type        ? node.type.charAt(0).toUpperCase() + node.type.slice(1) : 'Tenant' },
    { label: 'Name',        value: node.label       || 'Tayana Communications' },
    { label: 'Code',        value: node.sublabel    || 'TCL-001' },
    { label: 'Domain',      value: node.domain      || 'tayana.in' },
    { label: 'Country Code',value: node.defaultCc   || '+91' },
    { label: 'Sub Domain',  value: node.subDomain   || 'tss.tayana.in' },
    { label: 'Description', value: node.description || 'Primary tenant for Tayana Communications product suite.' },
    { label: 'Status',      value: (
        <span style={{ display:'inline-flex', alignItems:'center', gap:'6px' }}>
          <span style={{
            width:'9px', height:'9px', borderRadius:'50%',
            background: STATUS_DOT[node.status ?? 1] || '#90a4ae',
            display:'inline-block',
          }} />
          {(node.status ?? 1) === 1 ? 'Active' : 'Inactive'}
        </span>
      ),
    },
  ];

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.35)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        zIndex: 99998,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#fff',
          borderRadius: '10px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
          width: '420px',
          maxWidth: '95vw',
          overflow: 'hidden',
        }}
      >
        {/* Modal header */}
        <div style={{
          background: s.bg,
          padding: '14px 18px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '20px' }}>
              {{ root: '🌐', tenant: '🏢', account: '👤', group: '👥' }[node.type] || '📋'}
            </span>
            <div>
              <div style={{ color: s.text, fontWeight: 700, fontSize: '15px' }}>{node.label}</div>
              <div style={{ color: '#b0bec5', fontSize: '11px', textTransform: 'capitalize' }}>{node.type}</div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%',
              width: '28px', height: '28px', cursor: 'pointer',
              color: '#fff', fontSize: '16px', lineHeight: '28px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >&times;</button>
        </div>

        {/* Modal body */}
        <div style={{ padding: '16px 18px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <tbody>
              {rows.map(({ label, value }) => (
                <tr key={label} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{
                    padding: '9px 10px 9px 0',
                    color: '#6c757d',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    width: '38%',
                    verticalAlign: 'top',
                  }}>{label}</td>
                  <td style={{ padding: '9px 0', color: '#212529', wordBreak: 'break-word' }}>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal footer */}
        <div style={{ padding: '10px 18px', borderTop: '1px solid #f0f0f0', textAlign: 'right' }}>
          <button
            onClick={onClose}
            style={{
              background: s.bg, color: '#fff', border: 'none',
              borderRadius: '6px', padding: '7px 20px',
              fontSize: '13px', cursor: 'pointer',
            }}
          >Close</button>
        </div>
      </div>
    </div>
  );
};

// ── Main view ────────────────────────────────────────────────────────────────
const TenantOrgChartView = ({
  tree,
  collapsed, highlighted,
  search, zoom,
  onToggleNode, onExpandAll, onCollapseAll,
  onSearchChange,
  onZoomIn, onZoomOut, onZoomReset,
  onRefresh,
  onViewDetails,
}) => {
  const canvasRef = useRef(null);

  const [ctxMenu, setCtxMenu] = useState({ visible: false, x: 0, y: 0, node: null });
  const [detailsNode, setDetailsNode] = useState(null);

  const handleViewDetails = useCallback((node) => {
    setDetailsNode(node);
    if (onViewDetails) onViewDetails(node);
  }, [onViewDetails]);

  const closeDetails = useCallback(() => setDetailsNode(null), []);

  const handleContextMenu = useCallback((e, node) => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const menuW = 180;
    const menuH = 80;
    const x = e.clientX + menuW > vw ? e.clientX - menuW : e.clientX;
    const y = e.clientY + menuH > vh ? e.clientY - menuH : e.clientY;
    setCtxMenu({ visible: true, x, y, node });
  }, []);

  const closeCtxMenu = useCallback(() => setCtxMenu({ visible: false, x: 0, y: 0, node: null }), []);

  // Pan state
  const pan = useRef({ dragging: false, startX: 0, startY: 0, scrollLeft: 0, scrollTop: 0 });

  const onMouseDown = (e) => {
    const el = canvasRef.current;
    pan.current = { dragging: true, startX: e.clientX, startY: e.clientY, scrollLeft: el.scrollLeft, scrollTop: el.scrollTop };
    el.style.cursor = 'grabbing';
  };
  const onMouseMove = (e) => {
    if (!pan.current.dragging) return;
    const el = canvasRef.current;
    el.scrollLeft = pan.current.scrollLeft - (e.clientX - pan.current.startX);
    el.scrollTop  = pan.current.scrollTop  - (e.clientY - pan.current.startY);
  };
  const onMouseUp = () => {
    pan.current.dragging = false;
    if (canvasRef.current) canvasRef.current.style.cursor = 'grab';
  };

  return (
    <section className="content">
      <div className="container-fluid">
        <div className="card">
          <div className="card-body" style={{ padding: '18px' }}>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <span style={{ fontSize: '22px' }}>🏗️</span>
              <div>
                <h5 style={{ margin: 0, fontWeight: 700, fontSize: '16px' }}>
                  Tenant Organization Chart
                </h5>
                <p style={{ margin: 0, color: '#6c757d', fontSize: '12px' }}>
                  Visual hierarchy of tenants and accounts
                </p>
              </div>
            </div>

            {/* Toolbar */}
            <Toolbar
              search={search}
              onSearchChange={onSearchChange}
              zoom={zoom}
              onZoomIn={onZoomIn}
              onZoomOut={onZoomOut}
              onZoomReset={onZoomReset}
              onExpandAll={onExpandAll}
              onCollapseAll={onCollapseAll}
              onRefresh={onRefresh}
            />

            {/* Legend */}
            <Legend />

            {/* Chart canvas */}
            <div
              ref={canvasRef}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
              onMouseLeave={onMouseUp}
              style={{
                overflow: 'auto',
                cursor: 'grab',
                background: '#f8f9fa',
                borderRadius: '10px',
                border: '1px solid #dee2e6',
                minHeight: '420px',
                padding: '40px 30px 60px',
                backgroundImage:
                  'radial-gradient(circle, #dee2e6 1px, transparent 1px)',
                backgroundSize: '28px 28px',
              }}
            >
              {!tree ? (
                <div style={{ color: '#6c757d', textAlign: 'center', paddingTop: '80px', fontSize: '14px' }}>
                  Loading organisation chart…
                </div>
              ) : (
                <div style={{
                  display: 'inline-block',
                  transform: `scale(${zoom})`,
                  transformOrigin: 'top left',
                  transition: 'transform 0.2s ease',
                  paddingBottom: '40px',
                }}>
                  <OrgNode
                    node={tree}
                    collapsed={collapsed}
                    highlighted={highlighted}
                    onToggle={onToggleNode}
                    onContextMenu={handleContextMenu}
                  />
                </div>
              )}
            </div>

            {/* Context menu */}
            {ctxMenu.visible && (
              <ContextMenu
                x={ctxMenu.x}
                y={ctxMenu.y}
                node={ctxMenu.node}
                onViewDetails={handleViewDetails}
                onClose={closeCtxMenu}
              />
            )}

            {/* Details modal */}
            <NodeDetailsModal node={detailsNode} onClose={closeDetails} />

            {/* Footer hint */}
            <p style={{ margin: '10px 0 0', color: '#6c757d', fontSize: '11px', textAlign: 'center' }}>
              Click to expand / collapse &nbsp;·&nbsp; Right-click a node for options &nbsp;·&nbsp; Drag to pan &nbsp;·&nbsp; Use zoom controls to resize
            </p>

          </div>
        </div>
      </div>
    </section>
  );
};

export default TenantOrgChartView;
