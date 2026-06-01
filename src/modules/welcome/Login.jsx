
import React, { useState,useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import config  from '@modules/conf/TssGui.json';
import { ToastContainer, toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { setAuthentication } from '@app/modules/common/default/store/reducers/auth';
import {showToast} from '@app/modules/common/default/components/TssFunction';
import { useLocation,useNavigate } from 'react-router-dom'
import '@app/modules/common/default/scss/Login.css';
import { authLogin,changePassword } from '@app/modules/common/default/utils/oidc-providers';
import OtpInput from 'react-otp-input';
import {checkPasswordValidation} from '@app/modules/common/default/js/validate.js';
import { useTranslation } from 'react-i18next';
import encryptPayload from '@app/modules/common/default/js/encryptPayload.js';
import TenantSelectPage from '@app/modules/welcome/TenantSelectPage';

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  let intervalId;
  const [t]= useTranslation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [serverIp,setServerIp] = useState('');
  const [clientIp,setClientIp] = useState('');
  const [displayDivName,setDisplayDivName] = useState('Login');
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const queryParams = new URLSearchParams(location.search);
  const [urltoken, setUrltoken] = useState("");
  const [linkExpirationOrRestSuccessMsg, setLinkExpirationOrResetSuccessMsg] = useState('');
  const [maskedemailid, setMaskedemailid] = useState('');
  const [resetPasswordUsername,setResetPasswordUsername] = useState('');
  const [acctId,setAcctId] = useState(''); 
  const [firstLogin, setFirstLogin] = useState(false); // default false
  const [loginType, setLoginType] = useState(1)
  const [generateOtpDiv, setGenerateOtpDiv] = useState(true);
  const [enterOtpDiv, setEnterOtpDiv] = useState(false);
  const [otp, setOtp] = React.useState('')
  const [countdown, setCountdown] = useState(0);
  const [hideResendOtpBtn,setHideResendOtpBtn] = useState(false);
  const [showResendOTPInterval, setShowResendOTPInterval] = useState(false);
  const [acctIdOtpLogin,setAcctIdOtpLogin] = useState('');
  const [maskedEmail,setMaskedEamil] = useState("");
  const [usedToken,setUsedToken] = useState(0);
  const [token,setToken] = useState('');
  const [showMfaScreen, setShowMfaScreen] = useState(false);
  const [mfaOtp, setMfaOtp] = useState('');
  const [mfaError, setMfaError] = useState('');
  var tenantCode = config.TENANT_CODE;
 
  // Tenant selection state
  const [showTenantSelect, setShowTenantSelect]       = useState(false);
  const [tenantList, setTenantList]                   = useState([]);
  const [pendingAuthResponse, setPendingAuthResponse] = useState(null);
  const [loginUsername, setLoginUsername]             = useState('');

  const dummyUserTenantMap = {
    john:  [{ TENANT_ID: 100, TENANT_NAME: 'Airtel India',  TENANT_CODE: 'airtel_in' }, { TENANT_ID: 200, TENANT_NAME: 'Jio', TENANT_CODE: 'jio_in' }, { TENANT_ID: 300, TENANT_NAME: 'Vodafone Idea', TENANT_CODE: 'vi_in' }],
    jane:  [{ TENANT_ID: 200, TENANT_NAME: 'Jio', TENANT_CODE: 'jio_in' }, { TENANT_ID: 300, TENANT_NAME: 'Vodafone Idea', TENANT_CODE: 'vi_in' }],
    bob:   [{ TENANT_ID: 300, TENANT_NAME: 'Vodafone Idea', TENANT_CODE: 'vi_in' }],
    alice: [{ TENANT_ID: 400, TENANT_NAME: 'BSNL', TENANT_CODE: 'bsnl_in' }, { TENANT_ID: 500, TENANT_NAME: 'Test Operator', TENANT_CODE: 'test01' }, { TENANT_ID: 600, TENANT_NAME: 'Demo Tenant', TENANT_CODE: 'demo' }],
    raj:   [{ TENANT_ID: 100, TENANT_NAME: 'Airtel India',  TENANT_CODE: 'airtel_in' }],
    'tenantadmin@tayana.in': [{ TENANT_ID: 100, TENANT_NAME: 'Airtel India',  TENANT_CODE: 'airtel_in' }, { TENANT_ID: 200, TENANT_NAME: 'Jio', TENANT_CODE: 'jio_in' }, { TENANT_ID: 300, TENANT_NAME: 'Vodafone Idea', TENANT_CODE: 'vi_in' }],
  };

  const demoUsers = {
    john: 'John123', jane: 'Admin123', bob: 'Admin123', alice: 'Admin123', raj: 'Admin123',
  };

  const numberOfRetries=config.OTP_Max_Retries;
  const otp_resend_Interval = config.OTP_Resend_Interval_Attempts;
  var defaultCountDownResendOTP =0;
  const handleLoginTypeChange = (type) => {
     localStorage.setItem('otpResendAttempt','0');
     setUsername('');  
     setGenerateOtpDiv(true);
     setEnterOtpDiv(false);
     setLoginType(type);
     setError("");
  }

const [showPassword, setShowPassword] = useState(false);


localStorage.setItem('productId',config.PRODUCT_ID.toString());

   useEffect(() => {
  const serverDetails = async () => {
    try {
      const addressData = await fetch(`${config.SERVER_JS_API_URI}/get/address`);
      
      if (!addressData.ok) {
        throw new Error(`Error: ${addressData.status} ${addressData.statusText}`);
      }

      const data = await addressData.json();
      localStorage.setItem("serverIP", data.serverIP);
      localStorage.setItem("clientIP", data.clientIP);
      setServerIp(data.serverIP);
      setClientIp(data.clientIP);
    } catch (error) {
      console.error("Failed to fetch server details:", error);
    }
  };

  serverDetails();
}, []);


   const dispatch = useDispatch();	
  const sessionId =  uuidv4();
/*
  const handleSubmit =async(e) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Both fields are required");
    } else {
      setError("");
      setLoading(true); 
 try {
	 const url = `${config.SERVER_JS_API_URI}/welcome/loginValidate?` +
	  `ServerIP=${encodeURIComponent(serverIp)}&` + 
  	 `UserName=${encodeURIComponent(username)}&` +
  	 `EncryptedPW=${encodeURIComponent("yourEncryptedPassword")}&` + 
 	 `ClientIP=${encodeURIComponent(clientIp)}&` + 
  	 `HttpSessionId=${encodeURIComponent(sessionId)}&` + 
  	 `Password=${encodeURIComponent(password)}&` +
  	 `accessFlag=${encodeURIComponent("0")}&` + 
  	 `accessToken=${encodeURIComponent("yourAccessToken")}`; 
   
	 const response = await fetch(url, {
      method: "GET", 
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.text(); 
    console.log(result); 
    setLoading(false);
const lMsg = result.split("--");

if (lMsg.length >= 3) {
    const status = lMsg[1].trim();
    const statusCode = lMsg[2].trim();  
    const modifiedStatusCode = statusCode.slice(0, -1);
    if (modifiedStatusCode == "*") {
        toast.error("Invalid Password! Please try again.");
    } else {
        const userId = lMsg[2].trim();  
        const token = lMsg[lMsg.length-3];
        const refreshToken = lMsg[lMsg.length-1].slice(0,-1);
        console.log("refershToken"+refreshToken);
        const tokenExpirySec = lMsg[lMsg.length-2];
        const accessType = lMsg[4].trim();
        const loggedInAcctName = lMsg[5].trim();
		  localStorage.setItem('authentication', JSON.stringify({ profile: { email: username } }));
		  localStorage.setItem('username', username);
	          localStorage.setItem('acctName',username);
		  localStorage.setItem('acctId', userId);
	           localStorage.setItem('acctID', userId);
		  localStorage.setItem('token', token);
		  localStorage.setItem('refreshToken',refreshToken);
		  localStorage.setItem('tokenExpirySec',tokenExpirySec);
		  localStorage.setItem('timestamp', Date.now().toString());	   
		  localStorage.setItem('sessionId',sessionId); 
		  localStorage.setItem('accessType',accessType);
        localStorage.setItem('loggedInAcctName',loggedInAcctName);
	const modulesResponse = await fetch(
        `${config.SERVER_JS_API_URI}/get/productModules?productId=${config.PRODUCT_ID}&moduleId=0&accessType=9999`
      );

      if (!modulesResponse.ok) {
        throw new Error('Failed to fetch product modules');
      }

      const modulesData = await modulesResponse.json();
      localStorage.setItem('productModules', JSON.stringify(modulesData));

 
     if(status == 0) {
		  dispatch(setAuthentication({ profile: { email: username} }));
     } else if(status == 8) {
        setDisplayDivName('FirstChangePassword'); 
     } 
   }
} else {
    console.error("The response does not contain the expected structure.");
}


  } catch (error) {
    console.error("Error during login request:", error);
    setLoading(true);	  
  }

    }
  };
*/
const handleSubmit = async (e) => {
e.preventDefault();
   if (!username || !password) {
      setError("Both fields are required");
    
    } else if (/^\s|\s$/.test(password)) { 
       setError(t("modules.Generic.errorMsg.noSpacesAllowed"))
    }
    else {
      setError("");
      setLoading(true);

      // Demo bypass
      const luser = username.toLowerCase();
      if (demoUsers[luser] && demoUsers[luser] === password) {
        const demoResponse = { profile: { email: username } };
        localStorage.setItem('acctName', username);
        localStorage.setItem('acctID', '9999');
        localStorage.setItem('username', username);
        const sitemapUsers = ['john', 'tenantadmin@tayana.in'];
        const demoLanding = sitemapUsers.includes(luser) ? 'SiteMap' : 'Dashboard';
        localStorage.setItem('landingPage', demoLanding);
        localStorage.setItem('modulePath', '');
        localStorage.setItem('moduleVersionType', '0');
        localStorage.setItem('moduleHeading', sitemapUsers.includes(luser) ? 'Sitemap' : 'Dashboard');
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
      //setAuthLoading(true);
      const requestBody = {
          "clientName": username,
          "password": password
      };
      const response = await authLogin(requestBody);
      if(response == 8) {
         setFirstLogin(true);
	 setLoading(false);     
         // setAuthLoading(false);
      } else if (response && response.mfaRequired) {
        setLoading(false);
        setShowMfaScreen(true);
      } else {
      const landingPage = localStorage.getItem("landingPage");

    if(landingPage == "SiteMap"){
       localStorage.setItem("modulePath","");
       localStorage.setItem("moduleVersionType","0");
       localStorage.setItem("moduleHeading","Sitemap");
    }else{
       localStorage.setItem("modulePath","");
       localStorage.setItem("moduleVersionType","0");
       localStorage.setItem("moduleHeading","Dashboard");
     }

      setLoading(false);
      const authResponse = { profile: { email: username } };
      const mappedTenants = dummyUserTenantMap[username.toLowerCase()] || [];
      if (mappedTenants.length > 1) {
        localStorage.setItem('authentication', JSON.stringify(authResponse));
        setLoginUsername(username);
        setTenantList(mappedTenants);
        setPendingAuthResponse(authResponse);
        setShowTenantSelect(true);
      } else {
        dispatch(setAuthentication(authResponse));
      }
      }


    } catch (error) {
      //setAuthLoading(false);
      setLoading(false);
      showToast('error', error.message);
	    
    }
    }
  };




//------------------------------

const handleMfaVerify = async (e) => {
  e.preventDefault();
  if (mfaOtp.length !== 6) {
    setMfaError('Please enter the complete 6-digit code');
    return;
  }
  setMfaError('');
  setLoading(true);
  try {
    const storedTenantCode = localStorage.getItem('tenantCode') || config.TENANT_CODE;
    const clientName = localStorage.getItem('username') || username;
    const response = await fetch(
      `${config.SERVER_JS_API_URI}/tssgui/mfa/verify?clientName=${encodeURIComponent(clientName)}&otp=${encodeURIComponent(mfaOtp)}`,
      { headers: { 'tssgui-tenant-code': storedTenantCode } }
    );
    const data = await response.json();
    if (response.ok && (data.response === 'success' || data.response === 'true' || data.response === true)) {
      const accessType = localStorage.getItem('pendingMfaAccessType') || '9999';
      const acctId = localStorage.getItem('acctID');
      const modulesResponse = await fetch(
        `${config.SERVER_JS_API_URI}/getProductModules?productId=${config.PRODUCT_ID}&moduleId=0&accessType=${accessType}&tenantCode=${storedTenantCode}&clientId=${acctId}`
      );
      if (modulesResponse.ok) {
        const modulesData = await modulesResponse.json();
        localStorage.setItem('productModules', JSON.stringify(modulesData));
      }
      const landingPage = localStorage.getItem('landingPage');
      if (landingPage === 'SiteMap') {
        localStorage.setItem('modulePath', '');
        localStorage.setItem('moduleVersionType', '0');
        localStorage.setItem('moduleHeading', 'Sitemap');
      } else {
        localStorage.setItem('modulePath', '');
        localStorage.setItem('moduleVersionType', '0');
        localStorage.setItem('moduleHeading', 'Dashboard');
      }
      localStorage.removeItem('pendingMfaAccessType');
      const authResponse = { profile: { email: clientName } };
      localStorage.setItem('authentication', JSON.stringify(authResponse));
      setLoading(false);
      const mappedTenants = dummyUserTenantMap[clientName.toLowerCase()] || [];
      if (mappedTenants.length > 1) {
        setLoginUsername(clientName);
        setTenantList(mappedTenants);
        setPendingAuthResponse(authResponse);
        setShowMfaScreen(false);
        setShowTenantSelect(true);
      } else {
        dispatch(setAuthentication(authResponse));
      }
    } else {
      setLoading(false);
      setMfaError(data.additionalInfo?.message || data.errorDescription || data.error || 'Invalid code. Please try again.');
    }
  } catch (error) {
    setLoading(false);
    setMfaError('An unexpected error occurred. Please try again.');
  }
};

//------------------------------

const handleChangePassword = async(e) => {
const complexity = config.PWD_COMPLEXITY;
                   const minLen = config.MIN_PWD_LENGTH;
                   const maxLen = config.MAX_PWD_LENGTH;
                   const validationError = checkPasswordValidation(newPassword, oldPassword,complexity, minLen, maxLen, t);	
 e.preventDefault();
   if (!username || !password) {
      setError("Both fields are required");
    } 
    else if (!oldPassword){
     setError("Old Password is required");

	}
        else if (!newPassword){
     setError("New Password is required");

        }
    else if (!confirmPassword){
     setError("Confirm Password is required");

        }
    else if(newPassword != confirmPassword) {
      setError("Confirm Password is not matching");
   }else if(validationError) {
      setError(validationError);
}
	
	
	else {
      setError("");
      setLoading(true);

try{
  const requestBody = {
        "clientId":localStorage.getItem("acctID"),
        "accountId":localStorage.getItem("acctID"),
        "oldPassword":oldPassword,
        "newPassword":newPassword
      }
      const response = await changePassword(requestBody);

  if(response  === 0) {
         setFirstLogin(false);
        setLoading(false);
        setPassword("");
        // setAuthLoading(false);
         showToast('success', 'Password Changed Successfully');
      } else {
  //    setAuthLoading(false);
      setLoading(false);
       showToast('error', response?.errorDescription);
    }
    }
     catch (error) {
      //setAuthLoading(false);
      showToast('error', error.message);
      setLoading(false);	     
    }
	}
}

//--------------------------------------
const showForgotPassword = () => {
  setDisplayDivName('sendLinkForgotPassword'); 
}

//-------------------------------------
const handleResetPassword = async(e) => {
   e.preventDefault();
   if(!newPassword || !confirmPassword) {
      setError("All fields are required");
      return;
   } else if(newPassword != confirmPassword) {
      setError("Confirm Password is not matching");
      return;
   }
   else {
      setError("");
   }

  const payload = {
  password: confirmPassword,
  token: token,
  accountId: acctId,
  clientIp: localStorage.getItem("clientIP"),
  sessionId: localStorage.getItem("sessionID"),
  productId: config.PRODUCT_ID
};

   setLoading(true);
   const encryptedData = await encryptPayload(payload, config.encryptionKey);
   const response = await fetch(`${config.SERVER_JS_API_URI}/welcome/forgotPasswordReset?tenantCode=${tenantCode}`, {
     method: "POST",
    body: JSON.stringify({ key: encryptedData.encryptedKey, data: encryptedData.encryptedPayload, iv: encryptedData.iv }),
     headers: {
        "Content-Type": "application/json",
      }, 
   });

    const result = await response.json();
    
    setLoading(false);
    if(result.status == "success") {
       showToast('success',"Password changed successfully");
       handleLoginTypeChange(1);
       navigate("/login");
    } else {
       showToast('error',result.status);
    }
 
}

//-------------------------------------
const sendPasswordResetLink = async(e) => {
    e.preventDefault();
    if (!username) {
      setError("Username required");
      return;
    } else {
      setError("");
    }
    const payload = {
    userName: username,
    clientIp: localStorage.getItem("clientIP"),
    sessionId: localStorage.getItem("sessionID"),
    productId: config.PRODUCT_ID
  };
    setLoading(true);
    const url = `${config.SERVER_JS_API_URI}/welcome/sendPasswordResetLink?tenantCode=${tenantCode}`
    const encryptedData = await encryptPayload(payload, config.encryptionKey);
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify({ key: encryptedData.encryptedKey, data: encryptedData.encryptedPayload, iv: encryptedData.iv }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();
    if(result.status == "error") {
       showToast('error',result.message);
    } else if (result.status == "success") {
       showToast('success',result.message);
    } else {
         showToast('error',"Failed to Send Link");
    }
    setLoading(false);
}

//----------------------------------
 useEffect(() => {
    if (queryParams.has('resetToken')) {
      const newToken = queryParams.get('resetToken');
      handlesetUrltoken(newToken);
    }
  }, [location.search]);
//----------------------------------
const returnToLogin = () => {
  setUrltoken('');
  setConfirmPassword('');
  setNewPassword('');
  setOldPassword('');
  setLoading('');
  setPassword('');
  setUsername('');
  setError("");
  setDisplayDivName('Login'); 
}
//----------------------------------
 const handlesetUrltoken = async (newValue) => {
    var  usedToken = '-1',token='',acctId='';
    const vtParams = { token: newValue, tenantCode: tenantCode };
    const encryptedData = await encryptPayload(vtParams, config.encryptionKey);
    const vtQueryString = `key=${encodeURIComponent(encryptedData.encryptedKey)}&data=${encodeURIComponent(encryptedData.encryptedPayload)}&iv=${encodeURIComponent(encryptedData.iv)}`;
	const response = await fetch(`${config.SERVER_JS_API_URI}/welcome/verifyResetToken?${vtQueryString}`,
    {
      method: 'GET',
    });
      const responseData = await response.json();
      usedToken=responseData.usedToken;
      setAcctId(responseData.accountId);
      setToken(responseData.mailLinkToken);
      if(usedToken == 1 ){
         setUsedToken(usedToken);
         setLoginType(4);
      } else if(usedToken == 0) {
         setUsedToken(usedToken);
         setLoginType(4); 
      } else {
        setUsedToken(1);
         setLoginType(4); 
      }
};

//----------------------------
const sendOTP = async (e) => {
  if(e) {
	e.preventDefault(); 
  }
  try {
const otpParams = { username, tenantCode: tenantCode };
    const encryptedData = await encryptPayload(otpParams, config.encryptionKey);
    const otpQueryString = `key=${encodeURIComponent(encryptedData.encryptedKey)}&data=${encodeURIComponent(encryptedData.encryptedPayload)}&iv=${encodeURIComponent(encryptedData.iv)}`;
    const response = await fetch(`${config.SERVER_JS_API_URI}/sendOtpLogin?${otpQueryString}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        });

        const result = await response.json();

        if (result.response === 'success') {
            const message = result.additionalInfo.message;
            setAcctIdOtpLogin(result.additionalInfo.acct_id);
            showToast('success', message);
            setGenerateOtpDiv(false);
            setEnterOtpDiv(true);
        } else {
            const errorMessage = result.message;
            console.error(errorMessage);
            showToast('error', errorMessage);
        }
    } catch (error) {
        console.error("An unexpected error occurred while sending OTP", error);
        showToast('error', 'An unexpected error occurred. Please try again later.');
    }  
}


//-------------------
const handleOtpLogin = async (e) => {
  e.preventDefault();
  if (otp === "") {
    showToast("error", "Please enter the OTP sent to Your Mobile Number");
    return false;
  }

  try {
   // setAuthLoading(true);
     const requestBody = {
        "i_server_ip": localStorage.getItem("serverIP"),
        "i_product_id": config.PRODUCT_ID,
        "clientName": username,
        "i_passwd": "",
        "i_client_ip": localStorage.getItem("clientIP"),
        "i_session_id": localStorage.getItem("sessionID"),
        "i_ldap_support": "0",
        "i_ldap_flag": 0,
        "i_ldap_grp_id": "",
        "i_ldap_emp_id": "123222",
        "otp":otp,
        "accountId":acctIdOtpLogin,
        "i_is_otp_login":1,
      };

    const encryptedData = await encryptPayload(requestBody, config.encryptionKey);
    const response = await fetch(`${config.SERVER_JS_API_URI}/verifyOtpLogin?tenantCode=${tenantCode}`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ key: encryptedData.encryptedKey, data: encryptedData.encryptedPayload, iv: encryptedData.iv }),
    });

    const data = await response.json();
    if (response.ok) {
     if(data.status == 0) {
      localStorage.setItem('authentication', JSON.stringify({ profile: { email: data.displayName } }));
      localStorage.setItem('acctName', data.displayName);
      localStorage.setItem('acctID', data.accountId);
      localStorage.setItem('username', username);
      localStorage.setItem('tenantCode',data.tenantCode);
      localStorage.setItem('tenantId', data.tenantId);
      localStorage.setItem('landingPage',data.landingPage);


      if(data.landingPage == "SiteMap"){
        localStorage.setItem("modulePath","");
        localStorage.setItem("moduleVersionType","0");
        localStorage.setItem("moduleHeading","Sitemap");
      }else{
        localStorage.setItem("modulePath","");
        localStorage.setItem("moduleVersionType","0");
        localStorage.setItem("moduleHeading","Dashboard");
      }

      const modulesResponse = await fetch(
        `${config.SERVER_JS_API_URI}/getProductModules?productId=${config.PRODUCT_ID}&moduleId=0&accessType=${data.accessType}&tenantCode=${tenantCode}&clientId=${data.accountId}`
      );

      if (!modulesResponse.ok) {
        throw new Error('Failed to fetch product modules');
      }

      const modulesData = await modulesResponse.json();
      localStorage.setItem('productModules', JSON.stringify(modulesData));

       dispatch(setAuthentication({ profile: { email: username} }));
     } else {
       showToast("error", "Failed to verify OTP,Please enter the correct OTP");
     }
    } else {
      setOtp('');
      showToast("error", "Failed to verify OTP");
    }

  } catch (error) {
    showToast("error", error);
  } finally {
   // setAuthLoading(false);
  }
};

//---------------------------------
const resendOtp = () => {
    const otpResendAttempt = parseInt(localStorage.getItem('otpResendAttempt') || '0', 10);
    let newresendAttempt = otpResendAttempt+1;
    localStorage.setItem('otpResendAttempt',newresendAttempt.toString());
    if(newresendAttempt <= numberOfRetries) {
      defaultCountDownResendOTP = getResendInterval(newresendAttempt);
      setShowResendOTPInterval(true);
      setCountdown(defaultCountDownResendOTP);
      clearInterval(intervalId);
      intervalId = setInterval(updateResendCountDown, 1000);
    } else {
        setHideResendOtpBtn(true);
    }
    sendOTP();
}

 const getResendInterval = (ResendAttempt) => {
    const configItem = otp_resend_Interval.find((item) => item.attempt == ResendAttempt.toString());
    return configItem ? parseInt(configItem.interval, 10) : 30;
 };

function updateResendCountDown() {
    const otpResendAttempt = parseInt(localStorage.getItem('otpResendAttempt') || '0', 10);
      defaultCountDownResendOTP--;

    if(defaultCountDownResendOTP == 0 && otpResendAttempt < numberOfRetries) {
        setShowResendOTPInterval(false);
        clearInterval(intervalId);
    } else if (defaultCountDownResendOTP == 0 && otpResendAttempt == numberOfRetries) {
      clearInterval(intervalId);
      setShowResendOTPInterval(false);
      setHideResendOtpBtn(true);
    }
    setCountdown(defaultCountDownResendOTP);
 }

  return (
<>
    {showTenantSelect && (
      <TenantSelectPage
        tenants={tenantList}
        userName={loginUsername}
        onSelect={(tenant) => {
          localStorage.setItem('selectedTenantId',   String(tenant.TENANT_ID));
          localStorage.setItem('selectedTenantName', tenant.TENANT_NAME);
          localStorage.setItem('selectedTenantCode', tenant.TENANT_CODE);
          localStorage.setItem('authentication', JSON.stringify(pendingAuthResponse));
          setShowTenantSelect(false);
          dispatch(setAuthentication(pendingAuthResponse));
        }}
      />
    )}
    {!showTenantSelect && (
<div className="login-screen-bg">

 <div className="logo-container" style={{ position: "absolute", top: "10px", left: "10px" }}>
  <img
    src="/images/tayana_logo.svg"
    alt="tayana logo"
    className="img-fluid"
    style={{ maxWidth: "120px", height: "auto", display: "block" }}
  />
</div> 
<div className="container-fluid h-100 p-0">
    <div className="row h-100 d-flex align-items-center justify-content-center g-0"> {/* Removed extra gaps */}
    
<div className="col-md-6 col-12 d-flex flex-column align-items-center d-none d-md-block mt-4" >

      <img
        src="/images/LoginScreenImage.svg"
        alt="Login Screen Image"
        className="img-fluid login-screen-image"
      />

      <p className="login-screen-footer text-center mt-4" >{config.LOGIN_SCREEN_FOOTER}</p>
    </div>

    {/* Right Side - Login Form */}
    <div className="col-md-6 col-12 d-flex flex-column justify-content-center align-items-center" style={{marginTop:"-15px"}}>
     <div className="d-flex flex-column justify-content-center" style={{marginBottom:"45px"}}>
         <img src="/images/loginLogo.png" style={{ width: "100px",height:"auto" }} alt="Logo" />
          </div>

      <div className="login-card w-100 px-3" style={{minHeight:"60vh",transform: "translateY(-30px)"}}>
        
        {/* Product Name & Logo */}
<div className="row mt-4 text-center">
  <div className="col-12 d-flex align-items-center justify-content-center">
    <img
      src="/images/image.svg"
      alt="logo"
      className="img-fluid"
      style={{ maxWidth: "80px", marginRight: "10px" }} // Adds spacing between image & text
    />
    <h3 className="product-title" style={{ fontFamily: "Gilroy-Bold", color: "#347DC1", margin: 0 }}>
      {config.PRODUCT_NAME}
    </h3>
  </div>
</div>

{showMfaScreen ? (
  <>
    <form onSubmit={handleMfaVerify} className="px-3">
      <div className="text-center mt-4 mb-3">
        <h5 style={{ fontFamily: 'Gilroy-Bold', color: '#347DC1' }}>Two-Factor Authentication</h5>
        <p className="text-muted" style={{ fontSize: '14px' }}>Enter the 6-digit code from your authenticator app</p>
      </div>
      {mfaError && <p className="text-danger text-center">{mfaError}</p>}
      <div className="d-flex justify-content-center mb-4">
        <OtpInput
          value={mfaOtp}
          onChange={(val) => { setMfaOtp(val); setMfaError(''); }}
          numInputs={6}
          renderSeparator={<span style={{ margin: '0 4px' }}></span>}
          renderInput={(props) => (
            <input
              {...props}
              type="password"
              style={{
                width: '40px',
                height: '40px',
                textAlign: 'center',
                fontSize: '18px',
                border: '1px solid #ced4da',
                borderRadius: '4px',
                outline: 'none'
              }}
            />
          )}
        />
      </div>
      <div className="text-center">
        <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#347DC1', borderRadius: '16px' }}>
          {loading ? 'Verifying...' : 'Verify & Sign In'}
        </button>
      </div>
      <div className="text-center mt-3">
        <p onClick={() => { setShowMfaScreen(false); setMfaOtp(''); setMfaError(''); }} style={{ cursor: 'pointer', color: '#347DC1', fontSize: '14px' }}>
          Back to Login
        </p>
      </div>
    </form>
  </>
) : firstLogin == true ?(
  <>
     <form onSubmit={handleChangePassword} className="px-3">
	{error && <p className="text-danger">{error}</p>}
    <div className="mb-3 mt-3">
      <input
        type="password"
        className="form-control"
        placeholder="Old Password"
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
        style={{ borderRadius: "10px" }}
      />
    </div>
    <div className="mb-3">
      <input
        type="password"
        className="form-control"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        style={{ borderRadius: "10px" }}
      />
    </div>
    <div className="mb-3">
      <input
        type="password"
        className="form-control"
        placeholder="Confirm New Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        style={{ borderRadius: "10px" }}
      />
    </div>
	           <div className="text-center">
              <button type="submit" className="btn btn-primary" style={{backgroundColor:"#347DC1",borderRadius:"16px",width:"auto"}}>
                {loading ? "Loading..." : "Change Password"}
              </button>
            </div>

     </form>	
  </>
):(
<>

        {/* Login Options */}
        {loginType === 1 || loginType === 2 ? (
          <div className="row mt-3 justify-content-center">
            <div className="text-center">
              <ul className="list-inline d-flex justify-content-center" style={{ gap: "1rem" }}>

                <li className="list-inline-item" style={{cursor:"pointer"}}>
                  <a
                    className={`login-type ${loginType === 1 ? "active" : ""}`}
                    onClick={() => handleLoginTypeChange(1)}
                    style={{ color: "#000000", textDecoration: "none" ,fontFamily:"Gilroy",fontWeight: loginType == 1 ? 'bold' : 'normal',position: "relative", paddingBottom: "8px" }}
                  >
                    Login with Password
 {loginType == 1 && (
    <span
      style={{
        position: "absolute",
        left: "50%",
        bottom: "0",
        transform: "translateX(-50%)",
        width: "60%", // Adjust width of underline
        height: "2px", // Thickness of underline
        backgroundColor: "#347DC1",
      }}
    />
  )}
                  </a>
                </li>
                <li className="list-inline-item" style={{cursor:"pointer"}}>
                  <a
                    className={`login-type ${loginType === 2 ? "active" : ""}`}
                    onClick={() => handleLoginTypeChange(2)}
                     style={{ color: "#000000", textDecoration: "none",fontFamily:"Gilroy",fontWeight: loginType == 2 ? 'bold' : 'normal',paddingBottom: "8px",position: "relative" }}
                  >
                    Login with OTP

 {loginType == 2 && (
    <span
      style={{
        position: "absolute",
        left: "50%",
        bottom: "0",
        transform: "translateX(-50%)",
        width: "60%", // Adjust width of underline
        height: "2px", // Thickness of underline
        backgroundColor: "#347DC1",
      }}
    />
  )}

                  </a>
                </li>
              </ul>
            </div>
          </div>
        ) : null}
        
	  {/* Login with Password */}
        {loginType === 1 && (
          <form onSubmit={handleSubmit} className="px-3">
            {error && <p className="text-danger">{error}</p>}

            <div className="mt-3 mb-4">
              <input
                type="text"
                className="form-control"
                placeholder="User ID"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
		style={{borderRadius:"10px"}}
              />
            </div>







<div className="mt-3 mb-2 position-relative">
  <input
    type={showPassword ? "text" : "password"}
    className="form-control"
    placeholder="Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    style={{ borderRadius: "10px", paddingRight: "40px" }}
  />
		{password && (
  <i
    className={`fa ${showPassword ? "fa-eye" : "fa-eye-slash"}`}
    onClick={() => setShowPassword(!showPassword)}
    style={{
      position: "absolute",
      right: "15px",
      top: "50%",
      transform: "translateY(-50%)",
      cursor: "pointer",
      color: "#999"
    }}
  ></i>
		)}
</div>


<div className="d-flex justify-content-center w-100 mb-4 px-4">
  <div className="d-flex align-items-center justify-content-between" style={{ width: "300px", gap: "20px" }}>
    {/* Remember Me Checkbox */}
    <div className="d-flex align-items-center">
      <input type="checkbox" className="form-check-input me-2" id="rememberMe" />&nbsp;
      <label className="form-check-label text-muted mb-0" htmlFor="rememberMe" style={{ fontFamily: "Gilroy" }}>
        Remember Me
      </label>
    </div>

    {/* Forgot Password */}
    <a
      className="text-muted"
      style={{ textDecoration: "none", cursor: "pointer", whiteSpace: "nowrap", fontFamily: "Gilroy" }}
      onClick={() => handleLoginTypeChange(3)}
    >
      Forgot Password?
    </a>
  </div>
</div>




            <div className="text-center">
              <button type="submit" className="btn btn-primary" style={{backgroundColor:"#347DC1",borderRadius:"16px"}}>
                {loading ? "Loading..." : "Sign in"}
              </button>
            </div>
          </form>
        )}

        {/* Login with OTP */}
        {loginType === 2 && (
        <>
         {generateOtpDiv &&
         <form onSubmit={sendOTP} className="px-3">	 
          <div className="px-3 mt-3">
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="User ID"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
		style={{borderRadius:"10px"}}
              />
            </div>

            <div className="text-center" style={{marginTop:'35px'}}>
              <button type="submit" className="btn btn-primary" style={{backgroundColor:"#347DC1",borderRadius:"16px",width:"auto"}} onClick={sendOTP}>
                Generate OTP
              </button>
            </div>
          </div>
        </form>
         }

	 {enterOtpDiv &&
          <form onSubmit={handleOtpLogin} className="px-3">
           <div className="px-3">
            <div className="mb-3">
                <div className="otp-input-container gap-3" style={{ display: 'flex', justifyContent: 'center', marginBottom:'30px',gap:'1em'}}>
       <OtpInput value={otp} onChange={setOtp} numInputs={config.OTP_LENGTH_LOGIN} renderSeparator={<span style={{ margin: '0 8px' }}></span>}  renderInput={(props) => (<input{...props} style={{ width: '40px', height: '40px', textAlign: 'center', border: '1px solid #ccc',borderRadius: '4px',outline: 'none', }}/>)} />
               </div>
	      <div className="text-center">
	       <button type="submit" className="btn btn-primary" style={{backgroundColor:"#347DC1",borderRadius:"16px",width:"auto"}} onClick={handleOtpLogin}>Login</button>
	      </div>

	     <div className="text-center mt-3">
             {!showResendOTPInterval && !hideResendOtpBtn &&
	      <p>
         	 Didnt recieve the code? <span style={{ fontWeight: 'bold',cursor:'pointer' }} onClick={resendOtp}>Resend</span>
      	      </p>
             }
    	     {showResendOTPInterval &&
         	<p style={{color:"red"}}> Resend Code in {countdown} seconds</p>
      	     } 
	     {hideResendOtpBtn &&
                 <p style={{color:"red"}}> Maximum number of retries exceeded</p>
	     }
	       </div>
	     </div>
	   </div>
          </form>
	 }
	</>
        )}

        {/* Forgot Password */}
        {loginType === 3 && (
          <form onSubmit={sendPasswordResetLink} className="px-3">
            <h5>Forgot your Password?</h5>
            <p>
              <small>
                Enter your user name below, and we will send a link to reset your password.
              </small>
            </p>
            
            {error && <p className="text-danger">{error}</p>}
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="User ID"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
		style={{borderRadius:"10px"}}
              />
            </div>

            <div className="text-center">
              <button type="submit" className="btn btn-primary" onClick={sendPasswordResetLink}  style={{backgroundColor:"#347DC1",borderRadius:"16px",width:"100px"}}>
                {loading ? "Loading..." : "Send Link"}
              </button>
            </div>

            <div className="text-center mt-2">
              <p onClick={() => handleLoginTypeChange(1)} style={{ cursor: "pointer" }}>
                Return To Login
              </p>
            </div>
          </form>
        )}

        {(loginType === 4 && usedToken == 0) && (
            <form onSubmit={handleResetPassword} className="px-3">
             <p>
              <small>
                Enter your new password to complete the password reset process.
              </small>
             </p>
              {error && <p className="text-danger">{error}</p>}
              <div className="mb-3">
               <input type="password" className="form-control"  placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} style={{ borderRadius: "10px" }}/>
              </div>
              <div className="mb-3">
                <input type="password" className="form-control" placeholder="Confirm New Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} style={{ borderRadius: "10px" }}/>
               </div>
               <div className="text-center">
                 <button type="submit" className="btn btn-primary" onClick={handleResetPassword}  style={{backgroundColor:"#347DC1",borderRadius:"16px",width:"200px"}}>
                    {loading ? "Loading..." : "Change Password"}
                 </button>
              </div>

                      
            </form>
        )}

        {(loginType === 4 && usedToken == 1) && (
            <form onSubmit={handleResetPassword} className="px-3">
             <div className="text-center mt-5">
             <p>
                The Link has been used or Expired
             </p>
             </div>
              <div className="text-center mt-2">
              <p onClick={() => handleLoginTypeChange(1)} style={{ cursor: "pointer",fontWeight:'bold' }}>
                Return To Login
              </p>
            </div>

            </form>
        )}

</>
)}


      </div>
    </div>
  </div>
</div>
</div>
    )}
</>
  );
};

export default Login;
