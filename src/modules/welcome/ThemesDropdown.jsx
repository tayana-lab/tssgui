import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon, faSeedling} from '@fortawesome/free-solid-svg-icons';
import { toggleDarkMode, toggleBlueMode } from '@app/modules/common/default/store/reducers/ui';
import { useDispatch, useSelector } from 'react-redux';
import {useState} from 'react';
import { useTranslation } from 'react-i18next';
import TssIcon from '@app/modules/common/default/components/TssIcon';
const ThemesDropdown = () => {

  const dispatch = useDispatch();
   const [t]= useTranslation();
  const darkMode = useSelector((state) => state.ui.darkMode);
  const blueMode = useSelector((state) => state.ui.blueMode);
    const [dropdownOpen, setDropdownOpen] = useState(false);
 const [isHovered, setIsHovered] = useState(false);

  const handleDarkModeChange = (mode) => {
  
   if (darkMode !== mode) {
      dispatch(toggleDarkMode());
      
    }
  };
	const handleblueModeChange = (mode) =>{
            
	if (blueMode !== mode) {
           
		dispatch(toggleBlueMode());
}
}

 const handleLightMode = () => {
    if (darkMode) {
      dispatch(toggleDarkMode());
    }
    if (blueMode) {
      dispatch(toggleBlueMode());
    }
  };


  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (

   <li>
      <div
        className="dropdown"
        style={{ position: 'relative' }} 
        onMouseEnter={() => setIsHovered(true)}  
        onMouseLeave={() => setIsHovered(false)} 
      >
        <a slot="head"
          style={{ fontWeight: 'normal', cursor: 'pointer',display: 'flex' }} 
          title={t('topnavi.title.theme')}
        >
          <div className="mt-2"  style={{ marginLeft: "-15px" }}>
            {!darkMode ? (
              <TssIcon iconKey="tss_lightTheme" title={t('topnavi.title.theme')} />
            ) : (
              <TssIcon iconKey="tss_darkTheme" title={t('topnavi.title.theme')} />
            )}
          </div>
        </a>

        <div
          className="dropdown-menu dropdown-menu-right"
          aria-labelledby="dropdownMenuLink"
          style={{
            width: 'auto',
            position: 'absolute',
            top: '25px',
            right: 0,
            left: 'auto',
            display: isHovered ? 'block' : 'none', 
            zIndex: 9999,
          }}
        >
          <button
            type="button"
            className={`dropdown-item ${!darkMode && !blueMode ? 'active' : ''}`}
            onClick={handleLightMode}
            style={{ cursor: 'pointer' }}
          >
            <FontAwesomeIcon icon={faSun} className='mr-2 fasSun' />
            <span>Light</span>
          </button>

          <button
            type="button"
            className={`dropdown-item ${darkMode ? 'active' : ''}`}
            onClick={() => handleDarkModeChange(true)}
            style={{ cursor: 'pointer' }}
          >
            <FontAwesomeIcon icon={faMoon} className='mr-2' />
            <span>Dark</span>
          </button>

          <button
            type="button"
            className={`dropdown-item ${blueMode ? 'active' : ''}`}
            onClick={() => handleblueModeChange(true)}
            style={{ cursor: 'pointer' }}
          >
            <FontAwesomeIcon icon={faSeedling} className='mr-2' />
            <span>Blue</span>
          </button>
        </div>
      </div>
    </li>






  )

}

export default ThemesDropdown;
