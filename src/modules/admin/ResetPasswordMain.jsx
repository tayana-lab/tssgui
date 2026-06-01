import React,{useState, useEffect} from 'react'
import Log from '@app/modules/common/default/components/TssGUILog'
import {showToast} from '@app/modules/common/default/components/TssFunction';
import ResetPasswordView from '@modules/admin/ResetPasswordView';
import { useLogout } from '@app/modules/common/default/utils/oidc-providers';
import TssSpinner from '@app/modules/common/default/components/TssSpinner';
import conf from '@modules/conf/TssGui.json'
import encryptPayload from '@app/modules/common/default/js/encryptPayload.js';
import { useTranslation } from 'react-i18next';

const moduleId = 1300
let clientID, clientIP, sessionID, clientName, userName, productId;

const url = conf.SERVER_JS_API_URI;
const minPwd= conf.MIN_PWD_LENGTH
const maxPwd=conf.MAX_PWD_LENGTH


const ResetPasswordMain = () => {
  const [t]= useTranslation();
  const logOut = useLogout();

  const [loading, setLoading] = useState(true);

  const [showResetPasswordDiv, setShowResetPasswordDiv] = useState(true)
  const [showConfirmDiv, setShowConfirmDiv] = useState(false)

  const [permission, setPermission] = useState(0)
  const [accountList, setAccountList] = useState([])

  const [loginId, setLoginId] = useState({})
  const [loginIdErrMsg, setLoginIdErrMsg] = useState('')
  const [loginIdValidationTheme, setLoginIdValidationTheme] = useState('selectForm')

  const [newPassword, setNewPasswordId] = useState('')
  const [newPasswordErrMsg, setNewPasswordErrMsg] = useState('')
  const [newPasswordValidationTheme, setNewPasswordValidationTheme] = useState('form')

  const [confirmPassword, setConfirmPassword] = useState('')
  const [confirmPasswordErrMsg, setConfirmPasswordErrMsg] = useState('')
  const [confirmPasswordValidationTheme, setConfirmPasswordValidationTheme] = useState('form')

  const [acctPassword, setAcctPassword] = useState('')
  const [acctPasswordErrMsg, setAcctPasswordErrMsg] = useState('')
  const [acctPasswordValidationTheme, setAcctPasswordValidationTheme] = useState('form')

  /////////////////////////////////////////////////////////////////////////
 
  useEffect(() => {
    clientID = localStorage.getItem("acctID");
    clientIP = localStorage.getItem("clientIP");
    sessionID = localStorage.getItem("sessionID");
    clientName = localStorage.getItem("acctName");
    userName = localStorage.getItem("username");
    productId = parseInt(localStorage.getItem("productID"),10);
  },[]);
  ////////////////////////////////////////////////////////////////////////
  //To check the module Permission
  useEffect(() => {
    const fetchData = async () => {
      try {
        const encryptedData = await encryptPayload({ productId, clientId: clientID, moduleId, clientIp: clientIP, sessionId: sessionID, tenantCode: localStorage.getItem("tenantCode") }, conf.encryptionKey);
        const response = await fetch(`${url}/tssgui/checkAccess?key=${encodeURIComponent(encryptedData.encryptedKey)}&data=${encodeURIComponent(encryptedData.encryptedPayload)}&iv=${encodeURIComponent(encryptedData.iv)}`, { headers: { 'tssgui-tenant-code': localStorage.getItem('tenantCode') } });
        if (!response.ok) {
          throw new Error(t('modules.Generic.errorMsg.failed'));
        }
        const data = await response.text();
        const responseObject = JSON.parse(data);
        const permission = responseObject.permission;
        if (permission == 0) {
          logOut();
        }
        setPermission(permission)
        Log('Reset Password', 'INFO', 'Data fetched successfully : ' + JSON.stringify(data));
      } catch (error) {
        Log('Reset Password', 'ERROR', 'Error fetching data : ' + error);
      }
    };
    fetchData();
  }, []);
  //////////////////////////////////////////////////////////////////////////////////////
  //To get the list of accounts
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const encryptedData = await encryptPayload({ productId, acctId: clientID }, conf.encryptionKey);
        const response = await fetch(`${url}/tssgui/getAccountList?key=${encodeURIComponent(encryptedData.encryptedKey)}&data=${encodeURIComponent(encryptedData.encryptedPayload)}&iv=${encodeURIComponent(encryptedData.iv)}`, { headers: { 'tssgui-tenant-code': localStorage.getItem('tenantCode') } });
        setLoading(false)
        if (!response.ok) {
          throw new Error(t('modules.Generic.errorMsg.failed'));
        }
        const data = await response.json();
        Log('Reset Password', 'INFO', 'Fetched Accounts:' + JSON.stringify(data));
        setAccountList(data);
      } catch (error) {
        Log('Reset Password', 'ERROR', 'Error fetching accounts:' + error);
      }
    };
    fetchAccounts();
  }, []);
  //////////////////////////////////////////////////////////////////////////////////////
  //Reset the account password
  const resetPassword = async () => {
    let isValid = true;
    if (acctPassword == "") {
      setAcctPasswordValidationTheme('formError')
      setAcctPasswordErrMsg(t('modules.Generic.errorMsg.mandatory'))
      isValid = false;
    }
    else if (/^\s|\s$/.test(acctPassword)) {  
      setAcctPasswordValidationTheme("formError");
      setAcctPasswordErrMsg(t("modules.Generic.errorMsg.noSpacesAllowed"));
      isValid = false;
    } 


    if (!isValid){
      return;
    }
    
    else {
      try {

        const requestBody = {
	  //"productId":productId,
          "accountId": parseInt(loginId.value, 10),
          "clientId": parseInt(clientID, 10),
          "clientPassword": acctPassword,
          "password": newPassword
        }
        const encryptedData = await encryptPayload(requestBody, conf.encryptionKey);
        const response = await fetch(`${url}/tssgui/resetPassword`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'tssgui-tenant-code': localStorage.getItem('tenantCode'),
          },
          body: JSON.stringify({ key: encryptedData.encryptedKey, data: encryptedData.encryptedPayload, iv: encryptedData.iv }),
        });
        if (!response.ok) {
          Log('Reset Password', 'WARN', t('modules.Generic.errorMsg.responseNotOk'))
        }
        if (response.ok) {
          const resultString = await response.text();
          const responseObject = JSON.parse(resultString);
          const alerttype = responseObject.additionalInfo.alerttype;
          const disp_msg = responseObject.response;
          if (alerttype == "alert-danger") {
            showToast('error', disp_msg);
            resetAll()
          }
          else {
            showToast('success', disp_msg);
            resetAll()
          }
        }
      }
      catch (error) {
        Log('Reset Password', 'ERROR', "Error resetting account password. " + error);
      }
    }
  }
  //////////////////////////////////////////////////////////////////////////////////////
  const changeLoginId = (event) => {
    setLoginId(event)
    if(Object.keys(event).length !== 0){
      setLoginIdValidationTheme('selectForm');
      setLoginIdErrMsg('');
    }
  }	
  //////////////////////////////////////////////////////////////////////////////////////
  const changeNewPassword = (event) => {
    setNewPasswordId(event.target.value)
    
    if(event.target.value == ""){
      setNewPasswordValidationTheme('formError')
      setNewPasswordErrMsg(t('modules.Generic.errorMsg.mandatory'))
    }
    else if (/^\s|\s$/.test(event.target.value)) {  
      setNewPasswordValidationTheme("formError");
      setNewPasswordErrMsg(t("modules.Generic.errorMsg.noSpacesAllowed"));
    }  
    else if(event.target.value.length < minPwd){
      setNewPasswordValidationTheme('formError')
      setNewPasswordErrMsg(t('modules.Generic.errorMsg.minChar',{minChar : minPwd}))
    }
    else{
      setNewPasswordValidationTheme('form')
      setNewPasswordErrMsg("")
    }
  }
  //////////////////////////////////////////////////////////////////////////////////////
  const changeConfirmPassword = (event) => {
    setConfirmPassword(event.target.value)
    if(event.target.value == ""){
      setConfirmPasswordValidationTheme('formError')
      setConfirmPasswordErrMsg(t('modules.Generic.errorMsg.mandatory'))
    }
    else if (/^\s|\s$/.test(event.target.value)) {  
      setConfirmPasswordValidationTheme("formError");
      setConfirmPasswordErrMsg(t("modules.Generic.errorMsg.noSpacesAllowed"));
    }  
    if (Object.keys(loginId).length === 0) {
      setLoginIdValidationTheme('selectFormError');
      setLoginIdErrMsg(t('modules.Generic.errorMsg.mandatory'));
    } 
    if(newPassword == ""){
      setNewPasswordValidationTheme('formError')
      setNewPasswordErrMsg(t('modules.Generic.errorMsg.mandatory'))
    }
    if(event.target.value != newPassword){
      setConfirmPasswordValidationTheme('formError')
      setConfirmPasswordErrMsg(t('modules.Generic.errorMsg.passwordMismatch'))
    }
    else {
      setConfirmPasswordValidationTheme('form')
      setConfirmPasswordErrMsg("")
    }
  }
  //////////////////////////////////////////////////////////////////////////////////////
  const changeAcctPassword = (event) => {
    setAcctPassword(event.target.value)
    if(event.target.value == ""){
      setAcctPasswordValidationTheme('formError')
      setAcctPasswordErrMsg(t("modules.Generic.errorMsg.mandatory"))
    }
    else if (/^\s|\s$/.test(event.target.value)) {  
      setAcctPasswordValidationTheme("formError");
      setAcctPasswordErrMsg(t("modules.Generic.errorMsg.noSpacesAllowed"));
    }  
    else {
      setAcctPasswordValidationTheme('form')
      setAcctPasswordErrMsg('')
    }
  }
  ///////////////////////////////////////////////////////////////////////////////////////
  const viewConfirmPassword = () => {
    let isValid = true;
    if (Object.keys(loginId).length === 0) {
      setLoginIdValidationTheme('selectFormError');
      setLoginIdErrMsg(t('modules.Generic.errorMsg.mandatory'));
      isValid = false;
    }    
    if(newPassword === ""){
      setNewPasswordValidationTheme('formError')
      setNewPasswordErrMsg(t('modules.Generic.errorMsg.mandatory'))
      isValid = false;
    }
    if(confirmPassword === "" ){
      setConfirmPasswordValidationTheme('formError')
      setConfirmPasswordErrMsg(t('modules.Generic.errorMsg.mandatory'))
      isValid = false;
    }if(confirmPassword != newPassword){
      setConfirmPasswordValidationTheme('formError')
      setConfirmPasswordErrMsg(t('modules.Generic.errorMsg.passwordMismatch'))
      isValid = false;
    }  
    if(loginIdErrMsg != '' || newPasswordErrMsg != '' || confirmPasswordErrMsg != ''){
      isValid = false;
    }

    if (!isValid){
      return;
    }else{
      setShowResetPasswordDiv(false)
      setShowConfirmDiv(true)
    }
  }
  /////////////////////////////////////////////////////////////////////////////////////
  const resetAll = () => {
    setLoginId({})
    setLoginIdErrMsg('')
    setLoginIdValidationTheme('selectForm')
  
    setNewPasswordId('')
    setNewPasswordErrMsg('')
    setNewPasswordValidationTheme('form')
  
    setConfirmPassword('')
    setConfirmPasswordErrMsg('')
    setConfirmPasswordValidationTheme('form')
  
    setAcctPassword('')
    setAcctPasswordErrMsg('')
    setAcctPasswordValidationTheme('form')

    setShowResetPasswordDiv(true)
    setShowConfirmDiv(false)
  }


  const modPermission = (permission & 2) == 2  
  return (
    <>
      {permission == 0 && (<TssSpinner isLoading={true} />)}
      {permission != 0 && (
      <ResetPasswordView  ShowResetPasswordDiv = {showResetPasswordDiv}
	                  ShowConfirmDiv = {showConfirmDiv}
	  		  ShowConfirmPassword = {viewConfirmPassword}
                          NewLoginId = {changeLoginId}
                          LoginIdValidationTheme = {loginIdValidationTheme}
                          LoginIdErrMsg = {loginIdErrMsg}
                          NewPassword = {changeNewPassword}
                          NewPasswordValidationTheme = {newPasswordValidationTheme}
                          NewPasswordErrMsg = {newPasswordErrMsg}
                          NewConfirmPassword = {changeConfirmPassword}
                          ConfirmPasswordValidationTheme = {confirmPasswordValidationTheme}
                          ConfirmPasswordErrMsg = {confirmPasswordErrMsg}
                          NewAcctPassword = {changeAcctPassword}
                          AcctPasswordValidationTheme = {acctPasswordValidationTheme}
                          AcctPasswordErrMsg = {acctPasswordErrMsg}
                          AccountList = {accountList}
                          ResetPassword = {resetPassword}
			  ModPermission = {modPermission}
       />	
      )}  
    </>
  )
}

export default ResetPasswordMain
