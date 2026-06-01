import { useState} from 'react';
import { useNavigate} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { setAuthentication } from '@app/modules/common/default/store/reducers/auth';
import { GoogleProvider } from '@app/modules/common/default/utils/oidc-providers';
import TssButton from '@app/modules/common/default/components/TssButton'; 
import TssIcon from '@app/modules/common/default/components/TssIcon';

import {
  UserBody,
  UserFooter,
  UserHeader,
  UserMenuDropdown,
} from '@app/modules/common/default/components/TssDropDownMenus';



declare const FB: any;

const UserDropdown = () => {
  const navigate = useNavigate();
  const [t] = useTranslation();
  const dispatch = useDispatch();
  const authentication = useSelector((state: any) => state.auth.authentication);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const darkMode = useSelector((state) => state.ui.darkMode);
  const logOut = async (event: any) => {
    //event.preventDefault();
    setDropdownOpen(false);
  //  console.log('authentication', authentication);
    if (authentication.profile.first_name) {
      await GoogleProvider.signoutPopup();
      dispatch(setAuthentication(undefined));
      navigate('/login');
    } else if (authentication.userID) {
      FB.logout(() => {
        dispatch(setAuthentication(undefined));
        navigate('/login');
      });
    } else {
      dispatch(setAuthentication(undefined));
      navigate('/login');
    }
    localStorage.removeItem('authentication');
  };

  const navigateToProfile = (event: any) => {
    // event.preventDefault();
    setDropdownOpen(false);
    localStorage.setItem("modulePath","");
    localStorage.setItem("moduleVersionType","0");
    localStorage.setItem("moduleHeading","Profile");
    navigate('/profile');

  };

  return (
  	 <UserMenuDropdown 
      isOpen={dropdownOpen}
      hideArrow
      onMouseEnter={() => setDropdownOpen(true)}  
      onMouseLeave={() => setDropdownOpen(false)} 
    >
      <div slot="head" className="tss-icon mt-1" style={{ cursor: 'pointer', }}> 
        <span  style={{ display: 'flex', gap: '0.4rem' }}>
          <TssIcon
            className="ml-2"
            iconKey="tss_user"
            iconProps={{ style: { fontSize: '1.2rem' } }}
            title={t('topnavi.title.profile')}
          />
          <span className="mr-2" style={{ marginTop: '-2px' }}>{authentication.profile.email}</span>
        </span>
      </div>

      <div slot="body" style={{ backgroundColor: '#fafafa', marginTop: '-12px', }}>

        <UserHeader>
          <img
            src="/images/user.svg"
            alt="User profile"
            className="profile-user-img img-fluid img-circle"
            style={{ height: '60px', width: '60px', backgroundColor: '#fafafa', paddingTop: '5px' }}
          />
          <p className="tssheading">{authentication.profile.email}</p>
        </UserHeader>

        <UserFooter>
          <button
            type="button"
            className="btn-userDropDown"
            onClick={navigateToProfile}
            style={{ cursor: 'pointer' }}
          >
            <TssIcon iconKey="tss_profile" className="icon-left" />
            &nbsp;&nbsp;{t('topnavi.user.profile')}
          </button>

          <br />

          <button
            type="button"
            className="btn-userDropDown"
            onClick={logOut}
            style={{ cursor: 'pointer' }}
          >
           <TssIcon iconKey="tss_signout" className="icon-left" />
            &nbsp;&nbsp;{t('login.button.signOut')}
          </button>
        </UserFooter>
      </div>
    </UserMenuDropdown>

	);
};

export default UserDropdown;
