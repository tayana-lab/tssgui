import React, { useEffect, useState, useCallback  } from 'react'
import ContentHeader from '@app/modules/common/default/components/TssContentHeader';
import AccountsConfirmPwd  from '@modules/admin/AccountsConfirmPwd';
import AccountsCreate from '@modules/admin/AccountsCreate';
import AccountsCount from '@app/modules/admin/AccountsCount';
import AccountsView from '@app/modules/admin/AccountsView';
import AccountsModify from '@app/modules/admin/AccountsModify';
import {confirmAction,infoAlert,showToast} from '@app/modules/common/default/components/TssFunction';
import {chkName, chkMail , chkMobileNum} from '@app/modules/common/default/js/validate.js';
import { useLogout } from '@app/modules/common/default/utils/oidc-providers';
import TssSpinner from '@app/modules/common/default/components/TssSpinner';
import conf from '@modules/conf/TssGui.json'
import encryptPayload from '@app/modules/common/default/js/encryptPayload.js';
import { useTranslation } from 'react-i18next';
import Log from '@app/modules/common/default/components/TssGUILog'



const url = conf.SERVER_JS_API_URI;

let clientID, clientIP, sessionID, clientName, userName, productId;
 
const ldapSupport = conf.LDAP_SUPPORT
const minPwd= conf.MIN_PWD_LENGTH
const maxPwd=conf.MAX_PWD_LENGTH
const minActNameLen= conf.MIN_ACNT_NAME_LENGTH
const maxActNameLen= conf.MAX_ACNT_NAME_LENGTH
const cc= conf.COUNTRY_CODE
const msidnLen= conf.MSISDN_LEN

