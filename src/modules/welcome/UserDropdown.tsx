import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { setAuthentication } from '@app/modules/common/default/store/reducers/auth';
import { GoogleProvider } from '@app/modules/common/default/utils/oidc-providers';
import TssIcon from '@app/modules/common/default/components/TssIcon';

declare const FB: any;

const UserDropdown = () => {
  const navigate      = useNavigate();
  const [t]           = useTranslation();
  const dispatch      = useDispatch();
  const authentication = useSelector((state: any) => state.auth.authentication);

  const [open, setOpen]   = useState(false);
  const wrapperRef         = useRef<HTMLDivElement>(null);

  /* ---- Close on outside click ---- */
  useEffect(() => {
    const onOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
  }, []);

  /* ---- Sign out ---- */
  const logOut = async () => {
    setOpen(false);
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

  const navigateToProfile = () => {
    setOpen(false);
    localStorage.setItem('modulePath', '');
    localStorage.setItem('moduleVersionType', '0');
    localStorage.setItem('moduleHeading', 'Profile');
    navigate('/profile');
  };

  const email = authentication?.profile?.email ?? '';

  return (
    <div ref={wrapperRef} className="relative">

      {/* ---- Trigger chip ---- */}
      <button
        type="button"
        className="tss-user-chip"
        onClick={() => setOpen((prev) => !prev)}
        onMouseEnter={() => setOpen(true)}
        title={t('topnavi.title.profile')}
        aria-haspopup="true"
        aria-expanded={open}
      >
        <TssIcon iconKey="tss_user" iconProps={{ style: { fontSize: '1.1rem' } }} />
        <span className="zoom-hide-text text-xs max-w-[140px] truncate hidden sm:inline">
          {email}
        </span>
      </button>

      {/* ---- Dropdown panel ---- */}
      {open && (
        <div
          className="tss-dropdown absolute right-0 top-full mt-1"
          style={{ minWidth: '220px' }}
          onMouseLeave={() => setOpen(false)}
        >
          {/* Header */}
          <div
            className="flex flex-col items-center px-4 py-4 border-b"
            style={{
              backgroundColor: 'var(--color-card-header-bg)',
              borderColor: 'var(--color-border)',
            }}
          >
            <div
              className="rounded-full mb-2 flex items-center justify-center"
              style={{
                width: '52px',
                height: '52px',
                backgroundColor: 'var(--color-primary-light)',
                color: 'var(--color-primary)',
                fontSize: '1.5rem',
              }}
            >
              <i className="fas fa-user" />
            </div>
            <p className="text-sm font-semibold text-center truncate max-w-full px-2" style={{ color: 'var(--color-text)' }}>
              {email}
            </p>
          </div>

          <div className="tss-dropdown-divider m-0" />

          {/* Profile link */}
          <button
            type="button"
            className="tss-dropdown-item w-full text-left"
            onClick={navigateToProfile}
          >
            <TssIcon iconKey="tss_profile" />
            {t('topnavi.user.profile')}
          </button>

          <div className="tss-dropdown-divider" />

          {/* Sign out */}
          <button
            type="button"
            className="tss-dropdown-item w-full text-left"
            onClick={logOut}
          >
            <TssIcon iconKey="tss_signout" />
            {t('login.button.signOut')}
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
