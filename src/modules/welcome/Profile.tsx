import React, { useState,useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ContentHeader from '@app/modules/common/default/components/TssContentHeader';
import { Image } from '@profabric/react-components';
import styled from 'styled-components';
import TssTabs from '@app/modules/common/default/components/TssTabs';
import AccountDetails from '@app/modules/welcome/AccountDetails';
import ChangePassword from '@app/modules/welcome/ChangePassword';
import tssguiConf from '@app/modules/conf/TssGui.json';
import Log from '@app/modules/common/default/components/TssGUILog';


const url 		   = tssguiConf.SERVER_JS_API_URI;

const Profile = () => {
  
  
   const   acctId = localStorage.getItem("acctID");
   const clientIP = localStorage.getItem("clientIP");
   const sessionID = localStorage.getItem("sessionID");
   const acctName = localStorage.getItem("acctName");
   const userName = localStorage.getItem("username");
   const productId = parseInt(localStorage.getItem("productID"),10);
  

  const [t] = useTranslation();
  const [loginIp, setLoginIp] = useState('')
  const [accountType, setAccountType] = useState('')
  const [lastLoginTime, setLastLoginTime]  = useState('')
  const [failedLoginTime, setFailedLoginTime]  = useState('')
  const [failedLoginIP, setFailedLoginIP]  = useState('')
  // const [activeTab, setActiveTab] = useState(t("modules.profile.tabLabel.accountDetails",{userName: userName}));
  // localStorage.setItem("activeTab", activeTab )
 


   //////////////////////////////////////////////////////////////////////////
  
    const TABLIST = [
    {
        "Name": t("modules.profile.tabLabel.accountDetails",{userName: userName}),
        "Component": <AccountDetails Tabs="accountDetails" />,
    },
    {
        "Name": t("modules.profile.tabLabel.changePassword",{userName: userName}),
        "Component": <ChangePassword Tabs="changePassword" />,
    }
    ];
    /////////////////////////////////////////////////////////////////////////
    useEffect(() => {
      const fetchLoginDetails = async () => {
          try {
              const response = await fetch(`${url}/tssgui/get/profile/details?productId=${productId}&acctId=${acctId}&tenantCode=${localStorage.getItem("tenantCode")}`);
              if (!response.ok) {
                  throw new Error(`"Error fetching data ": ${response.status} ${response.statusText}`);
              }
              const data = await response.json();
              setLoginIp(data.loginIp)
              setAccountType(data.accessTypeName)
              setLastLoginTime(data.lastLoginTime.slice(0, 19))
              setFailedLoginTime(data.failedLoginTime.slice(0, 19))
              setFailedLoginIP(data.failedLoginIp)
              Log('Profile', 'INFO', 'Data fetched successfully : '+JSON.stringify(data));           
          } catch (error) {
              Log('Profile', 'ERROR', 'Error fetching data : '+error);
          }
      };
      fetchLoginDetails();	  
    }, [productId, acctId]);
  //////////////////////////////////////////////////////////////////////////////
  return (
    <>
      
      <section className="content">
        <div className="container-fluid">
        <div className='col-md-12'>
          <div className="row">
            <div className="col-md-3">
              <div className="card custom-card-profile">
                <div className="card-body box-profile">
                  <div className="text-center image-container-profile">
                    <img
                      src="/src/modules/common/default/img/user.svg"
                      alt="User profile"
                      className='profile-user-img img-fluid img-circle '
                      style={{height:"80px", width:"80px", backgroundColor:'#fafafa',paddingTop: "10px"}}
                    />
                  </div>
                  <h3 className="profile-username text-center tss-heading">
                    {acctName}
                  </h3> 
                  <div className='row mt-3'>
                    <div className='col-md-5'><small><b className='tss-heading'>{t('modules.profile.label.loginIp')}</b></small></div>
                    <div className='col-md-7'><small>:&nbsp;&nbsp;{loginIp}</small></div>
                  </div>
                  <div className='row mt-1'>
                    <div className='col-md-5'><small><b className='tss-heading'>{t('modules.profile.label.acctType')}</b></small></div>
                    <div className='col-md-7'><small>:&nbsp;&nbsp;{accountType}</small></div>
                  </div>
                  <div className='row mt-1'>
                    <div className='col-md-5'><small><b className='tss-heading'>{t('modules.profile.label.lstLoginTime')}</b></small></div>
                    <div className='col-md-7'><small>:&nbsp;&nbsp;{lastLoginTime}</small></div>
                  </div>
                  <div className='row mt-1'>
                    <div className='col-md-5'><small><b className='tss-heading'>{t('modules.profile.label.failedLoginTime')}</b></small></div>
                    <div className='col-md-7'><small>:&nbsp;&nbsp;{failedLoginTime}</small></div>
                  </div>
                  <div className='row mt-1'>
                    <div className='col-md-5'><small><b className='tss-heading'>{t('modules.profile.label.failedLoginIp')}</b></small></div>
                    <div className='col-md-7'><small>:&nbsp;&nbsp;{failedLoginIP}</small></div>
                  </div>
              </div> 
            </div>
            </div>

            <div className="col-md-9">
              <div className="card">
                <TssTabs tabsList={TABLIST} defaultTab={t("modules.profile.tabLabel.accountDetails",{userName: userName})} />
              </div>
            </div>

          </div>
          </div>
        </div>
        
      </section>
    </>
  );
};

export default Profile;
