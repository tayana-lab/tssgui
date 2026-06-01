import { useTranslation } from 'react-i18next';
import conf from '@modules/conf/TssGui.json';

const url = conf.POWERED_BY_URL;

const Footer = () => {
  const [t] = useTranslation();

  return (
    <footer className="tss-footer" aria-label="Application footer">
      <span>{t('bottomnavi.label.poweredBy')}&nbsp;</span>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 600 }}
        onMouseEnter={(e) => ((e.target as HTMLAnchorElement).style.textDecoration = 'underline')}
        onMouseLeave={(e) => ((e.target as HTMLAnchorElement).style.textDecoration = 'none')}
      >
        {t('bottomnavi.label.companyName')}
      </a>
    </footer>
  );
};

export default Footer;
