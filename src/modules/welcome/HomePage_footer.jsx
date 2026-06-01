import { useTranslation } from 'react-i18next';
import conf from '@modules/conf/TssGui.json'
import { useDispatch, useSelector } from "react-redux";
const url = conf.POWERED_BY_URL
const Footer = () => {
  const [t] = useTranslation();
const darkMode = useSelector((state) => state.ui.darkMode);
  return (
    <footer className="main-footer" >
      <strong>
        <span>{t('bottomnavi.label.poweredBy')} </span>
      </strong>
      <a className= 'footer-bottom' href={url} target="_blank" rel="noopener noreferrer">
       {t('bottomnavi.label.companyName')}
      </a>
    </footer>
  );
};

export default Footer;
