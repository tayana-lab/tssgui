import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export interface SmallBoxProps {
  type: 'info' | 'success' | 'warning' | 'danger';
  icon?: string;
  count: number;
  title: string;
  navigateTo: string;
}

const TYPE_STYLES: Record<SmallBoxProps['type'], { bg: string; text: string; icon: string }> = {
  info:    { bg: 'var(--color-info)',    text: '#fff', icon: '#dbeafe' },
  success: { bg: 'var(--color-success)', text: '#fff', icon: '#dcfce7' },
  warning: { bg: 'var(--color-warning)', text: '#fff', icon: '#fef9c3' },
  danger:  { bg: 'var(--color-error)',   text: '#fff', icon: '#fee2e2' },
};

const SmallBox = ({
  type = 'info',
  icon = 'ion-bag',
  count,
  title,
  navigateTo,
}: SmallBoxProps) => {
  const [t] = useTranslation();
  const styles = TYPE_STYLES[type] ?? TYPE_STYLES.info;

  return (
    <div
      className="tss-stat-box relative overflow-hidden"
      style={{ backgroundColor: styles.bg }}
    >
      {/* ---- Text ---- */}
      <div style={{ color: styles.text }}>
        <p className="text-4xl font-bold leading-none mb-1">{count}</p>
        <p className="text-sm font-medium opacity-90">{title}</p>
      </div>

      {/* ---- Background icon ---- */}
      <div
        className="absolute right-3 top-1/2 -translate-y-1/2 text-5xl pointer-events-none select-none"
        style={{ color: styles.icon, opacity: 0.6 }}
        aria-hidden="true"
      >
        <i className={`ion ${icon || 'ion-bag'}`} />
      </div>

      {/* ---- More info link ---- */}
      <Link
        to={navigateTo}
        className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1 py-1 text-xs font-medium"
        style={{
          backgroundColor: 'rgba(0,0,0,0.15)',
          color: styles.text,
          textDecoration: 'none',
        }}
      >
        <span>{t('main.label.moreInfo')}</span>
        <i className="fa fa-arrow-circle-right text-xs" />
      </Link>
    </div>
  );
};

export default SmallBox;
