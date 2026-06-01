import { UserManager, UserManagerSettings } from 'oidc-client-ts';
import { sleep } from './helpers';
import TssConf from '@app/modules/conf/TssGui.json';
import { useNavigate} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthentication } from '@app/modules/common/default/store/reducers/auth';
import {infoAlert,showLoginWarning} from '@app/modules/common/default/components/TssFunction';
import Log from '@app/modules/common/default/components/TssGUILog';
import encryptPayload from '@app/modules/common/default/js/encryptPayload.js';

declare const FB: any;

const GOOGLE_CONFIG: UserManagerSettings = {
  authority: 'https://accounts.google.com',
  client_id: '',
  client_secret: '',
  redirect_uri: `${window.location.protocol}//${window.location.host}/callback`,
  scope: 'openid email profile',
  loadUserInfo: true,
};

var tenantCode = TssConf.TENANT_CODE;
export const GoogleProvider = new UserManager(GOOGLE_CONFIG);

export const facebookLogin = () => {
  return new Promise((res, rej) => {
    let authResponse: any;
    FB.login(
      (r: any) => {
        if (r.authResponse) {
          authResponse = r.authResponse;
          FB.api(
            '/me?fields=id,name,email,picture.width(640).height(640)',
            (profileResponse: any) => {
              authResponse.profile = profileResponse;
              authResponse.profile.picture = profileResponse.picture.data.url;
              res(authResponse);
            }
          );
        } else {
        //  console.log('User cancelled login or did not fully authorize.');
          rej(undefined);
        }
      },
      { scope: 'public_profile,email' }
    );
  });
};

export const getFacebookLoginStatus = () => {
  return new Promise((res, rej) => {
    let authResponse: any = {};
    FB.getLoginStatus((r: any) => {
      if (r.authResponse) {
        authResponse = r.authResponse;
        FB.api(
          '/me?fields=id,name,email,picture.width(640).height(640)',
          (profileResponse: any) => {
            authResponse.profile = profileResponse;
            authResponse.profile.picture = profileResponse.picture.data.url;
            res(authResponse);
          }
        );
      } else {
        res(undefined);
      }
    });
  });
};

// export const authLogin = (email: string, password: string) => {
//   return new Promise(async (res, rej) => {
//     await sleep(500);
//     if (email === 'admin' && password === 'admin') {
//       localStorage.setItem(
//         'authentication',
//         JSON.stringify({ profile: { email: 'admin' } })
//       );
//       return res({ profile: { email: 'admin' } });
//     }
//     return rej({ message: 'Credentials are wrong!' });
//   });
// };

export const authLogin = async (requestBody: any) => {
  try {
    const encryptedData = await encryptPayload(requestBody, TssConf.encryptionKey);
    const response = await fetch(`${TssConf.SERVER_JS_API_URI}/validateLogin?tenantCode=${tenantCode}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ key: encryptedData.encryptedKey, data: encryptedData.encryptedPayload, iv: encryptedData.iv }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || response.statusText);
    }

    if (data.additionalInfo.status === 0) {
      // If MFA is enabled, store pending login data and signal Login component to prompt for MFA OTP
      if (data.additionalInfo.mfaEnabled === true || data.additionalInfo.mfaEnabled === 1 || data.additionalInfo.mfaEnabled === '1') {
        localStorage.setItem('acctName', data.additionalInfo.displayName);
        localStorage.setItem('acctID', data.additionalInfo.accountId);
        localStorage.setItem('username', requestBody.clientName);
        localStorage.setItem('password', btoa(requestBody.password));
        localStorage.setItem('landingPage', data.additionalInfo.landingPage);
        localStorage.setItem('tenantCode', data.additionalInfo.tenantCode);
        localStorage.setItem('tenantId', data.additionalInfo.tenantId);
        localStorage.setItem('pendingMfaAccessType', data.additionalInfo.accessType);
        return { mfaRequired: true, clientName: requestBody.clientName };
      }
      localStorage.setItem('authentication', JSON.stringify({ profile: { email: data.additionalInfo.displayName } }));
      localStorage.setItem('acctName', data.additionalInfo.displayName);
      localStorage.setItem('acctID', data.additionalInfo.accountId);
      localStorage.setItem('username', requestBody.clientName);
      localStorage.setItem('password', btoa(requestBody.password));
      localStorage.setItem('landingPage',data.additionalInfo.landingPage);
      localStorage.setItem('tenantCode',data.additionalInfo.tenantCode);
      localStorage.setItem('tenantId', data.additionalInfo.tenantId);
      const modulesResponse = await fetch(
        `${TssConf.SERVER_JS_API_URI}/getProductModules?productId=${TssConf.PRODUCT_ID}&moduleId=0&accessType=${data.additionalInfo.accessType}&tenantCode=${tenantCode}&clientId=${data.additionalInfo.accountId}`
      );

      if (!modulesResponse.ok) {
        throw new Error('Failed to fetch product modules');
      }

      const modulesData = await modulesResponse.json();
      localStorage.setItem('productModules', JSON.stringify(modulesData));

      return { profile: { email: data.additionalInfo.displayName }};
      } else if(data.additionalInfo.status === 8) {
          localStorage.setItem('acctName', data.additionalInfo.displayName);
	  localStorage.setItem('acctID', data.additionalInfo.accountId);
	  localStorage.setItem('username', requestBody.clientName);
	  localStorage.setItem('password', btoa(requestBody.password));
        return data.additionalInfo.status;
      } 
      else {
      throw new Error(data.additionalInfo.displayMessage);
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('An unexpected error occurred');
  }
};



export const getAuthStatus = () => {
  return new Promise(async (res, rej) => {
    await sleep(500);
    try {
      let authentication = localStorage.getItem('authentication');
      if (authentication) {
        authentication = JSON.parse(authentication);
        return res(authentication);
      }
      return res(undefined);
    } catch (error) {
      return res(undefined);
    }
  });
};

export const useLogout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const logOut = () => {
    showLoginWarning('warning','You are accessing the restricted page.');
    localStorage.removeItem('authentication');
    navigate('/login');
    dispatch(setAuthentication(undefined));
  };

  return logOut;
  };


export const changePassword = async (requestBody: any) => {
try {
    Log('ChangePasswordFirstLogin:::oidc', 'INFO', 'request body : '+JSON.stringify(requestBody));
    const encryptedData = await encryptPayload(requestBody, TssConf.encryptionKey);
    const response = await fetch(`${TssConf.SERVER_JS_API_URI}/tssgui/changePassword?tenantCode=${tenantCode}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ key: encryptedData.encryptedKey, data: encryptedData.encryptedPayload, iv: encryptedData.iv }),
    });

    const data = await response.json();
    Log('ChangePasswordFirstLogin:::oidc', 'INFO', 'response change password: '+JSON.stringify(data));
    if (!response.ok) {
     // throw new Error(data.errorCode || response.errorDescription);
   }
  //  alert(data.errorCode)
    if(data.response === "Password updated successfully") {
       Log('ChangePasswordFirstLogin:::oidc', 'INFO', 'data.o_status::: '+data.errorCode);
       return 0;
       } else {
        Log('ChangePasswordFirstLogin:::oidc', 'INFO', 'data.o_disp_msg::: '+data.errorDescription);
      throw new Error(data.errorDescription);
    }
    } catch (error) {
    if (error instanceof Error) {
     throw new Error(error.message);
     }
    throw new Error('An unexpected error occurred');
  }

};
