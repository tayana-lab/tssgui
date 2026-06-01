import { useEffect, useState} from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import { useWindowSize } from '@app/modules/common/default/hooks/useWindowSize';
import { calculateWindowSize } from '@app/modules/common/default/utils/helpers';
import { useDispatch, useSelector } from 'react-redux';
import { setWindowSize } from '@app/modules/common/default/store/reducers/ui';
import ReactGA from 'react-ga4';

import PublicRoute from './routes/PublicRoute';
import PrivateRoute from './routes/PrivateRoute';

import { setAuthentication } from '@app/modules/common/default/store/reducers/auth';
import {
  GoogleProvider,
  getAuthStatus,
  getFacebookLoginStatus,
} from '@app/modules/common/default/utils/oidc-providers';

import Main from '@app/modules/welcome/HomePage_Main';
import Login from '@app/modules/welcome/Login';
import ForgetPassword from '@modules/welcome/ForgotPassword';
import Profile from '@app/modules/welcome/Profile';
import Dashboard from '@app/modules/welcome/TssDashboard';
import DemoPage from '@modules/demo/DemoPage';
import Error404 from '@app/modules/welcome/Error404';

import AccountTypeMain from '@app/modules/admin/AccountTypeMain';
import AccountsMain from '@modules/admin/AccountsMain';
import ActivityTrackerTabs from '@modules/admin/ActivityTrackerTabs';
import ResetPasswordMain from '@modules/admin/ResetPasswordMain';

import Report from '@modules/mis/Reports';
import SiteMap from '@modules/welcome/SiteMap';

import FileUploadTracker from '@app/modules/welcome/FileUploadTracker';
import Configuration from '@app/modules/admin/ConfigurationTabs';
import TenantCreation from '@app/modules/admin/TenantCreation';
import TenantMappingTabs from '@app/modules/admin/TenantMappingTabs';
import TenantOrgChart from '@app/modules/admin/TenantOrgChart';


import {
  addWindowClass,
  setWindowClass,
  removeWindowClass,
} from '@app/modules/common/default/utils/helpers';

import { v4 as uuidv4 } from 'uuid';
import { authLogin } from '@app/modules/common/default/utils/oidc-providers';
import TssConf from '@app/modules/conf/TssGui.json';

const { VITE_NODE_ENV } = import.meta.env;

const App = () => {

  const windowSize = useWindowSize();
  const screenSize = useSelector((state: any) => state.ui.screenSize);
  const dispatch = useDispatch();
  const location = useLocation();
  const sessionId =  uuidv4();
  const landingPage = localStorage.getItem("landingPage");

  const components = {
    Dashboard,
    SiteMap,
  };

  const LandingComponent = components[landingPage] || SiteMap;
  const [isAppLoading, setIsAppLoading] = useState(true);

  const checkSession = async () => {
    try {
      let responses: any = await Promise.all([
        getAuthStatus(),
      ]);

      responses = responses.filter((r: any) => Boolean(r));

      if (responses && responses.length > 0) {
        dispatch(setAuthentication(responses[0]));
      }
    } catch (error: any) {
      console.log('error', error);
    }
    setIsAppLoading(false);
  };

  useEffect(() =>{
    const serverDetails = async () => {
      const addressData = await fetch(`${TssConf.SERVER_JS_API_URI}/get/address`);
      const data = await addressData.json();
      localStorage.setItem("serverIP", data.serverIP);
      localStorage.setItem("clientIP", data.clientIP);
      localStorage.setItem("sessionID", sessionId);
      localStorage.setItem("productID", TssConf.PRODUCT_ID);
    };
    serverDetails();
  }, []);

  useEffect(() => {
    checkSession();
    const checkParam = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');
      if (token) {
        let username = '', password = '';
        const response = await fetch(`${TssConf.SERVER_JS_API_URI}/decodeToken`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ token })
        });
        if (response.ok) {
          const data = await response.json();
          username = data.decoded.username;
          password = data.decoded.password;
        }
        const requestBody = {
          "i_server_ip": localStorage.getItem("serverIP"),
          "i_product_id": TssConf.PRODUCT_ID,
          "i_username": username,
          "i_passwd": password,
          "i_client_ip": localStorage.getItem("clientIP"),
          "i_session_id": localStorage.getItem("sessionID"),
          "i_ldap_support": "0",
          "i_ldap_flag": 0,
          "i_ldap_grp_id": "",
          "i_ldap_emp_id": "123222"
        };
        const logindata = await authLogin(requestBody);
        dispatch(setAuthentication(logindata as any));
      }
    };
    checkParam();
  }, []);

  useEffect(() => {
    const size = calculateWindowSize(windowSize.width);
    if (screenSize !== size) {
      dispatch(setWindowSize(size));
    }
  }, [windowSize]);

  useEffect(() => {
    if (location && location.pathname && VITE_NODE_ENV === 'production') {
      ReactGA.send({
        hitType: 'pageview',
        page: location.pathname,
      });
    }
  }, [location]);

  if (isAppLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '90vh' }}>
        <img src={`/images/${TssConf.PRODUCT_LOGO}`} alt="Logo" style={{ width: '200px', height: 'auto' }} />
      </div>
    );
  }

  const theme = localStorage.getItem("body-theme") || 'light-mode';
  addWindowClass(theme);

  return (
    <>
       <Routes>
        <Route path="/login" element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
        </Route>
        <Route path="/forgot-password" element={<PublicRoute />}>
          <Route path="/forgot-password" element={<ForgetPassword />} />
        </Route>

        <Route path="/" element={<PrivateRoute />}>
          <Route path="/" element={<Main />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/" element={<LandingComponent />} />
            <Route path="/dashboard" element ={<Dashboard/>} />
            <Route path="/demoPage" element={<DemoPage />} />
             <Route path="/accountType" element={<AccountTypeMain/>} />
            <Route path="/accounts" element={<AccountsMain/>} />
            <Route path="/activityTracker" element={<ActivityTrackerTabs/>} />
            <Route path="/resetPassword" element={<ResetPasswordMain/>} />
            <Route path="*" element={<Error404 />} />

            <Route path ='/sitemap' element ={<SiteMap/>} />
	    <Route path="/fileUploadTracker" element ={<FileUploadTracker/>} />
	    <Route path="/configuration" element ={<Configuration/>} />
            <Route path="/tenantCreation" element={<TenantCreation />} />
            <Route path="/tenantMapping" element={<TenantMappingTabs />} />
            <Route path="/tenantOrgChart" element={<TenantOrgChart />} />
            <Route path="/tenant" element={<TenantOrgChart />} />

          </Route>

        </Route>
      </Routes>
 
   </>
  );
};

export default App;

