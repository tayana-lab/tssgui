import React, {useState, useEffect, useRef} from 'react'
import { useTranslation } from 'react-i18next';
import tssguiConf from '@app/modules/conf/TssGui.json';
import TssTextBox from '@app/modules/common/default/components/TssTextBox';
import TssInputGroup from '@app/modules/common/default/components/TssInputGroup';
import TssButton from '@app/modules/common/default/components/TssButton';
import TssModal from '@app/modules/common/default/components/TssModal';
import TssSpinner from '@app/modules/common/default/components/TssSpinner'
import Log from '@app/modules/common/default/components/TssGUILog'
import {confirmAction,showToast} from '@app/modules/common/default/components/TssFunction';
import {chkName, chkMail , chkMobileNum} from '@app/modules/common/default/js/validate.js';
import OtpInput from 'react-otp-input';

const minAccountNameLen    = tssguiConf.MIN_ACNT_NAME_LENGTH;
const maxAccountNameLen    = tssguiConf.MAX_ACNT_NAME_LENGTH;
const cc		   = tssguiConf.COUNTRY_CODE
const msidnLen		   = tssguiConf.MSISDN_LEN
const url 		   = tssguiConf.SERVER_JS_API_URI;
let clientId,clientIp, sessionId, serverIp, clientName, productId, userName, tenantCode;

