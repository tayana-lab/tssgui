import React,{useState, useEffect} from 'react'
import TssTextBox from '@app/modules/common/default/components/TssTextBox';
import TssButton from '@app/modules/common/default/components/TssButton';
import {confirmAction,showToast} from '@app/modules/common/default/components/TssFunction';
import {checkPasswordValidation} from '@app/modules/common/default/js/validate.js';
import { useTranslation } from 'react-i18next';
import conf from '@modules/conf/TssGui.json'

const maxPwd= conf.MAX_PWD_LENGTH
const minPwd= conf.MIN_PWD_LENGTH
const passValdn= conf.PWD_COMPLEXITY
const url = conf.SERVER_JS_API_URI;
let clientID, clientIP, sessionID, clientName, userName, productId, tenantCode;

const ChangePassword = () => {

    const [t]= useTranslation();
    //////////////////////////////////////////////////////////////////////////
    useEffect(() => {
        clientID = localStorage.getItem("acctID");
        clientIP = localStorage.getItem("clientIP");
        sessionID = localStorage.getItem("sessionID");
        clientName = localStorage.getItem("acctName");
        userName = localStorage.getItem("username");
	tenantCode = localStorage.getItem("tenantCode");
        productId = parseInt(localStorage.getItem("productID"),10);
    },[]);

    ///////////////////////////////////////////////////////////////////////////////////////////
    const [oldPassword, setOldPassword] = useState('')
    const [oldPasswordValTheme, setOldPasswordValTheme] = useState('form')
    const [oldPasswordErrMsg, setOldPasswordErrMsg] = useState('')

    const [newPassword, setNewPassword] = useState('')
    const [newPasswordValTheme, setNewPasswordValTheme] = useState('form')
    const [newPasswordErrMsg, setNewPasswordErrMsg] = useState('')

    const [confirmPassword, setConfirmPassword] = useState('')
    const [confirmPasswordValTheme, setConfirmPasswordValTheme] = useState('form')
    const [confirmPasswordErrMsg, setConfirmPasswordErrMsg] = useState('')

    
    ////////////////////////////////////////////////////////////////////////////////////////////
    const handleOldPasswordChange = (event) => {
        setOldPassword(event.target.value)
        const oldPWError = validateOldPassword(event.target.value);
        if(oldPWError) {
            setOldPasswordErrMsg(oldPWError)
            setOldPasswordValTheme('formError')
        }
        else{
            setOldPasswordErrMsg('')
            setOldPasswordValTheme('formHover')
        }
    }
    //////////////////////////////////////////////////
    const handleNewPasswordChange = (event) => {
        setNewPassword(event.target.value)
        const newPWError = checkPasswordValidation(event.target.value,oldPassword,passValdn,minPwd,maxPwd,t)
        if(newPWError) {
            setNewPasswordErrMsg(newPWError)
            setNewPasswordValTheme('formError')
        }
        else{
            setNewPasswordErrMsg('')
            setNewPasswordValTheme('formHover')
        }
    }
    //////////////////////////////////////////////////
    const handleConfirmPasswordChange = (event) => {
        setConfirmPassword(event.target.value)
        const confirmPWError = validateConfirmPassword(event.target.value);
        if(confirmPWError) {
            setConfirmPasswordErrMsg(confirmPWError)
            setConfirmPasswordValTheme('formError')
        }
        else{
            setConfirmPasswordErrMsg('')
            setConfirmPasswordValTheme('formHover')
        }
    }
    /////////////////////////////////////////////////////////////////////////////////////////////
    const validateOldPassword = (oldPW) => {
        if (oldPW == null || oldPW == "") {
            return t('modules.Generic.errorMsg.mandatory')
        }
        return null;
    }
    ////////////////////////////////////////////////////
    const validateConfirmPassword = (confirmPW) =>  {
        if (confirmPW == null || confirmPW == "") {
            return t('modules.Generic.errorMsg.mandatory')
        }
        if (confirmPW != newPassword) {
            return t('modules.Generic.errorMsg.passwordMismatch')
        }
        return null;
    }  
    /////////////////////////////////////////////////////////////////////////////////////////////
    const resetAll = () => {
        setOldPassword('')
        setOldPasswordErrMsg('')
        setOldPasswordValTheme('form')
        setNewPassword('')
        setNewPasswordErrMsg('')
        setNewPasswordValTheme('form')
        setConfirmPassword('')
        setConfirmPasswordErrMsg('')
        setConfirmPasswordValTheme('form')
    }

    /////////////////////////////////////////////////////////////////////////////////////////////
    const oldPasswordProp = {
        type : "password",
        maxLength : maxPwd,
        onChange : handleOldPasswordChange,
        value : oldPassword
    }

    const newPasswordProp = {
        type : "password",
        maxLength : maxPwd,
        onChange : handleNewPasswordChange,
        value : newPassword
    }
  
    const confirmPasswordProp = {
        type : "password",
        maxLength : maxPwd,
        onChange : handleConfirmPasswordChange,
        value : confirmPassword
    }

    /////////////////////////////////////////////////////////////////////////////////////////
    const changePassword = async() => {
        let isValid = true;
        if (oldPassword === "") {
            setOldPasswordErrMsg(t('modules.Generic.errorMsg.mandatory'))
            setOldPasswordValTheme('formError')
            isValid = false;
        }

        if(newPassword === ""){
            setNewPasswordErrMsg(t('modules.Generic.errorMsg.mandatory'))
            setNewPasswordValTheme('formError')
            isValid = false;
        }

        if(confirmPassword === "" ){
            setConfirmPasswordErrMsg(t('modules.Generic.errorMsg.mandatory'))
            setConfirmPasswordValTheme('formError')
            isValid = false;
        }
        if(confirmPassword !== newPassword ){
            setConfirmPasswordErrMsg(t('modules.Generic.errorMsg.passwordMismatch'))
            setConfirmPasswordValTheme('formError')
            isValid = false;
        }

        if(oldPasswordValTheme =='formError' || newPasswordValTheme == 'formError' || confirmPasswordValTheme=='formError'){
            isValid = false;
        }

        if (!isValid){
            return;
        }
        else{
            const isConfirmed = await confirmAction(t("modules.Generic.cfrmMsg.modify"));
            if(isConfirmed){
                const requestBody = {
                    "clientId": clientID,
		    "accountId": clientID,
                    "oldPassword": oldPassword,
                    "newPassword":newPassword,
                }
                const response = await fetch(`${url}/tssgui/changePassword?tenantCode=${tenantCode}`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestBody),
                });
                
               if (response.ok) {
    const data = await response.json();
    showToast('success', data.response);
    resetAll();
} else {
    const err = await response.json();
    showToast('error', err.errorDescription || 'Something went wrong');
} 
            }
        }
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    return (
    <>
        <div className = "align-items-center p-4" style={{height:"259px"}}>
            <div className="row">
                <div className='form-group col-md-4'>
                    <TssTextBox label={t("modules.profile.changePassword.label.curPsswd")} properties={oldPasswordProp} validation={oldPasswordValTheme} tooltipMessage={oldPasswordErrMsg} placeholderName={t("modules.profile.changePassword.placeholder.curPsswd")} mandatory={true}/> 
                </div>
                <div className='form-group col-md-4'>
                    <TssTextBox label={t("modules.profile.changePassword.label.newPsswd")} properties={newPasswordProp} validation={newPasswordValTheme} tooltipMessage={newPasswordErrMsg} placeholderName={t("modules.profile.changePassword.placeholder.newPsswd")} mandatory={true}/>	        
                </div>
                <div className='form-group col-md-4'>
                    <TssTextBox label={t("modules.profile.changePassword.label.cnfrmPsswd")} properties={confirmPasswordProp} validation={confirmPasswordValTheme} tooltipMessage={confirmPasswordErrMsg} placeholderName={t("modules.profile.changePassword.placeholder.cnfrmPsswd")} mandatory={true}/>	        
                </div>
            </div>
            <div className='row'>
                <div className='form-group col-md-12 d-flex justify-content-end tss-pull-right mt-3'>
                    <TssButton  id="modifyButton" type="button" label={t('modules.Generic.buttons.label.modify')}onClick={changePassword} />
                </div>
            </div>
        </div>
    </>
  )
}

export default ChangePassword