var access = ""
var allProductIdsZero = false;
var modulePermission = -1
const AccountsMain = () => {
    const [t]= useTranslation();
    const logOut = useLogout();
    const moduleId = 1100

    const [permission, setPermission] = useState(0)
    const [showAccountsConfirmPwdPage , setShowAccountsConfirmPwdPage] = useState(false);
    const [showAccountsCreatePage , setShowAccountsCreatePage] = useState(false);
    const [showAccountsViewPage, setShowAccountsViewPage] = useState(true);
    const [showAccountsModifyPage, setShowAccountsModifyPage] = useState(false);
    const [productsList, setProductsList] = useState([])
    const [accountTypesList, setAccountTypesList] = useState([])
    const [statusCountList, setStatusCountList] = useState([]) 
    const [languagesList, setLanguagesList] = useState([])

    const [acctPassword, setAcctPassword] = useState('')
    const [validationTheme, setValidationTheme] = useState('form')
    const [tooltipMessage, setTooltipMessage] = useState('')

    const [loginId, setLoginId] = useState('')
    const [loginIdErrMsg, setLoginIdErrMsg] = useState('')
    const [loginIdValidationTheme, setLoginIdValidationTheme] = useState('form')

    const [password, setPassword] = useState('')
    const [passwordErrMsg, setPasswordErrMsg] = useState('')
    const [passwordValidationTheme, setPasswordValidationTheme] = useState('form')

    const [confirmPassword, setConfirmPassword] = useState('')
    const [confirmPasswordErrMsg, setConfirmPasswordErrMsg] = useState('')
    const [confirmPasswordValidationTheme, setConfirmPasswordValidationTheme] = useState('form')

    const [employeeId, setEmployeeId] = useState('')
    const [employeeIdErrMsg, setEmployeeIdErrMsg] = useState('')
    const [employeeIdValidationTheme, setEmployeeIdValidationTheme] = useState('form')

    const [accountExpiry, setAccountExpiry ] = useState('')

    const [accountStatus, setAccountStatus] = useState('0')
    const [accountStatusObject, setAccountStatusObject] = useState({ value: '0', label: 'Active' })
 
    const [name, setName] = useState('')
    const [nameErrMsg , setNameErrMsg] = useState('')
    const [nameValidationTheme, setNameValidationTheme]  = useState('form')

    const [designation, setDesignation] = useState('')
    const [designationErrMsg , setDesignationErrMsg] = useState('')
    const [designationValidationTheme, setDesignationValidationTheme]  = useState('form')

    const [department, setDepartment] = useState('')
    const [departmentErrMsg , setDepartmentErrMsg] = useState('')
    const [departmentValidationTheme, setDepartmentValidationTheme]  = useState('form')

    const [mailId, setMailId] = useState('')
    const [mailIdErrMsg , setMailIdErrMsg] = useState('')
    const [mailIdValidationTheme, setMailIdValidationTheme]  = useState('form')

    const [mobile, setMobile] = useState('')
    const [mobileErrMsg , setMobileErrMsg] = useState('')
    const [mobileValidationTheme, setMobileValidationTheme]  = useState('form')

    const [language, setLanguage] = useState({})

    const [LDAPUser, setLDAPUser] = useState(false)
    
    const [openModal, setOpenModal] = useState(false)
    const [selectedAccountTypes, setSelectedAccountTypes] = useState({});

    const [noAccessOption, setNoAccessOption] = useState({value: '0', label:t("modules.Accounts.accountAddAndModify.label.noAccessOption"), productId:'0'})
    const [loading, setLoading] = useState(true)
    

    const [filterProduct , setFilterProduct] = useState({})
    const [filterAccountType, setFilterAccountType] = useState({})
    const [filterAccountStatus, setFilterAccountStatus] = useState({value:'0', label:'Active'})
    const [isInitialized, setIsInitialized] = useState(false);
    const [filteredAccounts, setFilteredAccounts] = useState([])
    const [filteredAccountsInModal, setFilteredAccountsInModal] = useState([])
    const [showFilteredAccountsTable, setShowFilteredAccountsTable] = useState(true)

    const [mLoginId, setmLoginId] = useState('')
    const [mAccountId, setmAccountId] = useState('')

    const [mEmployeeId, setmEmployeeId] = useState('')
    const [mEmployeeIdErrMsg, setmEmployeeIdErrMsg] = useState('')
    const [mEmployeeIdValidationTheme, setmEmployeeIdValidationTheme] = useState('form')

    const [mAccountExpiry, setmAccountExpiry ] = useState('')

    const [mAccountStatus, setmAccountStatus] = useState('0')
    const [mAccountStatusObject, setmAccountStatusObject] = useState({ value: '0', label: 'Active' })
 
    const [mName, setmName] = useState('')
    const [mNameErrMsg , setmNameErrMsg] = useState('')
    const [mNameValidationTheme, setmNameValidationTheme]  = useState('form')

    const [mDesignation, setmDesignation] = useState('')
    const [mDesignationErrMsg , setmDesignationErrMsg] = useState('')
    const [mDesignationValidationTheme, setmDesignationValidationTheme]  = useState('form')

    const [mDepartment, setmDepartment] = useState('')
    const [mDepartmentErrMsg , setmDepartmentErrMsg] = useState('')
    const [mDepartmentValidationTheme, setmDepartmentValidationTheme]  = useState('form')

    const [mMailId, setmMailId] = useState('')
    const [mMailIdErrMsg , setmMailIdErrMsg] = useState('')
    const [mMailIdValidationTheme, setmMailIdValidationTheme]  = useState('form')

    const [mMobile, setmMobile] = useState('')
    const [mMobileErrMsg , setmMobileErrMsg] = useState('')
    const [mMobileValidationTheme, setmMobileValidationTheme]  = useState('form')

    const [mLanguageVal, setmLanguageVal] = useState('')
    const [mLanguage, setmLanguage] = useState({})

    const [mLDAPUser, setmLDAPUser] = useState(false)
    const [mLevel, setmLevel] = useState()


    const [deleteValidationTheme, setDeleteValidationTheme] = useState('form')
    const [deleteTooltipMessage, setDeleteTooltipMessage] = useState('')

    const [showSearchButton, setShowSearchButton] = useState(false)
    const [accountTypesBasedOnProduct, setAccountTypesBasedOnProduct] = useState([])
    const [levelOfLoggedInUser, setLevelOfLoggedInUser] = useState('');
    const [accountToBeDeleted, setAccountToBeDeleted] = useState('')
    const [accountIdToBeDeleted, setAccountIdToBeDeleted] = useState('')
    const [deletePassword, setDeletePassword] = useState('')  
    const [openModifyModal, setOpenModifyModal] = useState(false)

    const AccountDetails = {
        loginId,
        password,
        confirmPassword,
        employeeId,
        accountExpiry,
        accountStatus,
        name,
        designation,
        department,
        mailId,
        mobile,
        language,
        LDAPUser
    };

    const modAccountDetails = {
        mAccountId,
        mLoginId,
        mEmployeeId,
        mAccountExpiry,
        mAccountStatus,
        mName,
        mDesignation,
        mDepartment,
        mMailId,
        mMobile,
        mLanguageVal,
        mLDAPUser,        
    };

    //////////////////////////////////////////////////////////////////////////
    useEffect(() => {
        clientID = localStorage.getItem("acctID");
        clientIP = localStorage.getItem("clientIP");
        sessionID = localStorage.getItem("sessionID");
        clientName = localStorage.getItem("acctName");
        userName = localStorage.getItem("username");
        productId = parseInt(localStorage.getItem("productID"),10);
    },[]);
  
    ///////////////////////////////////////////////////////////////////////
    useEffect(() => {
        const fetchData = async () => {
            try {
                const encryptedData = await encryptPayload({ productId, clientId: clientID, moduleId, clientIp: clientIP, sessionId: sessionID, tenantCode: localStorage.getItem("tenantCode") }, conf.encryptionKey);
                const response = await fetch(`${url}/tssgui/checkAccess?key=${encodeURIComponent(encryptedData.encryptedKey)}&data=${encodeURIComponent(encryptedData.encryptedPayload)}&iv=${encodeURIComponent(encryptedData.iv)}`, { headers: { 'tssgui-tenant-code': localStorage.getItem('tenantCode') } });

                if (!response.ok) {
                    throw new Error("Error fetching data ");
                }
                const data = await response.text();
                const responseObject = JSON.parse(data);
                const permission = responseObject.permission;

                if(permission == 0){
                    logOut();
                }
                modulePermission = permission
                setPermission(permission)
                Log('Accounts', 'INFO', 'Data fetched successfully : '+JSON.stringify(data));
            } catch (error) {
                Log('Accounts', 'ERROR', 'Error fetching data : '+error);
            }
        };      
        fetchData();
    }, []);
    
    const addPermission = (modulePermission & 4) != 0
    const modPermission = (modulePermission & 2) == 2
    const delPermission = (modulePermission & 8) == 8
    //////////////////////////////////////////////////////////

    const LoadAccountsCreatePage = async() => {  
            if(acctPassword == "")   {           
                    setValidationTheme("formError");   
                    setTooltipMessage(t('modules.Generic.errorMsg.mandatory'));          
            }
            else{
                try {           
                    const encryptedData = await encryptPayload({ password: acctPassword, accountId: clientID, accountName: userName }, conf.encryptionKey);
                    const response = await fetch(`${url}/tssgui/confirmAccountPassword?key=${encodeURIComponent(encryptedData.encryptedKey)}&data=${encodeURIComponent(encryptedData.encryptedPayload)}&iv=${encodeURIComponent(encryptedData.iv)}`, { headers: { 'tssgui-tenant-code': localStorage.getItem('tenantCode') } }); 
                    if (!response.ok) {
                        throw new Error("Error fetching data ");
                    }
                    const data = await response.json();
                    Log('Accounts', 'INFO', 'Data fetched successfully : '+JSON.stringify(data));
                    if (data.additionalInfo.result == 1){
                        setTooltipMessage('')
                        setValidationTheme('form')
                        setShowAccountsConfirmPwdPage(false);
                        setShowAccountsCreatePage(true);
                    }               
                    else {
                        setValidationTheme("formError");
                        setTooltipMessage(t('modules.Generic.errorMsg.invalidPassword'));
                    }
                } catch (error) {
                    Log('Accounts', 'ERROR', 'Error fetching data : ', error);
                }
           }
    }
    /////////////////////////////////////////////////////////////////
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${url}/tssgui/getAllProducts`, { headers: { 'tssgui-tenant-code': localStorage.getItem('tenantCode') } });
                if (!response.ok) {
                throw new Error("Error fetching data ");
                }
                const data = await response.json();
                setProductsList(data);
                Log('Accounts', 'INFO', 'Data fetched successfully : '+JSON.stringify(data));
            } catch (error) {
                Log('Accounts', 'ERROR', 'Error fetching data : '+error);
            }
        };
        
        fetchData();
    }, []);

    /////////////////////////////////////////////////////////////////////////
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${url}/tssgui/getAllLanguages`, { headers: { 'tssgui-tenant-code': localStorage.getItem('tenantCode') } });
                if (!response.ok) {
                throw new Error("Error fetching data ");
                }
                const data = await response.json();
                setLanguagesList(data);
                Log('Accounts', 'INFO', 'Data fetched successfully : '+JSON.stringify(data));
            } catch (error) {
                Log('Accounts', 'ERROR', 'Error fetching data : '+error);
            }
        };
        
        fetchData();
    }, []);

    /////////////////////////////////////////////////////////////////////////
    useEffect(() => {
        const fetchData = async () => {
            try {
                const encryptedData = await encryptPayload({ productId: -1, acctId: clientID }, conf.encryptionKey);
                const response = await fetch(`${url}/tssgui/getAllAccountTypes?key=${encodeURIComponent(encryptedData.encryptedKey)}&data=${encodeURIComponent(encryptedData.encryptedPayload)}&iv=${encodeURIComponent(encryptedData.iv)}`, { headers: { 'tssgui-tenant-code': localStorage.getItem('tenantCode') } });
                if (!response.ok) {
                throw new Error("Error fetching data ");
                }
                const data = await response.json();
                setAccountTypesList(data);
                Log('Accounts', 'INFO', 'Data fetched successfully : '+JSON.stringify(data));
            } catch (error) {
                Log('Accounts', 'ERROR', 'Error fetching data : '+error);
            }
        };   
        fetchData();
    }, []);

    ////////////////////////////////////////////////////////////////////////

    function parseAccess(str) {
        const parts = str.split('$');
        const result = [];
        
        for (let i = 0; i < parts.length; i += 2) {
        result.push({
            productId: parseInt(parts[i], 10),
            accessType: parseInt(parts[i + 1], 10)
        });
        }
        
        return result;
    }

    const addAccount = async () => {  
        try {
            const requestBody = {  
                 "clientId": parseInt(clientID, 10),
                 "accountName": loginId,
                 "displayName": name ==""?loginId:name,
                 "password": password,
                 "status": parseInt(accountStatus,10),                   
                 "mailId": mailId,
                 "mobileNum":  mobile!=""? cc+""+mobile : "",
                 "accountExpiry": accountExpiry+"T00:00:00",
                 "employeeId": employeeId,
                 "designation": designation,
                 "department": department,
                 "ldapUser": LDAPUser ? 1 : 0,
                 "languageId" : parseInt(language.value,10),
                 "accessDetails": parseAccess(access)
               }

              const encryptedData = await encryptPayload(requestBody, conf.encryptionKey);
              const response = await fetch(`${url}/tssgui/addAccount`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'tssgui-tenant-code': localStorage.getItem('tenantCode'),
                },
                body: JSON.stringify({ key: encryptedData.encryptedKey, data: encryptedData.encryptedPayload, iv: encryptedData.iv }),
              });
              if (!response.ok) {
                Log('Accounts','WARN',t('modules.Generic.alertMsg.add'));
              }
              if(response.ok){        
                const resultString = await response.text();
                const responseObject = JSON.parse(resultString);
                const alerttype = responseObject.additionalInfo.alerttype;
                const disp_msg = responseObject.response;
                if (alerttype == "alert-danger"){
                    showToast('error',disp_msg);                    
                }
                else{
                    showToast('success',disp_msg);
                    reloadFilteredAccounts();
                    reloadStatusCountList();
                    resetAddFeilds();
                    resetSelectedAccountTypes()
                    const modal = document.querySelector("#accountPreviewModal");
                    if (modal) {
                        modal.classList.remove('show');
                        modal.style.display = 'none';
                        const backdrop =document.querySelector('.modal-backdrop');
                        if (backdrop) {
                            backdrop.remove();
                        }
                    }
                }
            }
        }
        catch {
            Log('Accounts', 'WARN', "Error adding account.")
        }
    }
    //////////////////////////////////////////////////////////////////
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${url}/tssgui/getStatusCount?clientId=${clientID}`, { headers: { 'tssgui-tenant-code': localStorage.getItem('tenantCode') } });
                if (!response.ok) {
                throw new Error("Error fetching data ");
                }
                const data = await response.json();
                setStatusCountList(data);
                Log('Accounts', 'INFO', 'Data fetched successfully : '+JSON.stringify(data));
            } catch (error) {
                Log('Accounts', 'ERROR', 'Error fetching data : '+error);
            }
        };   
        fetchData();
    }, []);

    const reloadStatusCountList = async() => {
        try {
            const response = await fetch(`${url}/tssgui/getStatusCount?clientId=${clientID}`, { headers: { 'tssgui-tenant-code': localStorage.getItem('tenantCode') } });
            if (!response.ok) {
            throw new Error("Error fetching data ");
            }
            const data = await response.json();
            setStatusCountList(data);
            Log('Accounts', 'INFO', 'Data fetched successfully : '+JSON.stringify(data));
        } catch (error) {
            Log('Accounts', 'ERROR', 'Error fetching data : ', error);
        }
    }
    
          
    //////////////////////////////////////////////////////////////////

    const exitAdd = () => {
        setShowAccountsConfirmPwdPage(false);
        setAcctPassword('')
    }

    const ConfirmPassword = (event) =>{      
        setAcctPassword(event.target.value); 
        if(event.target.value == ""){
            setValidationTheme('formError')
            setTooltipMessage(t("modules.Generic.errorMsg.mandatory"))
        }
        else if (/^\s|\s$/.test(event.target.value)) {  
            setValidationTheme("formError");
            setTooltipMessage(t("modules.Generic.errorMsg.noSpacesAllowed"));
        }  
        else {
            setValidationTheme('form')
            setTooltipMessage('')
        } 
    }

    ///////////////////////////////////////////////////////////////////
    const validateLoginId = (event) => {
    
        const val = event.target.value;
        setLoginId(val);
        const EMAIL_RE = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const isEmail = val.includes('@');

        if ((val == "") || (val == null)) {
            setLoginIdValidationTheme("formError");
            setLoginIdErrMsg(t("modules.Generic.errorMsg.mandatory"));
        } else if (isEmail) {
            // Validate as email address
            if (!EMAIL_RE.test(val)) {
                setLoginIdValidationTheme("formError");
                setLoginIdErrMsg(t("modules.Generic.errorMsg.invalid"));
            } else if (val.length > maxActNameLen) {
                setLoginIdValidationTheme("formError");
                setLoginIdErrMsg(t("modules.Generic.errorMsg.maxnChar", { maxChar: maxActNameLen }));
            } else {
                setLoginIdValidationTheme("formHover");
                setLoginIdErrMsg('');
            }
        } else {
            // Validate as regular login ID
            var RE1 = /^[a-zA-Z]/i;
            var RE2 = /^[a-zA-Z][a-zA-Z0-9\_\.\s\@\-]+$/;
            if (!RE1.test(val)) {
                setLoginIdValidationTheme("formError");
                setLoginIdErrMsg(t("modules.Generic.errorMsg.startWithAlpha"));
            } else if (val.length < minActNameLen) {
                setLoginIdValidationTheme("formError");
                setLoginIdErrMsg(t("modules.Generic.errorMsg.minChar", { minChar: minActNameLen }));
            } else if (val.length > maxActNameLen) {
                setLoginIdValidationTheme("formError");
                setLoginIdErrMsg(t("modules.Generic.errorMsg.maxnChar", { maxChar: maxActNameLen }));
            } else if (!RE2.test(val)) {
                setLoginIdValidationTheme("formError");
                setLoginIdErrMsg(t("modules.Generic.errorMsg.unsupportedChar"));
            } else {
                setLoginIdValidationTheme("formHover");
                setLoginIdErrMsg('');
            }
        }
    }
    ////////////////////////////////////////////////////////////////////
    const validatePassword = (event) => {
        setPassword(event.target.value);
       
        if((event.target.value == "") || (event.target.value == null)) {
            setPasswordValidationTheme("formError");
            setPasswordErrMsg(t("modules.Generic.errorMsg.mandatory"))
        }   
        else if (/^\s|\s$/.test(event.target.value)) {  
            setPasswordValidationTheme("formError");
            setPasswordErrMsg(t("modules.Generic.errorMsg.noSpacesAllowed"));
        }    
        else if(event.target.value.length < minPwd)  {
            setPasswordValidationTheme("formError");
            setPasswordErrMsg(t("modules.Generic.errorMsg.minChar", { minChar: minPwd }))
        }       
        else if(event.target.value.length > maxPwd)  {
            setPasswordValidationTheme("formError");
            setPasswordErrMsg(t("modules.Generic.errorMsg.maxChar", { maxChar: maxPwd }))
        }       
        else{
            setPasswordValidationTheme("formHover");
            setPasswordErrMsg('')
        }    
    }
    ////////////////////////////////////////////////////////////////
    const validateConfirmPassword = (event) => {
        setConfirmPassword(event.target.value)
        var psswd = password;
        if((event.target.value == "") || (event.target.value == null)) {
            setConfirmPasswordValidationTheme("formError");
            setConfirmPasswordErrMsg(t("modules.Generic.errorMsg.mandatory"))
        }
        else if (/^\s|\s$/.test(event.target.value)) {  
            setConfirmPasswordValidationTheme("formError");
            setConfirmPasswordErrMsg(t("modules.Generic.errorMsg.noSpacesAllowed"));
        }   
        else if(psswd != event.target.value) {
            setConfirmPasswordValidationTheme("formError");
            setConfirmPasswordErrMsg(t("modules.Generic.errorMsg.passwordMismatch"))
        }
        else{
            setConfirmPasswordValidationTheme("formHover");
            setConfirmPasswordErrMsg('')
        }
    }
    /////////////////////////////////////////////////////////////////
    const validateEmployeeId = (event) => {
        setEmployeeId(event.target.value);
        var RE1 = /^[a-zA-Z0-9]/i;
        var RE2=/^[a-zA-Z0-9][a-zA-Z0-9\_\-\s]+$/;

        if((event.target.value == "") || (event.target.value == null)) {
            setEmployeeIdValidationTheme("formError");
            setEmployeeIdErrMsg(t("modules.Generic.errorMsg.mandatory"))
        }

        else if(!RE1.test(event.target.value))   {
            setEmployeeIdValidationTheme("formError");
            setEmployeeIdErrMsg(t("modules.Generic.errorMsg.startWithAlphaNumeric"))
        }

        else if(event.target.value.length < 1) {
            setEmployeeIdValidationTheme("formError");
            setEmployeeIdErrMsg(t("modules.Generic.errorMsg.minChar", { minChar: 1 }))
        }

        else if (event.target.value.length > 50) {
            setEmployeeIdValidationTheme("formError");
            setEmployeeIdErrMsg(t("modules.Generic.errorMsg.maxChar", { maxChar: 50 }))
        }
        else{
            setEmployeeIdValidationTheme("formHover"); 
            setEmployeeIdErrMsg('')
        }
    }
    /////////////////////////////////////////////////////////////////
    useEffect(() => {        
        const today = new Date();
        const fiveYearsFromToday = new Date(today.getFullYear() + 5, today.getMonth(), today.getDate());
        const formattedDate = fiveYearsFromToday.toISOString().split('T')[0];
        setAccountExpiry(formattedDate);
        setmAccountExpiry(formattedDate);
    }, []);
    /////////////////////////////////////////////////////////////////
    const changeAccountExpiry = (event) => {
        //const formattedDate = event.toISOString().split('T')[0];
        setAccountExpiry(event)
    }
    ////////////////////////////////////////////////////////////////
    const changeAccountStatus = (event) => {
        setAccountStatusObject(event)
        const value = event.value;
        setAccountStatus(value)
    }
    ////////////////////////////////////////////////////////////////
    const validateName = (event) => {
        setName(event.target.value);
        const elementVal = event.target.value;
        const minLen = minActNameLen;  
        const maxLen = maxActNameLen; 
        const flag = 0; //if mandatory feild then 1 if not then 0

        const errorMessage = chkName(elementVal, minLen, maxLen, flag, t)
        
        if (errorMessage) {
            setNameValidationTheme('formError');
            setNameErrMsg(errorMessage);
        } else {
            setNameValidationTheme('formHover');
            setNameErrMsg('')
        }
    };
    //////////////////////////////////////////////////////////////////
    const validateDesignation = (event) => {
        setDesignation(event.target.value);
        const elementVal = event.target.value;
        const minLen = 0;  
        const maxLen = 50; 
        const flag = 0;

        const errorMessage = chkName(elementVal, minLen, maxLen, flag, t)
        if (errorMessage) {
            setDesignationValidationTheme('formError');
            setDesignationErrMsg(errorMessage);
        } else {
            setDesignationValidationTheme('formHover');
            setDesignationErrMsg('')
        }
    };
    //////////////////////////////////////////////////////////
    const validateDepartment = (event) => {
        setDepartment(event.target.value);

        const elementVal = event.target.value; 
        const minLen = 0;  
        const maxLen = 50; 
        const flag = 0;

        const errorMessage = chkName(elementVal, minLen, maxLen, flag, t)
        if (errorMessage) {
            setDepartmentValidationTheme('formError');
            setDepartmentErrMsg(errorMessage);
        } else {
            setDepartmentValidationTheme('formHover');
            setDepartmentErrMsg('')
        }
    };

    ///////////////////////////////////////////////////////////////////////////////////

    const validateMailId = (event) => {
        setMailId(event.target.value);
        const elementVal = event.target.value; 
        const flag = '1';
        const errorMessage = chkMail(elementVal,flag,t);
        if (errorMessage) {
            setMailIdValidationTheme('formError');
            setMailIdErrMsg(errorMessage);
        } else {
            setMailIdValidationTheme('formHover');
            setMailIdErrMsg('')
        }
    }
    /////////////////////////////////////////////////////////////////////////////////////

    const validateMobileNum = (event) => {
        setMobile(event.target.value)
        
        const elementVal  = event.target.value
        const len = msidnLen
        const flag = '1'

        const errorMessage = chkMobileNum(elementVal,'0',len,flag,t)
        if (errorMessage) {
            setMobileValidationTheme('formError');
            setMobileErrMsg(errorMessage);
        } else {
            setMobileValidationTheme('formHover');
            setMobileErrMsg('')
        }

    }

    /////////////////////////////////////////////////////////////////////
    const changeLanguage = (event) =>{
        setLanguage(event)
    }

    ///////////////////////////////////////////////////////////////////
    const isLdapUser = (event) => {
        if(event.target.checked){
            setLDAPUser(true)
        }
        else{
            setLDAPUser(false)
        }
    };

    ///////////////////////////////////////////////////////////////////////
    const accountTypes = accountTypesList.flatMap(product =>
        product.accessTypeDetails.map(accountType => ({
            value: accountType.accessTypeId,
            label: accountType.accessTypeName,
            productId: product.productId
        }))
    );   

    const defaultAccountType = noAccessOption;
    useEffect(() => {
        const initialState = productsList.reduce((acc, product) => {
            acc[product.productId] = defaultAccountType;
            return acc;
        }, {});
        setSelectedAccountTypes(initialState);
    }, [accountTypesList, productsList]);
    
    const accountTypeChange = (productId, newValue) => {
        setSelectedAccountTypes(prevState => ({
            ...prevState,
            [productId]: newValue
        }));
    };

    const access = Object.entries(selectedAccountTypes)
    .filter(([key, value]) => value.value !== "0")  
    .map(([key, value]) => `${key}$${value.value}`)
    .join('$');
    
    ///////////////////////////////////////////////////////////////////////
    const viewAccountPreviewModal = () => {
        let isValid = true;
        let errorMessage = ""
        if(loginId == "" ){
            setLoginIdValidationTheme('formError')
            setLoginIdErrMsg(t('modules.Generic.errorMsg.mandatory'))
            isValid = false
        }
        
        if(password == "" ){
            setPasswordValidationTheme('formError')
            setPasswordErrMsg(t('modules.Generic.errorMsg.mandatory'))
            isValid = false
        }
        if(confirmPassword == "" ){
            setConfirmPasswordValidationTheme('formError')
            setConfirmPasswordErrMsg(t('modules.Generic.errorMsg.mandatory'))
            isValid = false
        }
        if(employeeId == "" ){
            setEmployeeIdValidationTheme('formError')
            setEmployeeIdErrMsg(t('modules.Generic.errorMsg.mandatory'))
            isValid = false
        }
        if(mobile == ""){
            setMobileValidationTheme('formError')
            setMobileErrMsg(t('modules.Generic.errorMsg.mandatory'))
            isValid = false
        }
        if(mailId == ""){
            setMailIdValidationTheme('formError')
            setMailIdErrMsg(t('modules.Generic.errorMsg.mandatory'))
            isValid = false
        }
        allProductIdsZero = Object.values(selectedAccountTypes).every(accountType => accountType.value === '0');  
        if(allProductIdsZero){
            infoAlert(t("modules.Accounts.accountAddAndModify.alert"))
            isValid = false
        }
        
        if(name == "")
            setName(loginId)

        if(loginId != "" || loginId != null){
            const EMAIL_RE_PREVIEW = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if(loginId.includes('@')) {
                // Validate login ID as email
                if(!EMAIL_RE_PREVIEW.test(loginId)) {
                    setLoginIdValidationTheme('formError')
                    setLoginIdErrMsg(t('modules.Generic.errorMsg.invalid'))
                    isValid = false
                } else if (loginId.length > maxActNameLen) {
                    setLoginIdValidationTheme('formError')
                    setLoginIdErrMsg(t('modules.Generic.errorMsg.maxnChar', { maxChar: maxActNameLen }))
                    isValid = false
                }
            } else {
                errorMessage = chkName(loginId, minActNameLen, maxActNameLen, '1',t)
                if(errorMessage){
                    setLoginIdValidationTheme('formError')
                    setLoginIdErrMsg(errorMessage)
                    isValid = false
                }
            }
        }
        if(employeeId != "" || employeeId != null){
            errorMessage = chkName(employeeId, 1, 50, '1',t)
            if(errorMessage){
                setEmployeeIdValidationTheme('formError')
                setEmployeeIdErrMsg(errorMessage)
                isValid = false
            }           
        }
    
        if(loginIdErrMsg != "" || passwordErrMsg != "" || confirmPasswordErrMsg != ""  ||
           employeeIdErrMsg != "" || nameErrMsg != "" || designationErrMsg != "" ||
           departmentErrMsg != ""  || mailIdErrMsg != "" || mobileErrMsg != "" || allProductIdsZero == true)
        {
            isValid = false
        }
        setOpenModal(isValid)      
    }

    ///////////////////////////////////////////////////////////////////////
    const showAccountsAddPage = () => { 
        if((modulePermission & 4) != 0){
	      setShowAccountsConfirmPwdPage(true);
	}
	else{
	      Log('Accounts', 'WARNING', "Add Permission is denied!")
	}
        setShowAccountsCreatePage(false);
        setShowAccountsModifyPage(false)       
    }
    const closeAccountsAddPage = () => {
        setShowAccountsCreatePage(false);
        resetAddFeilds();
        resetSelectedAccountTypes();
    }


    ///////////////////////////////////////////////////////////////////////////

    const products = productsList.map(product => ({
        value: product.productId,            
        label: product.productName
    }));

    useEffect(() => {
        const defaultProduct = products.find(option => option.value === productId);
        if (defaultProduct) {
            setFilterProduct(defaultProduct);
        }
    }, [productsList]);

    useEffect(() => {
        const defaultAccType = accountTypes.find(option => option.value === 9999);
        if (defaultAccType) {
            setFilterAccountType(defaultAccType);
        }
    }, [accountTypesList]);

    useEffect(() => {
        if (filterProduct.value && filterAccountType.value && filterAccountStatus.value) {
            setIsInitialized(true);
        }
    }, [filterProduct, filterAccountType, filterAccountStatus]);

    ////////////////////////////////////////////////////////////////
    useEffect(() => {
        const fetchData = async () => {
            if (isInitialized) {
                try {
                    const encryptedData = await encryptPayload({ productId: filterProduct.value, accountType: filterAccountType.value, status: filterAccountStatus.value, clientId:clientID }, conf.encryptionKey);
                    const response = await fetch(`${url}/tssgui/getFilteredAccounts?key=${encodeURIComponent(encryptedData.encryptedKey)}&data=${encodeURIComponent(encryptedData.encryptedPayload)}&iv=${encodeURIComponent(encryptedData.iv)}`, { headers: { 'tssgui-tenant-code': localStorage.getItem('tenantCode') } });
                    if (!response.ok) {
                        throw new Error("Error fetching data ");
                    }
                    const data = await response.json();
                    setFilteredAccounts(data);
                    Log('Accounts', 'INFO', 'Data fetched successfully : '+JSON.stringify(data));
                } catch (error) {
                    Log('Accounts', 'ERROR', 'Error fetching data : '+error);
                }
            }else {
                try {
                    const encryptedData = await encryptPayload({ productId, accountType: 9999, status: filterAccountStatus.value, clientId:clientID }, conf.encryptionKey);
                    const response = await fetch(`${url}/tssgui/getFilteredAccounts?key=${encodeURIComponent(encryptedData.encryptedKey)}&data=${encodeURIComponent(encryptedData.encryptedPayload)}&iv=${encodeURIComponent(encryptedData.iv)}`, { headers: { 'tssgui-tenant-code': localStorage.getItem('tenantCode') } });
                    if (!response.ok) {
                        throw new Error("Error fetching data ");
                    }
                    const data = await response.json();
                    setFilteredAccounts(data);
                    Log('Accounts', 'INFO', 'Data fetched successfully : '+JSON.stringify(data));
                } catch (error) {
                    Log('Accounts', 'ERROR', 'Error fetching data : '+error);
                }
            }
            setLoading(false)
        };
        fetchData();
    }, [isInitialized]);


    const reloadFilteredAccounts = async() => {
        setLoading(true)
        try {
            const encryptedData = await encryptPayload({ productId: filterProduct.value, accountType: filterAccountType.value, status: filterAccountStatus.value, clientId:clientID }, conf.encryptionKey);
            const response = await fetch(`${url}/tssgui/getFilteredAccounts?key=${encodeURIComponent(encryptedData.encryptedKey)}&data=${encodeURIComponent(encryptedData.encryptedPayload)}&iv=${encodeURIComponent(encryptedData.iv)}`, { headers: { 'tssgui-tenant-code': localStorage.getItem('tenantCode') } });
            if (!response.ok) {
                throw new Error("Error fetching data ");
            }
            const data = await response.json();
            setFilteredAccounts(data);
            setLoading(false)
            Log('Accounts', 'INFO', 'Data fetched successfully : '+JSON.stringify(data));
        } catch (error) {
            setLoading(false)
            Log('Accounts', 'ERROR', 'Error fetching data : '+error);
        }
    }

    //////////////////////////////////////////////////////////////////

    const filterAccounts = async() => {
        if(Object.keys(filterAccountType).length === 0) {
           setFilterAccTypeErrMsg(t('modules.Generic.errorMsg.mandatory'));
           setFilterAccTypeValTheme('selectFormError');
           return;
        }

        try {
            const encryptedData = await encryptPayload({ productId: filterProduct.value, accountType: filterAccountType.value, status: filterAccountStatus.value, clientId:clientID }, conf.encryptionKey);
            const response = await fetch(`${url}/tssgui/getFilteredAccounts?key=${encodeURIComponent(encryptedData.encryptedKey)}&data=${encodeURIComponent(encryptedData.encryptedPayload)}&iv=${encodeURIComponent(encryptedData.iv)}`, { headers: { 'tssgui-tenant-code': localStorage.getItem('tenantCode') } });
            if (!response.ok) {
                throw new Error("Error fetching data ");
            }
            const data = await response.json();
            setFilteredAccounts(data);
            Log('Accounts', 'INFO', 'Data fetched successfully : '+JSON.stringify(data));
        } catch (error) {
            Log('Accounts', 'ERROR', 'Error fetching data : '+error);
        }
        setShowSearchButton(false);
        setShowFilteredAccountsTable(true)
    }
    ////////////////////////////////////////////////////////////
      
    const filterAccountsInModal = async(productId,status) => {
        const accessTyp = -2; 
        try {
            const encryptedData = await encryptPayload({ productId, accountType: accessTyp, status, clientId:clientID }, conf.encryptionKey);
            const response = await fetch(`${url}/tssgui/getFilteredAccounts?key=${encodeURIComponent(encryptedData.encryptedKey)}&data=${encodeURIComponent(encryptedData.encryptedPayload)}&iv=${encodeURIComponent(encryptedData.iv)}`, { headers: { 'tssgui-tenant-code': localStorage.getItem('tenantCode') } });
            if (!response.ok) {
                throw new Error("Error fetching data ");
            }
            const data = await response.json();
            setFilteredAccountsInModal(data);
            Log('Accounts', 'INFO', 'Data fetched successfully : '+JSON.stringify(data));
        } catch (error) {
            Log('Accounts', 'ERROR', 'Error fetching data : '+error);
        }
    }

    ////////////////////////////////////////////////////////////////
    const [refreshKey, setRefreshKey] = useState(0);
    const [filterAccTypeValTheme, setFilterAccTypeValTheme] = useState('selectForm');
    const [filterAccTypeErrMsg, setFilterAccTypeErrMsg] = useState(''); 
   
    const productChange = (event) => {
        setFilterProduct(event)
        setRefreshKey(prev => prev + 1);
        setFilterAccountType({})
        loadAccTyps(event.value)
        setShowFilteredAccountsTable(false)
        setShowSearchButton(true);
    }
    const accTypeChange = (event) => {

        if (event.length === 0) {
           setFilterAccTypeErrMsg(t('modules.Generic.errorMsg.mandatory'));
           setFilterAccTypeValTheme('selectFormError');
        }else {
           setFilterAccTypeErrMsg(t(''));
           setFilterAccTypeValTheme('selectForm');
        }
        setFilterAccountType(event)
        setShowFilteredAccountsTable(false)
        setShowSearchButton(true);
    }
    const accStatusChange = (event) => {
        setFilterAccountStatus(event)   
        setShowFilteredAccountsTable(false)
        setShowSearchButton(true);  
    }

    ////////////////////////////////////////////////////////////////

    const languages = languagesList.map(language => ({
        value: language.languageId,            
        label: language.languageName
    }));


    useEffect(() => {
        const defaultLanguage = languages.find(option => option.value === 1);
        if (defaultLanguage) {
            setLanguage(defaultLanguage);
        }
    }, [languagesList]);

    ////////////////////////////////////////////
    async function fetchAccountTypes(pairs) {
        const finalObject = {};

        for (const [productId, accountTypeId] of pairs) {
            try {
                const encryptedData = await encryptPayload({ productId, acctId: clientID }, conf.encryptionKey);
                const response = await fetch(`${url}/tssgui/getAllAccountTypes?key=${encodeURIComponent(encryptedData.encryptedKey)}&data=${encodeURIComponent(encryptedData.encryptedPayload)}&iv=${encodeURIComponent(encryptedData.iv)}`, { headers: { 'tssgui-tenant-code': localStorage.getItem('tenantCode') } });
                if (!response.ok) {
                    throw new Error("Error fetching data ");
                }
                const data = await response.json();
                const accountTypesList = data.flatMap(product =>
	            product.accessTypeDetails.map(accessType => ({		
                        value: accessType.accessTypeId,
                        label: accessType.accessTypeName,
                        productId: product.productId
                })));


                const accountTypeObject = accountTypesList.find(accountType => accountType.value === accountTypeId);

                if (accountTypeObject) {
                    finalObject[productId] = accountTypeObject;
                }
                

                Log('Accounts', 'INFO', 'Data fetched successfully : '+JSON.stringify(data));
            } catch (error) {
                Log('Accounts', 'ERROR', 'Error fetching data : '+error);
            }
        }

        return finalObject;
    }
    //////////////////////////////////////////////////////////////////////////  
    const fetchAccountDetails = async (accountId) => {
        try {
            const encryptedData = await encryptPayload({ accountId, clientId: clientID }, conf.encryptionKey);
            const response = await fetch(`${url}/tssgui/getAccountDetails?key=${encodeURIComponent(encryptedData.encryptedKey)}&data=${encodeURIComponent(encryptedData.encryptedPayload)}&iv=${encodeURIComponent(encryptedData.iv)}`, { headers: { 'tssgui-tenant-code': localStorage.getItem('tenantCode') } });
            if (!response.ok) {
                throw new Error(`"Error fetching data ": ${response.status} ${response.statusText}`);
            }
            const data = await response.json();
            Log('Accounts', 'INFO', 'Data fetched successfully : '+JSON.stringify(data));
            setmAccountId(data.accountId)
            setmLoginId(data.accountName);
            setmEmployeeId(data.employeeId);
            setmAccountExpiry(data.accountExpiry.split('T')[0]);
            setmAccountStatus(data.status);
            setmName(data.displayName);
            setmDesignation(data.designation == '$$' ? '' : data.designation);
            setmDepartment(data.department == '$$' ? '' : data.department);
            setmMobile(data.mobileNum === '$$' || data.mobileNum === '' ? '' : data.mobileNum.substring(cc.length).trim() );
            setmMailId(data.mailId == '$$' ? '' : data.mailId);
            setmLDAPUser(data.ldapUser == '1' ? true : false);
            setmLanguageVal(data.languageId)
            
            const accesstype = data.accessDetails;
            //const elements = accesstype.split('$');
            //const pairs = [];
            // for (let i = 0; i < elements.length; i += 2) {
            //     pairs.push([elements[i], elements[i + 1]]);
            // }
		//
            const pairs = accesstype.map(item => [
                item.productId, 
                item.accessType
            ]);

            fetchAccountTypes(pairs).then(finalObject => {
                setSelectedAccountTypes(finalObject);
            });

            
            
        } catch (error) {
            Log('Accounts', 'ERROR', 'Error fetching data : '+error);
        }
    };

    ////////////////////////////////////////////////////////////////

    useEffect(() => {
        const fetchAccountDetails = async () => {
            try {
                const encryptedData = await encryptPayload({ accountId: clientID }, conf.encryptionKey);
                const response = await fetch(`${url}/tssgui/getetails?key=${encodeURIComponent(encryptedData.encryptedKey)}&data=${encodeURIComponent(encryptedData.encryptedPayload)}&iv=${encodeURIComponent(encryptedData.iv)}`, { headers: { 'tssgui-tenant-code': localStorage.getItem('tenantCode') } });
                if (!response.ok) {
                    throw new Error(`"Error fetching data ": ${response.status} ${response.statusText}`);
                }
                const data = await response.json();

                setLevelOfLoggedInUser(data[0].previlegeLevel);
    
                Log('Accounts', 'INFO', 'Data fetched successfully: ' + JSON.stringify(data));
            } catch (error) {
                Log('Accounts', 'ERROR', 'Error fetching data: ' + error);
            }
        };

        fetchAccountDetails();
    }, [clientID]);
    
    ////////////////////////////////////////////////////////////////
    const validateMEmployeeId = (event) => {
        setmEmployeeId(event.target.value);
        var RE1 = /^[a-zA-Z0-9]/i;
        var RE2=/^[a-zA-Z0-9][a-zA-Z0-9\_\-\s]+$/;

        if((event.target.value == "") || (event.target.value == null)) {
            setmEmployeeIdValidationTheme("formError");
            setmEmployeeIdErrMsg(t("modules.Generic.errorMsg.mandatory"))
        }

        else if(!RE1.test(event.target.value))   {
            setmEmployeeIdValidationTheme("formError");
            setmEmployeeIdErrMsg(t("modules.Generic.errorMsg.startWithAlphaNumeric"))
        }

        else if(event.target.value.length < 1) {
            setmEmployeeIdValidationTheme("formError");
            setmEmployeeIdErrMsg(t("modules.Generic.errorMsg.minChar", { minChar: 1 }))
        }

        else if (event.target.value.length > 50) {
            setmEmployeeIdValidationTheme("formError");
            setmEmployeeIdErrMsg(t("modules.Generic.errorMsg.maxChar", { maxChar: 50 }))
        }
        else{
            setmEmployeeIdValidationTheme("formHover"); 
            setmEmployeeIdErrMsg('')
        }
    }
    //////////////////////////////////////////////////////////////
    const changeMAccountExpiry = (event) => {
        //const formattedDate = event.toISOString().split('T')[0];
        setmAccountExpiry(event)
    }
    //////////////////////////////////////////////////////////////
    const changeMAccountStatus = (event) => {
        setmAccountStatusObject(event)
        const value = event.value;
        setmAccountStatus(value)
    }
    /////////////////////////////////////////////////////////////
    const validateMName = (event) => {
        setmName(event.target.value);
        const elementVal = event.target.value;
        const minLen = minActNameLen;  
        const maxLen = maxActNameLen; 
        const flag = 0; //if mandatory feild then 1 if not then 0

        const errorMessage = chkName(elementVal, minLen, maxLen, flag, t)
        if (errorMessage) {
            setmNameValidationTheme('formError');
            setmNameErrMsg(errorMessage);
        } else {
            setmNameValidationTheme('formHover');
            setmNameErrMsg('')
        }
    };
    //////////////////////////////////////////////////////////////////
    const validateMDesignation = (event) => {
        setmDesignation(event.target.value);
        const elementVal = event.target.value;
        const minLen = 0;  
        const maxLen = 50; 
        const flag = 0;

        const errorMessage = chkName(elementVal, minLen, maxLen, flag, t)
        if (errorMessage) {
            setmDesignationValidationTheme('formError');
            setmDesignationErrMsg(errorMessage);
        } else {
            setmDesignationValidationTheme('formHover');
            setmDesignationErrMsg('')
        }
    };
    //////////////////////////////////////////////////////////
    const validateMDepartment = (event) => {
        setmDepartment(event.target.value);

        const elementVal = event.target.value; 
        const minLen = 0;  
        const maxLen = 50; 
        const flag = 0;

        const errorMessage = chkName(elementVal, minLen, maxLen, flag, t)
        if (errorMessage) {
            setmDepartmentValidationTheme('formError');
            setmDepartmentErrMsg(errorMessage);
        } else {
            setmDepartmentValidationTheme('formHover');
            setmDepartmentErrMsg('')
        }
    };
 
    ///////////////////////////////////////////////////////////////////////////////////

    const validateMMailId = (event) => {
        setmMailId(event.target.value);
        const elementVal = event.target.value; 
        const flag = '1';

        const errorMessage = chkMail(elementVal,flag,t);

        if (errorMessage) {
            setmMailIdValidationTheme('formError');
            setmMailIdErrMsg(errorMessage);
        } else {
            setmMailIdValidationTheme('formHover');
            setmMailIdErrMsg('')
        }
    }
    /////////////////////////////////////////////////////////////////////////////////////

    const validateMMobileNum = (event) => {
        setmMobile(event.target.value)
        
        const elementVal  = event.target.value
        const len = msidnLen
        const flag = '1'

        const errorMessage = chkMobileNum(elementVal,'0',len,flag,t)
        if (errorMessage) {
            setmMobileValidationTheme('formError');
            setmMobileErrMsg(errorMessage);
        } else {
            setmMobileValidationTheme('formHover');
            setmMobileErrMsg('')
        }

    }
    /////////////////////////////////////////////////////////////////////
    const changeMLanguage = (event) =>{
        setmLanguage(event)
        setmLanguageVal(event.value)
    }

    /////////////////////////////////////////////////////////////////////

    const isMLdapUser = (event) => {
        if(event.target.checked){
            setmLDAPUser(true)
        }
        else{
            setmLDAPUser(false)
        }
    };

    ///////////////////////////////////////////////////////////////////////
    
    const showDeletAccountModal = (acctDetails) => {
        close();
        const { accountId } = acctDetails;
        setAccountIdToBeDeleted(accountId)
        const { loginId } = acctDetails;
        setAccountToBeDeleted(loginId)
    }

    //////////////////////////////////////////////////////////////////////////
    const validateDeletePassword = (event) => {
        setDeletePassword(event.target.value)
        if(event.target.value != ""){
            setDeleteValidationTheme('form')
            setDeleteTooltipMessage('')
        }
        if(event.target.value == ""){
            setDeleteValidationTheme('formError')
            setDeleteTooltipMessage(t("modules.Generic.errorMsg.mandatory"))
        }
    }

    const deleteAccount = async(acctId) => {  
        if(deletePassword == "")   {           
                setDeleteValidationTheme("formError");   
                setDeleteTooltipMessage(t('modules.Generic.errorMsg.mandatory'));          
        }
        else{
            try {           
                const encryptedData = await encryptPayload({ password: deletePassword, accountId: clientID, accountName: userName }, conf.encryptionKey);
                const response = await fetch(`${url}/tssgui/confirmAccountPassword?key=${encodeURIComponent(encryptedData.encryptedKey)}&data=${encodeURIComponent(encryptedData.encryptedPayload)}&iv=${encodeURIComponent(encryptedData.iv)}`, { headers: { 'tssgui-tenant-code': localStorage.getItem('tenantCode') } }); 
                if (!response.ok) {
                    throw new Error("Error fetching data ");
                }
                const data = await response.json();
                Log('Accounts', 'INFO', 'Data fetched successfully : '+JSON.stringify(data));
                if (data.additionalInfo.result == 1){
                    try{
                        setDeleteTooltipMessage('')
                        setDeleteValidationTheme('form')
                        const encryptedDelData = await encryptPayload({ accountId: acctId, clientId: clientID, clientIp: clientIP, sessionId: sessionID, productId }, conf.encryptionKey);
                        const response = await fetch(`${url}/tssgui/deleteAccount?key=${encodeURIComponent(encryptedDelData.encryptedKey)}&data=${encodeURIComponent(encryptedDelData.encryptedPayload)}&iv=${encodeURIComponent(encryptedDelData.iv)}`, {
                            method: 'DELETE',
                            headers: { 'tssgui-tenant-code': localStorage.getItem('tenantCode') },
                        });
                        if (!response.ok) {
                            Log('Accounts','WARN',`t('modules.Generic.alertMsg.delete')  :${response.status} ${response.statusText}`);
                        }
                        if(response.ok){        
                            const resultString = await response.text();
                            const responseObject = JSON.parse(resultString);
                            const alerttype = responseObject.additionalInfo.alerttype;
                            const disp_msg = responseObject.response;
                            if (alerttype == "alert-danger"){
                                showToast('error',disp_msg);
                                
                            }
                            else{
                                showToast('success',disp_msg);
                                reloadStatusCountList();
                                reloadFilteredAccounts();
                                setDeletePassword('')
                                const modal = document.querySelector("#accountDeleteModal");
                                if (modal) {
                                    modal.classList.remove('show');
                                    modal.style.display = 'none';
                                    const backdrop =document.querySelector('.modal-backdrop');
                                    if (backdrop) {
                                        backdrop.remove();
                                    }
                                }
                            }
                        }
                    }
                    catch {
                        Log('Accounts', 'WARN', "Error deleting account.")
                    }
                }               
                else {
                    setDeleteValidationTheme("formError");
                    setDeleteTooltipMessage(t('modules.Generic.errorMsg.invalidPassword'));
                }
            } catch (error) {
                Log('Accounts', 'ERROR', 'Error deleting account :'+error);
            }
        }
    }
    ////////////////////////////////////////////////////////////////////
    const showAccountModifyPreviewModal = () => {
        let isValid = true;
        if(mEmployeeId == "" ){
            setmEmployeeIdValidationTheme('formError')
            setmEmployeeIdErrMsg(t('modules.Generic.errorMsg.mandatory'))
            isValid = false
        }
        if(mMobile == ""){
            setmMobileValidationTheme('formError')
            setmMobileErrMsg(t('modules.Generic.errorMsg.mandatory'))
            isValid = false
        }
        if(mMailId == ""){
            setmMailIdValidationTheme('formError')
            setmMailIdErrMsg(t('modules.Generic.errorMsg.mandatory'))
            isValid = false
        }
        const allProductIdsZero = Object.values(selectedAccountTypes).every(accountType => accountType.value === '0');
        if(allProductIdsZero){
            infoAlert(t("modules.Accounts.accountAddAndModify.alert"))
            isValid = false
        }
        
        if (mEmployeeIdErrMsg != '' || mNameErrMsg != '' || mDesignationErrMsg != '' || mDepartmentErrMsg != '' || 
            mMailIdErrMsg != '' || mMobileErrMsg != '' || allProductIdsZero == true)
        {
            isValid = false
            
        }
        setOpenModifyModal(isValid);
    }
    /////////////////////////////////////////////////////////////////////
    const modifyAccount = async () => { 
        try {
            const requestBody = {
                    "clientId": parseInt(clientID,10),
                    "accountName": mLoginId,
                    "displayName": mName == "" ? mLoginId : mName,
                    "password": "T4y4n4",
                    "status": parseInt(mAccountStatus, 10), 
                    "mailId":  mMailId,
                    "mobileNum":  mMobile!=""? cc+""+mMobile : "",
                    "acctExpiry": mAccountExpiry.split(' ')[0]+"T00:00:00",
                    "employeeId": mEmployeeId,
                    "designation": mDesignation,
                    "department": mDepartment,
                    "ldapUser": mLDAPUser ? 1 : 0,
                    "languageId":parseInt(mLanguageVal,10),
                    "accessDetails": parseAccess(access)
                }
              const encryptedData = await encryptPayload(requestBody, conf.encryptionKey);
                const response = await fetch(`${url}/tssgui/modifyAccount?accountId=${parseInt(mAccountId,10)}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  'tssgui-tenant-code': localStorage.getItem('tenantCode'),
                },
                body: JSON.stringify({ key: encryptedData.encryptedKey, data: encryptedData.encryptedPayload, iv: encryptedData.iv }),
              });
              if (!response.ok) {
                Log('Accounts','WARN',t('modules.Generic.alertMsg.modify'));
              }
              if(response.ok){        
                const resultString = await response.text();
                const responseObject = JSON.parse(resultString);
                const alerttype = responseObject.additionalInfo.alerttype;
                const disp_msg = responseObject.response;
                if (alerttype == "alert-danger"){
                    showToast('error',disp_msg);
                }
                else{
                    showToast('success',disp_msg)
                    setShowAccountsModifyPage(false);
                    reloadFilteredAccounts();
                    reloadStatusCountList();
                    resetModFeilds(mAccountId);
                    const modal = document.querySelector("#accountModifyPreviewModal");
                    if (modal) {
                        modal.classList.remove('show');
                        modal.style.display = 'none';
                        const backdrop =document.querySelector('.modal-backdrop');
                        if (backdrop) {
                            backdrop.remove();
                        }
                    }
                }
            }
        }
        catch (e){
            Log('Accounts', 'ERROR', "Error modifying account. "+e);
        }
    }

    //////////////////////////////////////////////////////////////////
    const close = () => {
        setDeletePassword('')
        setDeleteTooltipMessage('')
        setDeleteValidationTheme('form')
    }

    const resetAddFeilds = () =>{
        //setSelectedAccountTypes({})
        setLoginId('')
        setPassword('')
        setConfirmPassword('')
        setEmployeeId('')
        setAccountStatusObject({value:'0',label:'Active'})
        setName('')
        setDesignation('')
        setDepartment('')
        setMailId('')
        setMobile('')
        setLDAPUser(false)
        setLanguage({value:1 ,label:"English"})
        setLoginIdValidationTheme('form')
        setPasswordValidationTheme('form')
        setConfirmPasswordValidationTheme('form')
        setEmployeeIdValidationTheme('form')
        setNameValidationTheme('form')
        setDesignationValidationTheme('form')
        setDepartmentValidationTheme('form')
        setMobileValidationTheme('form')
        setMailIdValidationTheme('form')
        setLoginIdErrMsg('')
        setPasswordErrMsg('')
        setConfirmPasswordErrMsg('')
        setEmployeeIdErrMsg('')
        setNameErrMsg('')
        setDesignationErrMsg('')
        setDepartmentErrMsg('')
        setMobileErrMsg('')
        setMailIdErrMsg('')     
    }
    const resetModFeilds = (acctId) =>{
        fetchAccountDetails(acctId)
        setmEmployeeIdValidationTheme('form')
        setmNameValidationTheme('form')
        setmDesignationValidationTheme('form')
        setmDepartmentValidationTheme('form')
        setmMobileValidationTheme('form')
        setmMailIdValidationTheme('form')
        setmEmployeeIdErrMsg('')
        setmNameErrMsg('')
        setmDesignationErrMsg('')
        setmDepartmentErrMsg('')
        setmMobileErrMsg('')
        setmMailIdErrMsg('')
    }
    
    const showAccountModifyPage = (accountDetails) => {
        if(modulePermission & 2 != 0 ){
            const { accountId ,level} = accountDetails;
            setmLevel(level)
            window.scrollTo(0, 0);
            fetchAccountDetails(accountId)
            setShowAccountsConfirmPwdPage(false);
            setShowAccountsModifyPage(true)
            setShowAccountsCreatePage(false)
        }
        else{
            Log('Accounts', 'WARN', "Modify permission is denied!")
        }
    }
    const closeAccountsModifyPage = () => {
        setShowAccountsModifyPage(false);
        resetModFeilds();
        resetSelectedAccountTypes();
    }

    const resetSelectedAccountTypes = () => {
        const initialState = productsList.reduce((acc, product) => {
            acc[product.productId] = defaultAccountType;
            return acc;
        }, {});
        setSelectedAccountTypes(initialState);
    };
    
    ///////////////////////////////////////////////////////////////

    useEffect(() => {
        const fetchData = async () => {
            try {
                const encryptedData = await encryptPayload({ productId, acctId: clientID }, conf.encryptionKey);
                const response = await fetch(`${url}/tssgui/getAllAccountTypes?key=${encodeURIComponent(encryptedData.encryptedKey)}&data=${encodeURIComponent(encryptedData.encryptedPayload)}&iv=${encodeURIComponent(encryptedData.iv)}`, { headers: { 'tssgui-tenant-code': localStorage.getItem('tenantCode') } });
                if (!response.ok) {
                    throw new Error("Error fetching data ");
                }
                const data = await response.json();
                setAccountTypesBasedOnProduct(data);
                Log('Accounts', 'INFO', 'Data fetched successfully : '+JSON.stringify(data));
            } catch (error) {
                Log('Accounts', 'ERROR', 'Error fetching data : '+error);
            }
        };
        
        fetchData();
    }, []);

    const loadAccTyps = (prdId) => {
        const fetchData = async () => {
            try {
                const encryptedData = await encryptPayload({ productId: prdId, acctId: clientID }, conf.encryptionKey);
                const response = await fetch(`${url}/tssgui/getAllAccountTypes?key=${encodeURIComponent(encryptedData.encryptedKey)}&data=${encodeURIComponent(encryptedData.encryptedPayload)}&iv=${encodeURIComponent(encryptedData.iv)}`, { headers: { 'tssgui-tenant-code': localStorage.getItem('tenantCode') } });
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const data = await response.json();
                setAccountTypesBasedOnProduct(data);
                Log('Accounts', 'INFO', 'Data fetched successfully : '+JSON.stringify(data));
            } catch (error) {
                Log('Accounts', 'ERROR', 'Error fetching data : '+error);
            }
        };
    
        fetchData();
    };
    ////////////////////////////////////////////////////////////
    const clickOK = () =>{
        //setAccessTypeAlert(false)
    }
    ///////////////////////////////////////////////////////////

    const refreshModule = () => {
        setShowAccountsConfirmPwdPage(false);
        setShowAccountsCreatePage(false);
        setShowAccountsModifyPage(false);
        // setFilterProduct(products.find(option => option.value === productId));
        // setFilterAccountType(accountTypes.find(option => option.value === "9999"));
        reloadStatusCountList();
        reloadFilteredAccounts();
    }



    return (
        <>
            {permission != "0" && !loading ? (
            <>
                {showAccountsConfirmPwdPage && (
                    <AccountsConfirmPwd CreateAccount = {LoadAccountsCreatePage}  
                                        ValidatePassword={ConfirmPassword}
                                        validationTheme={validationTheme}
                                        tooltipMessage={tooltipMessage}
                                        ExitAdd = {exitAdd}
                    />
                )}
                {showAccountsCreatePage && (              
                    <AccountsCreate LoginId = {validateLoginId}
                                    LoginIdErrMsg = {loginIdErrMsg}
                                    LoginIdValidationTheme = {loginIdValidationTheme}   

                                    Password = {validatePassword}
                                    PasswordErrMsg = {passwordErrMsg}
                                    PasswordValidationTheme= {passwordValidationTheme}

                                    ConfirmPassword = {validateConfirmPassword}
                                    ConfirmPasswordErrMsg = {confirmPasswordErrMsg}
                                    ConfirmPasswordValidationTheme = {confirmPasswordValidationTheme}

                                    EmployeeId = {validateEmployeeId}
                                    EmployeeIdErrMsg = {employeeIdErrMsg}
                                    EmployeeIdValidationTheme = {employeeIdValidationTheme}

                                    AccountExpiry = {accountExpiry}
                                    NewExpiryDate = {changeAccountExpiry}
                                    
                                    AccountStatusObject={accountStatusObject}
                                    NewStatus={changeAccountStatus}

                                    Name = {validateName}
                                    NameErrMsg = {nameErrMsg}
                                    NameValidationTheme = {nameValidationTheme}

                                    Designation = {validateDesignation}
                                    DesignationErrMsg = {designationErrMsg}
                                    DesignationValidationTheme = {designationValidationTheme}

                                    Department = {validateDepartment}
                                    DepartmentErrMsg = {departmentErrMsg}
                                    DepartmentValidationTheme = {departmentValidationTheme}

                                    MailId = {validateMailId}
                                    MailIdErrMsg = {mailIdErrMsg}
                                    MailIdValidationTheme = {mailIdValidationTheme}

                                    Mobile = {validateMobileNum}
                                    MobileErrMsg = {mobileErrMsg}
                                    MobileValidationTheme = {mobileValidationTheme}

                                    Language = {language}
                                    NewLanguage = {changeLanguage}

                                    LdapUser = {isLdapUser}

                                    NoAccessOption = {noAccessOption}
                                    AccountTypeChange = {accountTypeChange}
                                    ProductAccountTypes = {selectedAccountTypes}

                                    AccountDetails = {AccountDetails}
                                    ProductsList = {productsList}
                                    AccountTypesList = {accountTypesList}
                                    LanguagesList = {languagesList}
                                    ShowPreviewModal = {viewAccountPreviewModal}
                                    OpenModal = {openModal}

                                    AddAccount = {addAccount}
                                    CloseAddPage = {closeAccountsAddPage}
                                    OK = {clickOK}
                                
                    />
                )}
                {showAccountsModifyPage && (
                    <AccountsModify EmployeeId = {validateMEmployeeId}
                                    EmployeeIdErrMsg = {mEmployeeIdErrMsg}
                                    EmployeeIdValidationTheme = {mEmployeeIdValidationTheme}

                                    AccountExpiry = {mAccountExpiry}
                                    NewExpiryDate = {changeMAccountExpiry}
                                    
                                    AccountStatusObject={mAccountStatusObject}
                                    NewStatus={changeMAccountStatus}

                                    Name = {validateMName}
                                    NameErrMsg = {mNameErrMsg}
                                    NameValidationTheme = {mNameValidationTheme}

                                    Designation = {validateMDesignation}
                                    DesignationErrMsg = {mDesignationErrMsg}
                                    DesignationValidationTheme = {mDesignationValidationTheme}

                                    Department = {validateMDepartment}
                                    DepartmentErrMsg = {mDepartmentErrMsg}
                                    DepartmentValidationTheme = {mDepartmentValidationTheme}

                                    MailId = {validateMMailId}
                                    MailIdErrMsg = {mMailIdErrMsg}
                                    MailIdValidationTheme = {mMailIdValidationTheme}

                                    Mobile = {validateMMobileNum}
                                    MobileErrMsg = {mMobileErrMsg}
                                    MobileValidationTheme = {mMobileValidationTheme}

                                    Language = {mLanguage}
                                    NewLanguage = {changeMLanguage}

                                    LdapUser = {isMLdapUser}
                                    NoAccessOption = {noAccessOption}
                                    
                                    Level = {mLevel}
                                    LevelOfLoggedInUser={levelOfLoggedInUser}
                                    
                                    OpenModal={openModifyModal}

                                    ShowPreviewModal = {showAccountModifyPreviewModal}
                                    ProductsList = {productsList}
                                    AccountTypesList = {accountTypesList}
                                    LanguagesList = {languagesList}
                                    ProductAccountTypes = {selectedAccountTypes}
                                    CloseModifyPage ={closeAccountsModifyPage}
                                    AccountDetails = {modAccountDetails}
                                    AccountTypeChange = {accountTypeChange}
                                    ResetAccountDetails ={resetModFeilds}
                                    ModifyAccount={modifyAccount}
                                    OK = {clickOK}
                                    Permission = {permission}
                    />
                )}
                {showAccountsViewPage && (
                <>
                    <AccountsCount StatusCountList = {statusCountList}
                                   ShowDetails ={filterAccountsInModal}
                                   FilteredAccounts = {filteredAccountsInModal}
                                  
                    />
                    <AccountsView ProductsList = {productsList}
                                  AccountTypesList = {accountTypesList}
                                  Product = {productChange}
                                  SelectedProduct = {filterProduct}
                                  AccountType = {accTypeChange}
                                  SelectedAccountType = {filterAccountType}
                                  AccountStatus = {accStatusChange}
                                  SelectedAccountStatus = {filterAccountStatus}
                                  ShowSearch = {showSearchButton}
                                  FilteredAccounts = {filteredAccounts}
                                  ShowFilteredAccountsTable = {showFilteredAccountsTable}
                                  Search = {filterAccounts}
                                  ShowAccountModifyPage ={showAccountModifyPage}
                                  ShowDeleteAccountModal = {showDeletAccountModal}
                                  DelPasswd = {deletePassword}
                                  AccountToBeDeleted = {accountToBeDeleted}
                                  AccountIdToBeDeleted = {accountIdToBeDeleted}
                                  DeleteValidationTheme = {deleteValidationTheme}
                                  DeleteTooltipMessage = {deleteTooltipMessage}
                                  DeletePassword = {validateDeletePassword}
                                  DeleteAccount = {deleteAccount}
                                  ShowAddPage = {showAccountsAddPage}
                                  Close = {close}

                                  AcctTyps = {accountTypesBasedOnProduct}
                                  Permission = {permission}
                                  Refresh = {refreshModule}
				  RefreshKey = {refreshKey}
                                  FilterAccTypeErrMsg = {filterAccTypeErrMsg}
				  FilterAccTypeValTheme ={filterAccTypeValTheme}

                                  AddPermission = {addPermission}
                                  DelPermission = {delPermission}
                                  LevelOfLoggedInUser={levelOfLoggedInUser}
                    />
                </>
                )}
            </>
            ):(
                <TssSpinner isLoading={loading}/>
            )}   
                 
        </>
    )
}
export default AccountsMain;