const AccountDetails = () =>
{
  const [t]                             = useTranslation();
  const [accountName, setAccountName]   = useState('')
  const [accountNameErrMsg, setAccountNameErrMsg] = useState('')
  const [accountNameValidationTheme, setAccountNameValidationTheme] = useState('form')

  const [designation, setDesignation] = useState('')
  const [designationErrMsg, setDesignationErrMsg] = useState('')
  const [designationValidationTheme, setDesignationValidationTheme] = useState('form')

  const [empId, setEmpId] = useState('')

  const [dept, setDept] = useState('')
  const [deptErrMsg, setDeptErrMsg] = useState('')
  const [deptValidationTheme, setDeptValidationTheme] = useState('form')

  const [mailId, setMailId] = useState('')
  const [mailIdErrMsg, setMailIdErrMsg] = useState('')
  const [mailIdValidationTheme, setMailIdValidationTheme] = useState('form')

  const [mobileNum, setMobileNum] = useState('')
  const [mobileNumErrMsg, setMobileNumErrMsg] = useState('')
  const [mobileNumValidationTheme, setMobileNumValidationTheme] = useState('form')

  const [loading, setLoading]           = useState(false)
  const toastifyRef                     = useRef();

  const [mfaQrCode, setMfaQrCode]       = useState('')
  const [mfaOtp, setMfaOtp]             = useState('')
  const [mfaOtpErrMsg, setMfaOtpErrMsg] = useState('')
  const [mfaSecret, setMfaSecret]       = useState('')
  const [mfaEnabled, setMfaEnabled]     = useState(false)
  /////////////////////////////////////////////////////////
  useEffect(() => {
         clientId   = localStorage.getItem("acctID");
         clientIp   = localStorage.getItem("clientIP");
         sessionId  = localStorage.getItem("sessionID");
         serverIp   = localStorage.getItem("serverIP");
         clientName = localStorage.getItem("acctName")
	 userName   = localStorage.getItem("username");
	 tenantCode = localStorage.getItem("tenantCode");
         productId  = parseInt(localStorage.getItem("productID"),10)
  },[]);

  useEffect(() => {
    const getAccountDetails = async () => {
        try {
            const response = await fetch(`${url}/tssgui/get/all/profile/details?accountId=${clientId}&userName=${userName}&tenantCode=${tenantCode}`);
            if (!response.ok) {
                throw new Error(`"Error fetching data ": ${response.status} ${response.statusText}`);
            }
            const data = await response.json();
            Log('Profile-AccountDetails', 'INFO', 'Data fetched successfully : '+JSON.stringify(data));
            setEmpId(data.employeeId);
            setAccountName(data.displayName);
            setDesignation(data.designation == '-' ? '' : data.designation);
            setDept(data.department == '-' ? '' : data.department);
            setMobileNum(data.mobileNum === '-' || data.mobileNum === '' ? '' : data.mobileNum.substring(cc.length).trim() );
            setMailId(data.mailId == '-' ? '' : data.mailId);
            setMfaEnabled(data.mfaEnabled === true || data.mfaEnabled === 1 || data.mfaEnabled === '1');
        } catch (error) {
            Log('Profile-AccountDetails', 'ERROR', 'Error fetching data : '+error);
        }
    };
    getAccountDetails();	  
  }, [clientId]);
  //////////////////////////////////////////////////////////
	
  const validateAccountName = (event) => {
        setAccountName(event.target.value)
        var RE1 =  /^[a-zA-Z0-9]/i;
        var RE2=/^[a-zA-Z][a-zA-Z0-9\_\.\s\@\-]+$/;

        if ((event.target.value =="") || (event.target.value == null)) {
            setAccountNameValidationTheme("formError");
            setAccountNameErrMsg(t("modules.Generic.errorMsg.mandatory"))
        }
        else if(!RE1.test(event.target.value)) {
            setAccountNameValidationTheme("formError");
            setAccountNameErrMsg(t("modules.Generic.errorMsg.startWithAlphaNumeric"))
        }
        else if (event.target.value.length < minAccountNameLen) {
            setAccountNameValidationTheme("formError");
            setAccountNameErrMsg(t("modules.Generic.errorMsg.minChar", { minChar: minAccountNameLen }))
        }
        else if (event.target.value.length > maxAccountNameLen) {
            setAccountNameValidationTheme("formError");
            setAccountNameErrMsg(t("modules.Generic.errorMsg.maxnChar", { maxChar: maxAccountNameLen }))
        }
        else if(!RE2.test(event.target.value)) {
            setAccountNameValidationTheme("formError");
            setAccountNameErrMsg(t("modules.Generic.errorMsg.unsupportedChar"))
        }
        else{
            setAccountNameValidationTheme("formHover");
            setAccountNameErrMsg('')
        }
  }
  //////////////////////////////////////////////////////////
  const validateDesignation = (event) => {

        setDesignation(event.target.value)
        const elementVal = event.target.value;
        const minLen = 0;
        const maxLen = 50;
        const errorMessage = chkName(elementVal, minLen, maxLen, '0', t);
    
        if (errorMessage) {
            setDesignationValidationTheme('formError');
            setDesignationErrMsg(errorMessage);
        } else {
            setDesignationValidationTheme('formHover');
            setDesignationErrMsg('')
        }
 	if (elementVal.length < minLen || elementVal.length > maxLen) {
	    setDesignationValidationTheme("formError");
            setDesignationErrMsg(t("modules.Generic.errorMsg.minLenmaxLen", { minLen:minLen , maxLen:maxLen }));
        }
	
  }
  //////////////////////////////////////////////////////////
  const validateDepartment = (event) => {
        setDept(event.target.value);

        const elementVal = event.target.value;
        const minLen = 0;
        const maxLen = 50;

        const errorMessage = chkName(elementVal, minLen, maxLen, '0', t);

        if (errorMessage) {
            setDeptValidationTheme('formError');
            setDeptErrMsg(errorMessage);
        } else {
            setDeptValidationTheme('formHover');
            setDeptErrMsg('')
        }
  };
  //////////////////////////////////////////////////////////
  const populateEmpId = (event) => {
        setEmpId(event.target.value)
  }
  //////////////////////////////////////////////////////////
  const validateMailId = (event) => {
        setMailId(event.target.value);
        const elementVal = event.target.value;

        const errorMessage = chkMail(elementVal,'0',t);

        if (errorMessage) {
            setMailIdValidationTheme('formError');
            setMailIdErrMsg(errorMessage);
        } else {
            setMailIdValidationTheme('formHover');
            setMailIdErrMsg('')
        }
  }
  /////////////////////////////////////////////////////////
  const validateMobileNum = (event) => {
        setMobileNum(event.target.value)

        const elementVal  = event.target.value
        const len = msidnLen
        const flag = '1'

        const errorMessage = chkMobileNum(elementVal,'0',len,flag,t)
        if (errorMessage) {
            setMobileNumValidationTheme('formError');
            setMobileNumErrMsg(errorMessage);
        } else {
            setMobileNumValidationTheme('formHover');
            setMobileNumErrMsg('')
        }

  }
  /////////////////////////////////////////////////////////
  const accountNameProp = {
       type      :'text',
       minLength : minAccountNameLen,
       maxLength : maxAccountNameLen,
       onChange  : validateAccountName,
       value     : accountName
  }

  const designationProp = {
       type      :'text',
       maxLength : 50,
       onChange  : validateDesignation,
       value     : designation
  }

  const empIdProp = {
       type      :'text',
       onChange  : populateEmpId,
       value     : empId
  }

  const deptProp = {
       type      :'text',
       maxLength : 50,
       onChange  : validateDepartment,
       value     : dept
  }

  const mailIdProp = {
       type      :'text',
       maxLength : 100,
       onChange  : validateMailId,
       value     : mailId
  } 
  const mobileNumProp = {
       maxLength : msidnLen,
       onChange  : validateMobileNum,
       value     : mobileNum
  }
  /////////////////////////////////////////////////////////
  const countryCode =[
       <input type="text" value={`+${cc}`}/>
  ]
  const mobileNumInput = [
       <div style={{position:"relative",width:"98%"}}>
         <TssTextBox  placeholderName={t("modules.profile.accountDetails.placeholder.mobileNum")} validation={mobileNumValidationTheme}  tooltipMessage={mobileNumErrMsg} label={t("modules.profile.accountDetails.label.mobileNum")} properties={mobileNumProp} />
       </div>
  ]

  /////////////////////////////////////////////////////////
  const openMfaModal = async () => {
    setMfaOtp('')
    setMfaOtpErrMsg('')
    setMfaQrCode('')
    setMfaSecret('')
    window.$ && window.$('#mfaModal').modal('show');
    try {
      const response = await fetch(`${url}/tssgui/mfa/qrUrl?clientName=${encodeURIComponent(userName)}&mfaSecret=${encodeURIComponent(clientId)}`, {
        headers: { 'tssgui-tenant-code': tenantCode }
      });
      if (response.ok) {
        const data = await response.json();
        const qrData = data.qrUrl || data.url || data.qrCode || '';
        setMfaSecret(data.mfaSecret || '');
        setMfaQrCode(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}`);
      } else {
        const err = await response.json();
        setMfaOtpErrMsg(err.errorDescription || 'Failed to load QR code. Please try again.');
      }
    } catch (error) {
      Log('Profile-AccountDetails', 'ERROR', 'Error fetching MFA QR URL: ' + error);
    }
  }

  const verifyAndEnableMfa = async () => {
    if (mfaOtp.length !== 6) {
      setMfaOtpErrMsg('Please enter the complete 6-digit code');
      return;
    }
    try {
      const response = await fetch(`${url}/tssgui/mfa/enable`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'tssgui-tenant-code': tenantCode },
        body: JSON.stringify({ clientName: userName, mfaSecret: mfaSecret, otp: mfaOtp })
      });
      if (response.ok) {
        const data = await response.json();
        window.$ && window.$('#mfaModal').modal('hide');
        setMfaEnabled(true);
        showToast('success', data.response);
      } else {
        const err = await response.json();
        setMfaOtpErrMsg(err.errorDescription || 'Invalid code. Please try again.');
      }
    } catch (error) {
      Log('Profile-AccountDetails', 'ERROR', 'Error verifying MFA: ' + error);
    }
  }

  /////////////////////////////////////////////////////////
  const modifyAccountDetails = async () => {
        if(accountNameErrMsg != "" || designationErrMsg != "" || deptErrMsg != ""  ||
           mailIdErrMsg != "" || mobileNumErrMsg != "")
        {
        }
	else
	{
	 const isConfirmed = await confirmAction(t("modules.Generic.cfrmMsg.modify"));
	 if(isConfirmed) {
           try {
              const requestBody = {  
		 "displayName": accountName,
                 "designation": designation,
                 "department":  dept, 
                 "mobileNum": mobileNum!=""? cc+""+mobileNum : "",  
                 "mailId": mailId,  
                 "accountName": userName,
                 "accountId": clientId,
		 "employeeId": empId
               }
              setLoading(true);
              const response = await fetch(`${url}/tssgui/modify/profileDetails?tenantCode=${tenantCode}`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
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
 
	      setLoading(false);
 	    }
	    catch (error) {
               Log('Profile-AccountDetails','Exception','URL : '+`${url}/tssgui/modify/profileDetails?tenantCode=${tenantCode}`+`,Error modifying profile details. ${error}`);
	       setLoading(false);
            }
           }
  	 }
  };
  /////////////////////////////////////////////////////////
  return (
  <>
  {loading && (<TssSpinner isLoading={loading} />)}
  {!loading &&(	  
  <>
   {/* <section className="content">
    <div className="container-fluid">
     <div class="card"> 
      <div class="card-body align-items-center py-8">*/}
      <div className="align-items-center p-4">
       <div className="d-flex justify-content-end mb-2">
        <button id="enableMfaButton" type="button" className="btn btn-warning text-white" style={{borderRadius:'10px'}} onClick={openMfaModal} disabled={mfaEnabled}><i className="fas fa-shield-alt" style={{marginRight:'8px'}}></i>Enable MFA</button>
       </div>
       <div className="row">
        <div align="left" className="form-group col-md-4">
         <TssTextBox placeholderName={t("modules.profile.accountDetails.placeholder.name")} validation={accountNameValidationTheme} tooltipMessage={accountNameErrMsg}  label={t("modules.profile.accountDetails.label.name")} mandatory="true" inputInfo=""  properties={accountNameProp} />
        </div>
        <div align="left" className="form-group col-md-4">
         <TssTextBox placeholderName={t("modules.profile.accountDetails.placeholder.designation")} validation={designationValidationTheme} tooltipMessage={designationErrMsg}  label={t("modules.profile.accountDetails.label.designation")} properties={designationProp} />
        </div>
        <div align="left" className="form-group col-md-4">
         <TssTextBox  label={t("modules.profile.accountDetails.label.employeeId")} mandatory="true" properties={empIdProp} disabled={true} />
        </div>
       </div>
       <div className="row">
        <div align="left" className="form-group col-md-4">
         <TssTextBox placeholderName={t("modules.profile.accountDetails.placeholder.dept")} validation={deptValidationTheme} tooltipMessage={deptErrMsg}  label={t("modules.profile.accountDetails.label.dept")} inputInfo=""  properties={deptProp} />
        </div>
        <div align="left" className="form-group col-md-4">
         <TssTextBox placeholderName={t("modules.profile.accountDetails.placeholder.mailId")} validation={mailIdValidationTheme} tooltipMessage={mailIdErrMsg}  label={t("modules.profile.accountDetails.label.mailId")}  properties={mailIdProp} />
        </div>
        <div align="left" className="form-group col-md-4">
	  <TssInputGroup  mandatory={false} prependElements={countryCode} inputElement={mobileNumInput}/>
        </div>
       </div>
       <div className='row mt-3'>
        <div className='form-group col-md-12 d-flex justify-content-end tss-pull-right'>
         <TssButton  id="modifyButton" type="button" label={t("modules.Generic.buttons.label.modify")} onClick={modifyAccountDetails} />
        </div>
       </div>
       </div>
      {/* </div>
     </div>
    </div>
   </section> */}
  </>	    
  )}

  <TssModal
    modalId="mfaModal"
    modalBodyId="mfaModalBody"
    modalHeaderId="mfaModalHeader"
    header="Enable Multi-Factor Authentication"
    className="modal-md"
    style={{maxWidth:'420px'}}
    footer={
      <>
        <TssButton
          id="mfaCancelButton"
          type="button"
          label="Cancel"
          btnProps={{ 'data-bs-dismiss': 'modal' }}
          onClick={() => window.$ && window.$('#mfaModal').modal('hide')}
          iconSupport={false}
        />
        <TssButton
          id="mfaVerifyButton"
          type="button"
          label="Verify & Enable"
          onClick={verifyAndEnableMfa}
        />
      </>
    }
  >
    <>
        <p className="text-center mb-3">Scan this QR code using your authenticator app</p>
        <div className="d-flex justify-content-center mb-3">
          {mfaQrCode && (
            <img
              src={mfaQrCode}
              alt="MFA QR Code"
              style={{ width: '180px', height: '180px', border: '2px solid #ced4da', borderRadius: '8px', padding: '8px' }}
            />
          )}
        </div>
        <p className="text-center mb-2">Enter the 6-digit code to confirm setup</p>
        <div className="d-flex justify-content-center mb-1">
          <OtpInput
            value={mfaOtp}
            onChange={(val) => { setMfaOtp(val); setMfaOtpErrMsg(''); }}
            numInputs={6}
            renderInput={(props) => (
              <input
                {...props}
                type="password"
                style={{
                  width: '40px',
                  height: '40px',
                  margin: '0 5px',
                  fontSize: '18px',
                  textAlign: 'center',
                  border: '1px solid #ced4da',
                  borderRadius: '4px',
                  outline: 'none'
                }}
              />
            )}
          />
        </div>
        {mfaOtpErrMsg && (
          <p className="text-center text-danger mt-1" style={{fontSize:'13px'}}>{mfaOtpErrMsg}</p>
        )}
      </>
  </TssModal>
  </>
 )
}

export default AccountDetails
