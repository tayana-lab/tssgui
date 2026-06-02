import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import config from '@modules/conf/TssGui.json';
import { ToastContainer } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { setAuthentication } from '@app/modules/common/default/store/reducers/auth';
import { showToast } from '@app/modules/common/default/components/TssFunction';
import { useLocation, useNavigate } from 'react-router-dom';
import { authLogin, changePassword } from '@app/modules/common/default/utils/oidc-providers';
import OtpInput from 'react-otp-input';
import { checkPasswordValidation } from '@app/modules/common/default/js/validate.js';
import { useTranslation } from 'react-i18next';
import encryptPayload from '@app/modules/common/default/js/encryptPayload.js';
import TenantSelectPage from '@app/modules/welcome/TenantSelectPage';

/* ===================================================================
   All business logic is unchanged — only JSX markup uses Tailwind.
   =================================================================== */

const Login = () => {
  const location  = useLocation();
  const navigate  = useNavigate();
  let   intervalId;
  const [t] = useTranslation();

  /* ---- Form state ---- */
  const [username,          setUsername]          = useState('');
  const [password,          setPassword]          = useState('');
  const [error,             setError]             = useState('');
  const [loading,           setLoading]           = useState(false);
  const [serverIp,          setServerIp]          = useState('');
  const [clientIp,          setClientIp]          = useState('');
  const [displayDivName,    setDisplayDivName]    = useState('Login');
  const [oldPassword,       setOldPassword]       = useState('');
  const [newPassword,       setNewPassword]       = useState('');
  const [confirmPassword,   setConfirmPassword]   = useState('');
  const [showPassword,      setShowPassword]      = useState(false);

  /* ---- URL token / reset ---- */
  const queryParams = new URLSearchParams(location.search);
  const [urltoken,                       setUrltoken]                       = useState('');
  const [linkExpirationOrRestSuccessMsg, setLinkExpirationOrResetSuccessMsg] = useState('');
  const [maskedemailid,                  setMaskedemailid]                  = useState('');
  const [resetPasswordUsername,          setResetPasswordUsername]          = useState('');
  const [acctId,                         setAcctId]                         = useState('');

  /* ---- Login type ---- */
  const [firstLogin,     setFirstLogin]     = useState(false);
  const [loginType,      setLoginType]      = useState(1);
  const [generateOtpDiv, setGenerateOtpDiv] = useState(true);
  const [enterOtpDiv,    setEnterOtpDiv]    = useState(false);
  const [otp,            setOtp]            = useState('');
  const [countdown,      setCountdown]      = useState(0);
  const [hideResendOtpBtn,       setHideResendOtpBtn]       = useState(false);
  const [showResendOTPInterval,  setShowResendOTPInterval]  = useState(false);
  const [acctIdOtpLogin,         setAcctIdOtpLogin]         = useState('');
  const [maskedEmail,            setMaskedEamil]            = useState('');
  const [usedToken,              setUsedToken]              = useState(0);
  const [token,                  setToken]                  = useState('');

  /* ---- MFA ---- */
  const [showMfaScreen, setShowMfaScreen] = useState(false);
  const [mfaOtp,        setMfaOtp]        = useState('');
  const [mfaError,      setMfaError]      = useState('');

  /* ---- Tenant selection ---- */
  const [showTenantSelect,    setShowTenantSelect]    = useState(false);
  const [tenantList,          setTenantList]          = useState([]);
  const [pendingAuthResponse, setPendingAuthResponse] = useState(null);
  const [loginUsername,       setLoginUsername]       = useState('');

  const tenantCode = config.TENANT_CODE;

  /* ---- Demo data ---- */
  const dummyUserTenantMap = {
    john:  [
      { TENANT_ID: 100, TENANT_NAME: 'Airtel India',   TENANT_CODE: 'airtel_in' },
      { TENANT_ID: 200, TENANT_NAME: 'Jio',            TENANT_CODE: 'jio_in'    },
      { TENANT_ID: 300, TENANT_NAME: 'Vodafone Idea',  TENANT_CODE: 'vi_in'     },
    ],
    jane:  [{ TENANT_ID: 200, TENANT_NAME: 'Jio', TENANT_CODE: 'jio_in' }, { TENANT_ID: 300, TENANT_NAME: 'Vodafone Idea', TENANT_CODE: 'vi_in' }],
    bob:   [{ TENANT_ID: 300, TENANT_NAME: 'Vodafone Idea', TENANT_CODE: 'vi_in' }],
    alice: [{ TENANT_ID: 400, TENANT_NAME: 'BSNL', TENANT_CODE: 'bsnl_in' }, { TENANT_ID: 500, TENANT_NAME: 'Test Operator', TENANT_CODE: 'test01' }, { TENANT_ID: 600, TENANT_NAME: 'Demo Tenant', TENANT_CODE: 'demo' }],
    raj:   [{ TENANT_ID: 100, TENANT_NAME: 'Airtel India', TENANT_CODE: 'airtel_in' }],
    'tenantadmin@tayana.in': [
      { TENANT_ID: 100, TENANT_NAME: 'Airtel India',  TENANT_CODE: 'airtel_in' },
      { TENANT_ID: 200, TENANT_NAME: 'Jio',           TENANT_CODE: 'jio_in'    },
      { TENANT_ID: 300, TENANT_NAME: 'Vodafone Idea', TENANT_CODE: 'vi_in'     },
    ],
  };

  const demoUsers = {
    john: 'John123', jane: 'Admin123', bob: 'Admin123', alice: 'Admin123', raj: 'Admin123',
  };

  const numberOfRetries       = config.OTP_Max_Retries;
  const otp_resend_Interval   = config.OTP_Resend_Interval_Attempts;
  var   defaultCountDownResendOTP = 0;

  localStorage.setItem('productId', config.PRODUCT_ID.toString());

  /* ---- Fetch server/client IP ---- */
  useEffect(() => {
    const serverDetails = async () => {
      try {
        const addressData = await fetch(`${config.SERVER_JS_API_URI}/get/address`);
        if (!addressData.ok) throw new Error(`Error: ${addressData.status}`);
        const data = await addressData.json();
        localStorage.setItem('serverIP', data.serverIP);
        localStorage.setItem('clientIP', data.clientIP);
        setServerIp(data.serverIP);
        setClientIp(data.clientIP);
      } catch (error) {
        console.error('Failed to fetch server details:', error);
      }
    };
    serverDetails();
  }, []);

  const dispatch  = useDispatch();
  const sessionId = uuidv4();

  const handleLoginTypeChange = (type) => {
    localStorage.setItem('otpResendAttempt', '0');
    setUsername('');
    setGenerateOtpDiv(true);
    setEnterOtpDiv(false);
    setLoginType(type);
    setError('');
  };

  /* ===================================================================
     Business logic handlers (unchanged from original)
     =================================================================== */

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Both fields are required');
    } else if (/^\s|\s$/.test(password)) {
      setError(t('modules.Generic.errorMsg.noSpacesAllowed'));
    } else {
      setError('');
      setLoading(true);

      const luser = username.toLowerCase();
      if (demoUsers[luser] && demoUsers[luser] === password) {
        const demoResponse = { profile: { email: username } };
        localStorage.setItem('acctName',  username);
        localStorage.setItem('acctID',    '9999');
        localStorage.setItem('username',  username);
        const sitemapUsers = ['john', 'tenantadmin@tayana.in'];
        const demoLanding  = sitemapUsers.includes(luser) ? 'SiteMap' : 'Dashboard';
        localStorage.setItem('landingPage',       demoLanding);
        localStorage.setItem('modulePath',        '');
        localStorage.setItem('moduleVersionType', '0');
        localStorage.setItem('moduleHeading',     sitemapUsers.includes(luser) ? 'Sitemap' : 'Dashboard');
        setLoading(false);
        const mappedTenants = dummyUserTenantMap[luser] || [];
        localStorage.setItem('authentication', JSON.stringify(demoResponse));
        if (mappedTenants.length === 1) {
          localStorage.setItem('selectedTenantId',   String(mappedTenants[0].TENANT_ID));
          localStorage.setItem('selectedTenantName', mappedTenants[0].TENANT_NAME);
          localStorage.setItem('selectedTenantCode', mappedTenants[0].TENANT_CODE);
          dispatch(setAuthentication(demoResponse));
        } else if (mappedTenants.length > 1) {
          setLoginUsername(username);
          setTenantList(mappedTenants);
          setPendingAuthResponse(demoResponse);
          setShowTenantSelect(true);
        } else {
          dispatch(setAuthentication(demoResponse));
        }
        return;
      }

      try {
        const requestBody = { clientName: username, password };
        const response    = await authLogin(requestBody);
        if (response === 8) {
          setFirstLogin(true);
          setLoading(false);
        } else if (response && response.mfaRequired) {
          setLoading(false);
          setShowMfaScreen(true);
        } else {
          const landingPage = localStorage.getItem('landingPage');
          if (landingPage === 'SiteMap') {
            localStorage.setItem('modulePath', ''); localStorage.setItem('moduleVersionType', '0'); localStorage.setItem('moduleHeading', 'Sitemap');
          } else {
            localStorage.setItem('modulePath', ''); localStorage.setItem('moduleVersionType', '0'); localStorage.setItem('moduleHeading', 'Dashboard');
          }
          setLoading(false);
          const authResponse  = { profile: { email: username } };
          const mappedTenants = dummyUserTenantMap[username.toLowerCase()] || [];
          if (mappedTenants.length > 1) {
            localStorage.setItem('authentication', JSON.stringify(authResponse));
            setLoginUsername(username); setTenantList(mappedTenants); setPendingAuthResponse(authResponse); setShowTenantSelect(true);
          } else {
            dispatch(setAuthentication(authResponse));
          }
        }
      } catch (error) {
        setLoading(false);
        showToast('error', error.message);
      }
    }
  };

  const handleMfaVerify = async (e) => {
    e.preventDefault();
    if (mfaOtp.length !== 6) { setMfaError('Please enter the complete 6-digit code'); return; }
    setMfaError(''); setLoading(true);
    try {
      const storedTenantCode = localStorage.getItem('tenantCode') || config.TENANT_CODE;
      const clientName       = localStorage.getItem('username') || username;
      const response = await fetch(
        `${config.SERVER_JS_API_URI}/tssgui/mfa/verify?clientName=${encodeURIComponent(clientName)}&otp=${encodeURIComponent(mfaOtp)}`,
        { headers: { 'tssgui-tenant-code': storedTenantCode } }
      );
      const data = await response.json();
      if (response.ok && (data.response === 'success' || data.response === 'true' || data.response === true)) {
        const accessType = localStorage.getItem('pendingMfaAccessType') || '9999';
        const acctId     = localStorage.getItem('acctID');
        const modulesResponse = await fetch(`${config.SERVER_JS_API_URI}/getProductModules?productId=${config.PRODUCT_ID}&moduleId=0&accessType=${accessType}&tenantCode=${storedTenantCode}&clientId=${acctId}`);
        if (modulesResponse.ok) localStorage.setItem('productModules', JSON.stringify(await modulesResponse.json()));
        const landingPage = localStorage.getItem('landingPage');
        if (landingPage === 'SiteMap') { localStorage.setItem('modulePath', ''); localStorage.setItem('moduleVersionType', '0'); localStorage.setItem('moduleHeading', 'Sitemap'); }
        else { localStorage.setItem('modulePath', ''); localStorage.setItem('moduleVersionType', '0'); localStorage.setItem('moduleHeading', 'Dashboard'); }
        localStorage.removeItem('pendingMfaAccessType');
        const authResponse  = { profile: { email: clientName } };
        localStorage.setItem('authentication', JSON.stringify(authResponse));
        setLoading(false);
        const mappedTenants = dummyUserTenantMap[clientName.toLowerCase()] || [];
        if (mappedTenants.length > 1) {
          setLoginUsername(clientName); setTenantList(mappedTenants); setPendingAuthResponse(authResponse); setShowMfaScreen(false); setShowTenantSelect(true);
        } else {
          dispatch(setAuthentication(authResponse));
        }
      } else {
        setLoading(false);
        setMfaError(data.additionalInfo?.message || data.errorDescription || data.error || 'Invalid code. Please try again.');
      }
    } catch {
      setLoading(false);
      setMfaError('An unexpected error occurred. Please try again.');
    }
  };

  const handleChangePassword = async (e) => {
    const complexity = config.PWD_COMPLEXITY;
    const minLen     = config.MIN_PWD_LENGTH;
    const maxLen     = config.MAX_PWD_LENGTH;
    const validationError = checkPasswordValidation(newPassword, oldPassword, complexity, minLen, maxLen, t);
    e.preventDefault();
    if (!username || !password)    { setError('Both fields are required'); return; }
    if (!oldPassword)              { setError('Old Password is required'); return; }
    if (!newPassword)              { setError('New Password is required'); return; }
    if (!confirmPassword)          { setError('Confirm Password is required'); return; }
    if (newPassword !== confirmPassword) { setError('Confirm Password is not matching'); return; }
    if (validationError)           { setError(validationError); return; }

    setError(''); setLoading(true);
    try {
      const requestBody = { clientId: localStorage.getItem('acctID'), accountId: localStorage.getItem('acctID'), oldPassword, newPassword };
      const response    = await changePassword(requestBody);
      if (response === 0) { setFirstLogin(false); setLoading(false); setPassword(''); showToast('success', 'Password Changed Successfully'); }
      else                { setLoading(false); showToast('error', response?.errorDescription); }
    } catch (error) {
      showToast('error', error.message); setLoading(false);
    }
  };

  const showForgotPassword = () => setDisplayDivName('sendLinkForgotPassword');

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) { setError('All fields are required'); return; }
    if (newPassword !== confirmPassword)  { setError('Confirm Password is not matching'); return; }
    setError(''); setLoading(true);
    const payload     = { password: confirmPassword, token, accountId: acctId, clientIp: localStorage.getItem('clientIP'), sessionId: localStorage.getItem('sessionID'), productId: config.PRODUCT_ID };
    const encryptedData = await encryptPayload(payload, config.encryptionKey);
    const response    = await fetch(`${config.SERVER_JS_API_URI}/welcome/forgotPasswordReset?tenantCode=${tenantCode}`, {
      method: 'POST', body: JSON.stringify({ key: encryptedData.encryptedKey, data: encryptedData.encryptedPayload, iv: encryptedData.iv }), headers: { 'Content-Type': 'application/json' },
    });
    const result = await response.json();
    setLoading(false);
    if (result.status === 'success') { showToast('success', 'Password changed successfully'); handleLoginTypeChange(1); navigate('/login'); }
    else                              { showToast('error', result.status); }
  };

  const sendPasswordResetLink = async (e) => {
    e.preventDefault();
    if (!username) { setError('Username required'); return; }
    setError(''); setLoading(true);
    const payload       = { userName: username, clientIp: localStorage.getItem('clientIP'), sessionId: localStorage.getItem('sessionID'), productId: config.PRODUCT_ID };
    const url           = `${config.SERVER_JS_API_URI}/welcome/sendPasswordResetLink?tenantCode=${tenantCode}`;
    const encryptedData = await encryptPayload(payload, config.encryptionKey);
    const response      = await fetch(url, { method: 'POST', body: JSON.stringify({ key: encryptedData.encryptedKey, data: encryptedData.encryptedPayload, iv: encryptedData.iv }), headers: { 'Content-Type': 'application/json' } });
    const result        = await response.json();
    if      (result.status === 'error')   showToast('error',   result.message);
    else if (result.status === 'success') showToast('success', result.message);
    else                                  showToast('error',   'Failed to Send Link');
    setLoading(false);
  };

  useEffect(() => {
    if (queryParams.has('resetToken')) handlesetUrltoken(queryParams.get('resetToken'));
  }, [location.search]);

  const returnToLogin = () => {
    setUrltoken(''); setConfirmPassword(''); setNewPassword(''); setOldPassword('');
    setLoading(''); setPassword(''); setUsername(''); setError('');
    setDisplayDivName('Login');
  };

  const handlesetUrltoken = async (newValue) => {
    let usedToken = '-1', token = '', acctId = '';
    const vtParams      = { token: newValue, tenantCode };
    const encryptedData = await encryptPayload(vtParams, config.encryptionKey);
    const vtQueryString = `key=${encodeURIComponent(encryptedData.encryptedKey)}&data=${encodeURIComponent(encryptedData.encryptedPayload)}&iv=${encodeURIComponent(encryptedData.iv)}`;
    const response      = await fetch(`${config.SERVER_JS_API_URI}/welcome/verifyResetToken?${vtQueryString}`, { method: 'GET' });
    const responseData  = await response.json();
    usedToken = responseData.usedToken;
    setAcctId(responseData.accountId);
    setToken(responseData.mailLinkToken);
    if      (usedToken === 1) { setUsedToken(usedToken); setLoginType(4); }
    else if (usedToken === 0) { setUsedToken(usedToken); setLoginType(4); }
    else                      { setUsedToken(1);         setLoginType(4); }
  };

  const sendOTP = async (e) => {
    if (e) e.preventDefault();
    try {
      const otpParams     = { username, tenantCode };
      const encryptedData = await encryptPayload(otpParams, config.encryptionKey);
      const otpQueryString = `key=${encodeURIComponent(encryptedData.encryptedKey)}&data=${encodeURIComponent(encryptedData.encryptedPayload)}&iv=${encodeURIComponent(encryptedData.iv)}`;
      const response      = await fetch(`${config.SERVER_JS_API_URI}/sendOtpLogin?${otpQueryString}`, { method: 'POST', headers: { 'Content-Type': 'application/json' } });
      const result        = await response.json();
      if (result.response === 'success') {
        setAcctIdOtpLogin(result.additionalInfo.acct_id);
        showToast('success', result.additionalInfo.message);
        setGenerateOtpDiv(false); setEnterOtpDiv(true);
      } else {
        showToast('error', result.message);
      }
    } catch (error) {
      showToast('error', 'An unexpected error occurred. Please try again later.');
    }
  };

  const handleOtpLogin = async (e) => {
    e.preventDefault();
    if (otp === '') { showToast('error', 'Please enter the OTP sent to Your Mobile Number'); return; }
    try {
      const requestBody   = { i_server_ip: localStorage.getItem('serverIP'), i_product_id: config.PRODUCT_ID, clientName: username, i_passwd: '', i_client_ip: localStorage.getItem('clientIP'), i_session_id: localStorage.getItem('sessionID'), i_ldap_support: '0', i_ldap_flag: 0, i_ldap_grp_id: '', i_ldap_emp_id: '123222', otp, accountId: acctIdOtpLogin, i_is_otp_login: 1 };
      const encryptedData = await encryptPayload(requestBody, config.encryptionKey);
      const response      = await fetch(`${config.SERVER_JS_API_URI}/verifyOtpLogin?tenantCode=${tenantCode}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: encryptedData.encryptedKey, data: encryptedData.encryptedPayload, iv: encryptedData.iv }) });
      const data          = await response.json();
      if (response.ok) {
        if (data.status === 0) {
          localStorage.setItem('authentication', JSON.stringify({ profile: { email: data.displayName } }));
          localStorage.setItem('acctName', data.displayName); localStorage.setItem('acctID', data.accountId); localStorage.setItem('username', username);
          localStorage.setItem('tenantCode', data.tenantCode); localStorage.setItem('tenantId', data.tenantId); localStorage.setItem('landingPage', data.landingPage);
          if (data.landingPage === 'SiteMap') { localStorage.setItem('modulePath', ''); localStorage.setItem('moduleVersionType', '0'); localStorage.setItem('moduleHeading', 'Sitemap'); }
          else                               { localStorage.setItem('modulePath', ''); localStorage.setItem('moduleVersionType', '0'); localStorage.setItem('moduleHeading', 'Dashboard'); }
          const modulesResponse = await fetch(`${config.SERVER_JS_API_URI}/getProductModules?productId=${config.PRODUCT_ID}&moduleId=0&accessType=${data.accessType}&tenantCode=${tenantCode}&clientId=${data.accountId}`);
          if (!modulesResponse.ok) throw new Error('Failed to fetch product modules');
          localStorage.setItem('productModules', JSON.stringify(await modulesResponse.json()));
          dispatch(setAuthentication({ profile: { email: username } }));
        } else {
          showToast('error', 'Failed to verify OTP,Please enter the correct OTP');
        }
      } else {
        setOtp(''); showToast('error', 'Failed to verify OTP');
      }
    } catch (error) {
      showToast('error', error);
    }
  };

  const resendOtp = () => {
    const otpResendAttempt = parseInt(localStorage.getItem('otpResendAttempt') || '0', 10);
    const newresendAttempt = otpResendAttempt + 1;
    localStorage.setItem('otpResendAttempt', newresendAttempt.toString());
    if (newresendAttempt <= numberOfRetries) {
      defaultCountDownResendOTP = getResendInterval(newresendAttempt);
      setShowResendOTPInterval(true); setCountdown(defaultCountDownResendOTP);
      clearInterval(intervalId);
      intervalId = setInterval(updateResendCountDown, 1000);
    } else {
      setHideResendOtpBtn(true);
    }
    sendOTP();
  };

  const getResendInterval = (ResendAttempt) => {
    const configItem = otp_resend_Interval.find((item) => item.attempt === ResendAttempt.toString());
    return configItem ? parseInt(configItem.interval, 10) : 30;
  };

  function updateResendCountDown() {
    const otpResendAttempt = parseInt(localStorage.getItem('otpResendAttempt') || '0', 10);
    defaultCountDownResendOTP--;
    if (defaultCountDownResendOTP === 0 && otpResendAttempt < numberOfRetries)     { setShowResendOTPInterval(false); clearInterval(intervalId); }
    else if (defaultCountDownResendOTP === 0 && otpResendAttempt === numberOfRetries) { clearInterval(intervalId); setShowResendOTPInterval(false); setHideResendOtpBtn(true); }
    setCountdown(defaultCountDownResendOTP);
  }

  /* ===================================================================
     Shared style helpers
     =================================================================== */
  const inputClass = 'tss-input';
  const btnPrimary = 'tss-btn w-full justify-center py-2 text-sm rounded-2xl';

  /* ===================================================================
     Render
     =================================================================== */
  return (
    <>
      {/* Tenant selection overlay */}
      {showTenantSelect && (
        <TenantSelectPage
          tenants={tenantList}
          userName={loginUsername}
          onSelect={(tenant) => {
            localStorage.setItem('selectedTenantId',   String(tenant.TENANT_ID));
            localStorage.setItem('selectedTenantName', tenant.TENANT_NAME);
            localStorage.setItem('selectedTenantCode', tenant.TENANT_CODE);
            localStorage.setItem('authentication',     JSON.stringify(pendingAuthResponse));
            setShowTenantSelect(false);
            dispatch(setAuthentication(pendingAuthResponse));
          }}
        />
      )}

      {!showTenantSelect && (
        /* ---- Full-screen login background ---- */
        <div
          className="relative min-h-screen w-full flex items-center justify-center p-4"
          style={{
            backgroundImage: "url('/images/LoginBackground.svg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Tayana logo — top left */}
          <div className="absolute top-3 left-4">
            <img
              src="/images/tayana_logo.svg"
              alt="Tayana logo"
              style={{ maxWidth: '110px', height: 'auto' }}
            />
          </div>

          {/* ---- Two-column layout (image | form) ---- */}
          <div className="flex w-full max-w-4xl items-center gap-8">

            {/* Left: illustration (hidden on mobile) */}
            <div className="hidden md:flex flex-col flex-1 items-center">
              <img
                src="/images/LoginScreenImage.svg"
                alt="Login illustration"
                className="w-full max-h-[480px] object-contain"
              />
              <p
                className="mt-4 text-center text-sm font-semibold"
                style={{ color: '#8D9099', letterSpacing: '0.04em' }}
              >
                {config.LOGIN_SCREEN_FOOTER}
              </p>
            </div>

            {/* Right: login card */}
            <div className="flex flex-col items-center w-full md:max-w-[380px]">
              {/* Product logo above card */}
              <img
                src="/images/loginLogo.png"
                alt="Product logo"
                style={{ width: '80px', height: 'auto', marginBottom: '16px' }}
              />

              {/* Glass card */}
              <div
                className="w-full rounded-[40px] px-7 py-6"
                style={{
                  background:      'rgba(255,255,255,0.19)',
                  boxShadow:       '0 9px 18px rgba(0,0,0,0.25)',
                  backdropFilter:  'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  minHeight:       '380px',
                }}
              >
                {/* Product name + logo */}
                <div className="flex items-center justify-center gap-3 mb-2">
                  <img src="/images/image.svg" alt="logo" style={{ maxWidth: '60px' }} />
                  <h2
                    className="text-xl font-bold"
                    style={{ color: '#347DC1', fontWeight: 700 }}
                  >
                    {config.PRODUCT_NAME}
                  </h2>
                </div>

                {/* ================================================================
                    MFA screen
                    ================================================================ */}
                {showMfaScreen ? (
                  <form onSubmit={handleMfaVerify} className="mt-4">
                    <div className="text-center mb-4">
                      <h5 className="font-bold" style={{ color: '#347DC1', fontWeight: 700 }}>
                        Two-Factor Authentication
                      </h5>
                      <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
                        Enter the 6-digit code from your authenticator app
                      </p>
                    </div>
                    {mfaError && <p className="text-center text-xs mb-2" style={{ color: 'var(--color-error)' }}>{mfaError}</p>}
                    <div className="flex justify-center mb-4">
                      <OtpInput
                        value={mfaOtp}
                        onChange={(val) => { setMfaOtp(val); setMfaError(''); }}
                        numInputs={6}
                        renderSeparator={<span className="mx-1" />}
                        renderInput={(props) => (
                          <input
                            {...props}
                            type="password"
                            style={{ width: '38px', height: '38px', textAlign: 'center', fontSize: '16px', border: '1px solid #ced4da', borderRadius: '6px', outline: 'none' }}
                          />
                        )}
                      />
                    </div>
                    <button type="submit" className={btnPrimary}>
                      {loading ? 'Verifying...' : 'Verify & Sign In'}
                    </button>
                    <p
                      className="text-center text-xs mt-3 cursor-pointer"
                      style={{ color: '#347DC1' }}
                      onClick={() => { setShowMfaScreen(false); setMfaOtp(''); setMfaError(''); }}
                    >
                      Back to Login
                    </p>
                  </form>

                /* ================================================================
                    First login / change password
                    ================================================================ */
                ) : firstLogin ? (
                  <form onSubmit={handleChangePassword} className="mt-4 space-y-3">
                    {error && <p className="text-xs" style={{ color: 'var(--color-error)' }}>{error}</p>}
                    <input className={inputClass} type="password" placeholder="Old Password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
                    <input className={inputClass} type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                    <input className={inputClass} type="password" placeholder="Confirm New Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    <button type="submit" className={btnPrimary}>{loading ? 'Loading...' : 'Change Password'}</button>
                  </form>

                ) : (
                  /* ================================================================
                      Main login forms
                      ================================================================ */
                  <>
                    {/* Login type tabs */}
                    {(loginType === 1 || loginType === 2) && (
                      <div className="flex justify-center gap-6 my-3">
                        {[
                          { id: 1, label: 'Login with Password' },
                          { id: 2, label: 'Login with OTP' },
                        ].map(({ id, label }) => (
                          <button
                            key={id}
                            type="button"
                            className="relative text-xs pb-2 cursor-pointer bg-transparent border-0 outline-none"
                            style={{
                              color:      '#000',
                              fontWeight: loginType === id ? 700 : 400,
                            }}
                            onClick={() => handleLoginTypeChange(id)}
                          >
                            {label}
                            {loginType === id && (
                              <span
                                className="absolute left-1/2 bottom-0 -translate-x-1/2 h-0.5 w-3/5 rounded-full"
                                style={{ backgroundColor: '#347DC1' }}
                              />
                            )}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* ---- Password login ---- */}
                    {loginType === 1 && (
                      <form onSubmit={handleSubmit} className="space-y-3 mt-2">
                        {error && <p className="text-xs" style={{ color: 'var(--color-error)' }}>{error}</p>}
                        <input className={inputClass} type="text" placeholder="User ID" value={username} onChange={(e) => setUsername(e.target.value)} />
                        <div className="relative">
                          <input
                            className={inputClass}
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ paddingRight: '36px' }}
                          />
                          {password && (
                            <button
                              type="button"
                              className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-0 cursor-pointer p-0"
                              onClick={() => setShowPassword((p) => !p)}
                              aria-label={showPassword ? 'Hide password' : 'Show password'}
                              tabIndex={-1}
                            >
                              <i className={`fa ${showPassword ? 'fa-eye' : 'fa-eye-slash'} text-sm`} style={{ color: '#999' }} />
                            </button>
                          )}
                        </div>
                        <div className="flex items-center justify-between text-xs" style={{ color: '#6B7A99', fontWeight: 400 }}>
                          <label className="flex items-center gap-1.5 cursor-pointer">
                            <input type="checkbox" className="rounded" />
                            Remember Me
                          </label>
                          <button type="button" className="bg-transparent border-0 cursor-pointer text-xs" style={{ color: '#6B7A99' }} onClick={() => handleLoginTypeChange(3)}>
                            Forgot Password?
                          </button>
                        </div>
                        <button type="submit" className={btnPrimary}>{loading ? 'Loading...' : 'Sign In'}</button>
                      </form>
                    )}

                    {/* ---- OTP login ---- */}
                    {loginType === 2 && (
                      <>
                        {generateOtpDiv && (
                          <form onSubmit={sendOTP} className="space-y-3 mt-2">
                            {error && <p className="text-xs" style={{ color: 'var(--color-error)' }}>{error}</p>}
                            <input className={inputClass} type="text" placeholder="User ID" value={username} onChange={(e) => setUsername(e.target.value)} />
                            <button type="submit" className={btnPrimary}>Generate OTP</button>
                          </form>
                        )}
                        {enterOtpDiv && (
                          <form onSubmit={handleOtpLogin} className="space-y-3 mt-2">
                            <div className="flex justify-center gap-2">
                              <OtpInput
                                value={otp}
                                onChange={setOtp}
                                numInputs={config.OTP_LENGTH_LOGIN}
                                renderSeparator={<span className="mx-1" />}
                                renderInput={(props) => (
                                  <input {...props} style={{ width: '38px', height: '38px', textAlign: 'center', border: '1px solid #ccc', borderRadius: '6px', outline: 'none' }} />
                                )}
                              />
                            </div>
                            <button type="submit" className={btnPrimary}>Login</button>
                            <div className="text-center text-xs">
                              {!showResendOTPInterval && !hideResendOtpBtn && (
                                <p style={{ color: '#6B7A99' }}>
                                  {"Didn't receive the code? "}
                                  <span className="font-bold cursor-pointer" style={{ color: '#347DC1' }} onClick={resendOtp}>Resend</span>
                                </p>
                              )}
                              {showResendOTPInterval && <p style={{ color: 'var(--color-error)' }}>Resend Code in {countdown} seconds</p>}
                              {hideResendOtpBtn     && <p style={{ color: 'var(--color-error)' }}>Maximum number of retries exceeded</p>}
                            </div>
                          </form>
                        )}
                      </>
                    )}

                    {/* ---- Forgot password ---- */}
                    {loginType === 3 && (
                      <form onSubmit={sendPasswordResetLink} className="space-y-3 mt-2">
                        <h5 className="font-bold text-sm">Forgot your Password?</h5>
                        <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                          Enter your user name below, and we will send a link to reset your password.
                        </p>
                        {error && <p className="text-xs" style={{ color: 'var(--color-error)' }}>{error}</p>}
                        <input className={inputClass} type="text" placeholder="User ID" value={username} onChange={(e) => setUsername(e.target.value)} />
                        <button type="submit" className={btnPrimary}>{loading ? 'Loading...' : 'Send Link'}</button>
                        <p className="text-center text-xs cursor-pointer" style={{ color: '#347DC1' }} onClick={() => handleLoginTypeChange(1)}>
                          Return To Login
                        </p>
                      </form>
                    )}

                    {/* ---- Reset password (link from email) ---- */}
                    {loginType === 4 && usedToken === 0 && (
                      <form onSubmit={handleResetPassword} className="space-y-3 mt-2">
                        <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Enter your new password to complete the password reset process.</p>
                        {error && <p className="text-xs" style={{ color: 'var(--color-error)' }}>{error}</p>}
                        <input className={inputClass} type="password" placeholder="New Password"     value={newPassword}     onChange={(e) => setNewPassword(e.target.value)} />
                        <input className={inputClass} type="password" placeholder="Confirm New Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                        <button type="submit" className={btnPrimary}>{loading ? 'Loading...' : 'Change Password'}</button>
                      </form>
                    )}

                    {/* ---- Expired / used token ---- */}
                    {loginType === 4 && usedToken === 1 && (
                      <div className="text-center mt-6 space-y-3">
                        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>The Link has been used or Expired</p>
                        <p className="cursor-pointer font-bold text-sm" style={{ color: '#347DC1' }} onClick={() => handleLoginTypeChange(1)}>
                          Return To Login
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </>
  );
};

export default Login;
