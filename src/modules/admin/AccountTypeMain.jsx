import React, { useState, useEffect, useRef } from 'react';
import ContentHeader from '@app/modules/common/default/components/TssContentHeader';
import { useTranslation } from 'react-i18next';
import {infoAlert,showToast} from '@app/modules/common/default/components/TssFunction';
import {chkName} from '@app/modules/common/default/js/validate.js';
import { useLogout } from '@app/modules/common/default/utils/oidc-providers';
import TssSpinner from '@app/modules/common/default/components/TssSpinner'
import tssguiConf from '@app/modules/conf/TssGui.json';
import encryptPayload from '@app/modules/common/default/js/encryptPayload.js';
import Log from '@app/modules/common/default/components/TssGUILog.js'
import ConfirmPswd from '@app/modules/admin/ConfirmPswd';
import AccountTypeCreate from '@app/modules/admin/AccountTypeCreate';
import AccountTypeView from '@app/modules/admin/AccountTypeView';
import AccountTypeModify from '@app/modules/admin/AccountTypeModify';

const minAccountNameLen       = tssguiConf.MIN_ACNT_NAME_LENGTH;
const maxAccountNameLen       = tssguiConf.MAX_ACNT_NAME_LENGTH;
const url	           = tssguiConf.SERVER_JS_API_URI;
const pageModuleId 	   = 1000;
let clientId,clientIp, sessionId, serverIp, clientName,accountPdtId;

const AccountTypeMain = () => {
  var accessType = "";
  const [modulePermission, setModulePermission]	= useState('');
  const [acntAccessType, setAcntAccessType]	= useState('');
  const [displayAddPage, setDisplayAddPage]     = useState(false);
  const [displayModifyPage, setDisplayModifyPage]     = useState(false);
  const [t]                                     = useTranslation();
  const logOut                                  = useLogout();
  const [isConfirmPswd , setIsConfirmPswd]      = useState(false);
  const [accountPassword, setAccountPassword] 	= useState('')
  const [tooltipMessage, setTooltipMessage] 	= useState('')
  const [validationTheme, setValidationTheme]   = useState('form')
  const [loading, setLoading] 			= useState(false)

  const [accountType, setAccountType] 		= useState('')
  const [accountTypeId, setAccountTypeId] 		= useState('')
  const [accountTypeErrMsg, setAccountTypeErrMsg] 	= useState('')
  const [accountTypeValidationTheme, setAccountTypeValidationTheme] = useState('form')

  const [product, setProduct] 			= useState([])
  const [productId, setProductId] 		= useState('');
  const [mProductId, setmProductId] 		= useState([])
  const [productErrMsg, setProductErrMsg] 	= useState('')
  const [productValidationTheme, setProductValidationTheme] = useState('selectForm')
  const [productDefValue, setProductDefValue] = useState({});

  const [isAccountGroupSel, setIsAccountGroupSel]         = useState(false)
  const [accountGroup, setAccountGroup] 			= useState('')
  const [accountGroupId, setAccountGroupId] 		= useState('')
  const [accountGroupErrMsg, setAccountGroupErrMsg] 	= useState('')
  const [accountGroupValidationTheme, setAccountGroupValidationTheme] = useState('selectForm')
  const [accountGroupKey,setAccountGroupKey]            = useState(0);
  const [accountGroupDefValue, setAccountGroupDefValue] = useState({});

  const [landingPage, setLandingPage] 			= useState('')
  const [landingPageId, setLandingPageId] 		= useState('')
  const [mLandingPageId, setmLandingPageId] 		= useState('')
  const [landingPageErrMsg, setLandingPageErrMsg] 	= useState('')
  const [landingPageValidationTheme, setLandingPageValidationTheme] = useState('selectForm')
  const [landingPageKey, setLandingPageKey]             = useState(0);
  const [landingPageDefValue, setLandingPageDefValue]   = useState({});

  const [pdtList, setPdtList]     		= useState([]);
  const [accountGroupList, setAccountGroupList]           = useState([]);
  const [permissionList, setPermissionList]     = useState([]);
  const [landingPageList, setLandingPageList]   = useState([]);
  const [moduleList, setModuleList]     	= useState([]);
  const [modifyModuleList, setModifyModuleList]     	= useState([]);
  const [accessTypeDetails, setAccessTypeDetails]  = useState('');

  const [accountTypes, setAccountTypes]  = useState([]);
  const [openModal, setOpenModal] = useState(false)

  const AccountTypeDetails = {
        accountType,
        product,
        accountGroup,
        landingPage
  };
  
  const handleClick = () => {
      setDisplayAddPage(true);
      setDisplayModifyPage(false);
      setIsConfirmPswd(false);
      resetAddFields();
  };

  const handleClose=()=>{
      resetAddFields();
      setDisplayAddPage(false);
  };

  const closeModifyPage = (accountTypeDetails) => {
      setDisplayModifyPage(false);
  };

  const deleteRow=() =>{
  };

  const addData=()=>{
  };

  const modifyData=()=>{
  };

const confirmProp = {
    "data-dismiss": "modal",
};

  useEffect(() => {
         clientId   = localStorage.getItem("acctID");
         clientIp   = localStorage.getItem("clientIP");
         sessionId  = localStorage.getItem("sessionID");
         serverIp   = localStorage.getItem("serverIP");
         clientName = localStorage.getItem("acctName")
         accountPdtId = parseInt(localStorage.getItem("productID"),10)
  },[]);
  ///////////////   API Integration   //////////////////////
    useEffect(() => {
        const fetchAccessData = async () => {
            try {
                const encryptedData = await encryptPayload({ productId: accountPdtId, clientId, moduleId: pageModuleId, clientIp, sessionId ,tenantCode: localStorage.getItem("tenantCode")}, tssguiConf.encryptionKey);
                const response = await fetch(`${url}/tssgui/checkAccess?key=${encodeURIComponent(encryptedData.encryptedKey)}&data=${encodeURIComponent(encryptedData.encryptedPayload)}&iv=${encodeURIComponent(encryptedData.iv)}`, { headers: { 'tssgui-tenant-code': localStorage.getItem('tenantCode') } });
                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }
                const data = await response.text();
                const responseObject = JSON.parse(data);
                const permission = responseObject.permission;
                if(permission == 0){
                    logOut();
                }
                setModulePermission(permission);

                Log('AccountType','INFO','URL : '+`${url}/tssgui/checkAccess?productId=${accountPdtId}&clientId=${clientId}&moduleId=${pageModuleId}&clientIp=${clientIp}&sessionId=${sessionId}`+',Data fetched successfully, Response : '+ JSON.stringify(data));
            } catch (error) {
                Log('AccountType','Exception','URL : '+`${url}/tssgui/checkAccess?productId=${accountPdtId}&clientId=${clientId}&moduleId=${pageModuleId}&clientIp=${clientIp}&sessionId=${sessionId}`+`, ${error}`);
            }
        };
        fetchAccessData();
    }, []);

  const LoadCreateAccountType = async() => {
        if(accountPassword === "")   {
                setValidationTheme("formError");
                setTooltipMessage(t("modules.AccountType.deletePage.validation.pswdMandatory"));
        }
        else{
	    setValidationTheme("formHover");
	    setTooltipMessage("");
            try {
                const encryptedData = await encryptPayload({ password: accountPassword, accountId: clientId, accountName: localStorage.getItem("username") }, tssguiConf.encryptionKey);
                const response = await fetch(`${url}/tssgui/confirmAccountPassword?key=${encodeURIComponent(encryptedData.encryptedKey)}&data=${encodeURIComponent(encryptedData.encryptedPayload)}&iv=${encodeURIComponent(encryptedData.iv)}`, { headers: { 'tssgui-tenant-code': localStorage.getItem('tenantCode') } });
		setLoading(true);
                if (!response.ok) {
                    throw new Error(t("modules.Generic.errorMsg.failed"));
                }
                const data = await response.json();
                Log('AccountType','INFO','URL : '+`${url}/tssgui/confirmAccountPassword?password=${accountPassword}&accountId=${clientId}&accountName=${localStorage.getItem("username")}`+`,Data fetched successfully, Response : ${data}`);
		setLoading(false);
                if (data.additionalInfo.result == 1) {
                    setIsConfirmPswd(true);
                }
                else {
                    setValidationTheme("formError");
                    setTooltipMessage('Invalid Password!');
                }
            } catch (error) {
                Log('AccountType','Exception','URL : '+`${url}/tssgui/confirmAccountPassword?password=${accountPassword}&accountId=${clientId}&accountName=${localStorage.getItem("username")}`+`, ${error}`);
            }
        }
  }





  const fetchData = async (baseUrl, mappingFunction, setVal, params = null) => {
    try {
      let fetchUrl = baseUrl;
      if (params) {
        const encryptedData = await encryptPayload(params, tssguiConf.encryptionKey);
        fetchUrl = `${baseUrl}?key=${encodeURIComponent(encryptedData.encryptedKey)}&data=${encodeURIComponent(encryptedData.encryptedPayload)}&iv=${encodeURIComponent(encryptedData.iv)}`;
      }
      const response = await fetch(fetchUrl, { headers: { 'tssgui-tenant-code': localStorage.getItem('tenantCode') } });
      if (!response.ok) {
        throw new Error('Failed to fetch Details');
      }
      const jsonData = await response.json();
      const data = jsonData.map(mappingFunction);
      Log('AccountType','INFO','URL : '+baseUrl+',Data fetched successfully, Response : '+JSON.stringify(data))
      setVal(data); // Update state with fetched data
    } catch (error) {
      Log('AccountType','Exception','URL : '+baseUrl+`, ${error}`);
    }
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////
  const fetchModuleData = async (baseUrl, setVal, params = null) => {
    try {
      let fetchUrl = baseUrl;
      if (params) {
        const encryptedData = await encryptPayload(params, tssguiConf.encryptionKey);
        fetchUrl = `${baseUrl}?key=${encodeURIComponent(encryptedData.encryptedKey)}&data=${encodeURIComponent(encryptedData.encryptedPayload)}&iv=${encodeURIComponent(encryptedData.iv)}`;
      }
      const response = await fetch(fetchUrl, { headers: { 'tssgui-tenant-code': localStorage.getItem('tenantCode') } });
      if (!response.ok) {
        throw new Error('Failed to fetch Details');
      }
      const jsonData = await response.json();

      const modulesById = {};
      const childrenByParentId = {};

      jsonData.forEach(module => {
        modulesById[module.moduleId] = module;
        if (!childrenByParentId[module.modulePid]) {
          childrenByParentId[module.modulePid] = [];
        }
        childrenByParentId[module.modulePid].push(module);
      });
        

      function buildTree(parentId) {
        const children = childrenByParentId[parentId] || [];
        return children.map(module => ({
          moduleName: module.modulePathHierarchy,
          moduleId: module.moduleId,
          linkPath: module.modulePathHierarchy,
          moduleLevel: module.moduleLevel,
          permission: module.confirmedPermission,
          selPermission: module.selectedPermission,
          submodules: buildTree(module.moduleId) // Recursively get children
        }));
      }
    

      const data = buildTree(0);
      Log('AccountType','INFO','URL : '+baseUrl+',Data fetched successfully, Response : '+JSON.stringify(data))
      setVal(data); // Update state with fetched data
    } catch (error) {
      Log('AccountType','Exception','URL : '+baseUrl+`, ${error}`);
    }
  };

  useEffect(() => {
        const fetchData = async () => {
            try {
                const encryptedData = await encryptPayload({ accountId: clientId }, tssguiConf.encryptionKey);
                const response = await fetch(`${url}/tssgui/get/account/details?key=${encodeURIComponent(encryptedData.encryptedKey)}&data=${encodeURIComponent(encryptedData.encryptedPayload)}&iv=${encodeURIComponent(encryptedData.iv)}`, { headers: { 'tssgui-tenant-code': localStorage.getItem('tenantCode') } });
                if (!response.ok) {
                    throw new Error(`Error fetching data: ${response.status} ${response.statusText}`);
                }
                const data = await response.json();

                const accesstype = data[0].access_type;
                const elements = accesstype.split('$');
                const pairs = [];
                for (let i = 0; i < elements.length; i += 2) {
                    pairs.push([elements[i], elements[i + 1]]);
                }

                // Find the value associated with productId in pairs
                let accessValue = null;
                for (let pair of pairs) {
                    if (parseInt(pair[0]) === productId) {
                        accessValue = pair[1];
                        break;
                    }
                }
                // Set accessType state with the found value
                setAcntAccessType(accessValue);

            } catch (error) {
               Log('AccountType','Exception','Error fetching data:', error);
            }
        };

        fetchData();
    }, [productId]);

  useEffect(() => {
    // Fetch data when component mounts
    fetchData(`${url}/tssgui/getAllProducts`,(item) => ({ label: item.productName, value: item.productId }), setPdtList );
    if(productId !== "")
    {
    fetchData(`${url}/tssgui/getAllAccountGroups`,(item) => ({ label: item.accountGroupName, value: item.accountGroupId }), setAccountGroupList, { productId , clientId} );
    fetchData(`${url}/tssgui/getPermissions`,(item) => ({ label: item.permissionType, value: item.permissionId }), setPermissionList, { productId ,clientId} );
    if(isAccountGroupSel && !displayModifyPage)
    {
       fetchModuleData(`${url}/tssgui/getModulesSubmodules`, setModuleList, { productId, groupId: accountGroupId, accessType: 0,clientId } );
    }
    if(isAccountGroupSel)
    {
       fetchData(`${url}/tssgui/getAllLandingPages`,(item) => ({ label: item.landingPageName, value: item.landingPage }), setLandingPageList, { productId, groupId: accountGroupId, clientId } );
    }
    }
  }, [productId, accountGroupId, isAccountGroupSel, acntAccessType, displayModifyPage]);

     const getAccountTypeDetails = async () => {
		setLoading(true);
             try {
                 const encryptedData = await encryptPayload({ productId: -1, acctId: clientId }, tssguiConf.encryptionKey);
                 const response = await fetch(`${url}/tssgui/getAllAccountTypes?key=${encodeURIComponent(encryptedData.encryptedKey)}&data=${encodeURIComponent(encryptedData.encryptedPayload)}&iv=${encodeURIComponent(encryptedData.iv)}`, { headers: { 'tssgui-tenant-code': localStorage.getItem('tenantCode') } });
		 setLoading(false);
                 if (!response.ok) {
                     throw new Error('Failed to fetch data');
                 }
                 const data = await response.json();
                 setAccountTypes(data);
                 Log('AccountType','INFO', 'URL : '+`${url}/tssgui/getAllAccountTypes?productId=-1&acctId=${clientId}`+',Data fetched successfully,Response : '+JSON.stringify(data));
             } catch (error) {
		 setLoading(false);
                 Log('AccountType','Exception','URL : '+`${url}/tssgui/getAllAccountTypes?productId=-1&acctId=${clientId}`+`,${error}`);
             }
      };

    useEffect(() => {
      getAccountTypeDetails();
    }, []);

  ////////////////////////////////////////////////////////////////////////


  function parseAccessType(str) {
    const parts = str.split('$');
    const result = [];
    
    for (let i = 0; i < parts.length; i += 2) {
      result.push({
        moduleId: parseInt(parts[i], 10),
        permission: parseInt(parts[i + 1], 10)
      });
    }
    
    return result;
  }

  const addAccountType = async () => {   
	const requestBody = {
                 "clientId":  parseInt(clientId,10),
                 "accessStatus": 1,
                 "accessTypeName": accountType,
                 "landingPage": landingPageId,
                 "access":  parseAccessType(accessType)
               }


        try {
		setLoading(true);
              const encryptedData = await encryptPayload(requestBody, tssguiConf.encryptionKey);
              const response = await fetch(`${url}/tssgui/addAccountType?productId=${productId}&accountGroupId=${accountGroupId}`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'tssgui-tenant-code': localStorage.getItem('tenantCode'),
                },
                body: JSON.stringify({ key: encryptedData.encryptedKey, data: encryptedData.encryptedPayload, iv: encryptedData.iv }),
              });
              if(response.ok){        
	        setLoading(false);
                const resultString = await response.text();
                Log('AccountType','INFO', 'URL : '+`${url}/tssgui/addAccountType`+',Request : '+JSON.stringify(requestBody)+',Response : '+JSON.stringify(resultString));
                const rspObj = JSON.parse(resultString);
                const alertType = rspObj.additionalInfo.alerttype;
                const disp_msg = rspObj.response;
		

                if (alertType == "alert-danger"){
		    showToast('error',disp_msg);
                }
                else{
		    showToast('success',disp_msg);
		    getAccountTypeDetails();
			setDisplayAddPage(true);
			setDisplayModifyPage(false);
			setIsConfirmPswd(true);
                }
		resetAddFields();
		const modal = document.querySelector("#accountTypePreviewModal");
    		if (modal) {
		   modal.classList.remove('show');
		   modal.style.display = 'none';
		   const backdrop = document.querySelector('.modal-backdrop');
		   if (backdrop) {
		      backdrop.remove();
		   }
		}
	      }
	      else {
		infoAlert(t("modules.Generic.alertMsg.add")+" "+t("modules.AccountType.label"));
		setLoading(false);
	      }
	}
	  catch (error) {
	      Log('AccountType','Exception','URL : '+`${url}/tssgui/add/accountType`+',Request : '+JSON.stringify(requestBody)+`,Error adding Account Type . ${error}`);
	      setLoading(false);
        }
  }
  /////////////////   ON CHANGE EVENTS   ///////////////////////////

  const SetPswdInputVal = (event) => {
     setAccountPassword(event.target.value);
     setValidationTheme("formHover");
     setTooltipMessage('');
  }

  ////////////////////    VALIDATIONS   ///////////////////////////
	
  const validateAccountType = (event) => {
        setAccountType(event.target.value);
        if(event.target.value != "" || event.target.value != null) {
        const errorMessage = chkName(event.target.value, minAccountNameLen, maxAccountNameLen, '1', t)
         if(errorMessage) {
          setAccountTypeValidationTheme('formError');
          setAccountTypeErrMsg(errorMessage);
          isValid = false;
        }
        else{
            setAccountTypeValidationTheme("formHover");
            setAccountTypeErrMsg('')
        }

       }
  }

  const changeProduct = (option) => {
	setProduct(option.label);
	setProductId(option.value);
	setAccountGroupKey(prev => prev + 1);    
	setLandingPageKey(prev => prev + 1);
	setIsAccountGroupSel(false);
	setProductValidationTheme("selectHover");
	setProductErrMsg('');
  }

  const changeAccountGroup = (option) => {
	setAccountGroup(option.label);
	setAccountGroupId(option.value);
	setIsAccountGroupSel(true);
	setAccountGroupValidationTheme("selectHover");
	setAccountGroupErrMsg('');
  }

  const changeLandingPage = (option) => {
	setLandingPage(option.label);
	setLandingPageId(option.value);
	setLandingPageValidationTheme("selectHover");
	setLandingPageErrMsg('');
	setLandingPageDefValue(option);
  }
  const [selectedPermissions, setSelectedPermissions] = useState({});

  const accountTypeChange = (moduleId, newValue) => {
        setSelectedPermissions(prevState => ({
            ...prevState,
            [moduleId]: newValue
        }));
  };
  accessType = Object.entries(selectedPermissions).reduce((accessType, [key, value]) => {
        accessType.push(`${key}$${value.reduce((acc, val) => acc + parseInt(val), 0)}`);
        return accessType;
  }, []).join('$');

  ///////////////////////////////////////////////////////////////////////
  const viewAccountTypePreviewModal = (flag) => {
        let isValid = true;
        let errorMessage = ""
        if(accountType != "" || accountType != null) {
            errorMessage = chkName(accountType, minAccountNameLen, maxAccountNameLen, '1', t)
            if(errorMessage) {
                setAccountTypeValidationTheme('formError');
                setAccountTypeErrMsg(errorMessage);
                isValid = false;
            }           
        }
	else if(accountType === "" || accountType === null) {
            setAccountTypeValidationTheme('formError');
            setAccountTypeErrMsg(t("modules.Generic.errorMsg.mandatory"));
            isValid = false;
        }
        
        if(product == "" || product == null) {
            setProductValidationTheme('selectFormError');
	    setProductErrMsg(t("modules.Generic.errorMsg.mandatory"));
            isValid = false;
        }
	else {
	    setProductValidationTheme('selectHover');
	    setProductErrMsg('');
	}

        if(accountGroup == "" || accountGroup == null) {
            setAccountGroupValidationTheme('selectFormError');
            setAccountGroupErrMsg(t("modules.Generic.errorMsg.mandatory"));
            isValid = false;
        } else {
	  setAccountGroupValidationTheme('selectHover');
	  setAccountGroupErrMsg('');
	  if(accessType == "" && flag === "add") {
		infoAlert(t("modules.AccountType.addAndModifyPage.validation.moduleMandatory"));
		isValid = false;
	  } 
  	  else if(modAccessType == "" && flag === "mod") {
		infoAlert(t("modules.AccountType.addAndModifyPage.validation.moduleMandatory"));
		isValid = false;
	  }
	}
        if(landingPage == ""  || landingPage == null) {
            setLandingPageValidationTheme('selectFormError');
            setLandingPageErrMsg(t("modules.Generic.errorMsg.mandatory"));
            isValid = false;
        }
        setOpenModal(isValid)
  }
    ///////////////////////////////////////////////////////////////////////

    const [deleteValidationTheme, setDeleteValidationTheme] = useState('form')
    const [deleteTooltipMessage, setDeleteTooltipMessage] = useState('')


    ///////////////////////////////////////////////////////////////////////
    const [accountTypeToBeDeleted, setAccountTypeToBeDeleted] = useState('')
    const [accountTypeIdToBeDeleted, setAccountTypeIdToBeDeleted] = useState('')
    const [accountTypePdtToBeDeleted, setAccountTypePdtToBeDeleted] = useState('')
    const [deletePassword, setDeletePassword] = useState('')

    const showDeleteAccountTypeModal = (accountTypeDet) => {
        cancel();
        const { accountTypeId, accountType, productId } = accountTypeDet;

        setAccountTypeIdToBeDeleted(accountTypeId);
        setAccountTypeToBeDeleted(accountType);
        setAccountTypePdtToBeDeleted(productId);
    }
    //////////////////////////////////////////////////////////////////////////
    const validateDeletePassword = (event) => {
        setDeletePassword(event.target.value);
        setDeleteValidationTheme("formHover");
        setDeleteTooltipMessage("");
    }

    const deleteAccountType = async(delAccountTypeId, delProductId, delAccountTypeName) => {
        if(deletePassword === "")   {
                setDeleteValidationTheme("formError");
                setDeleteTooltipMessage(t("modules.AccountType.deletePage.validation.pswdMandatory"));
        }
        else{
            try {
                const encryptedData = await encryptPayload({ password: deletePassword, accountId: clientId, accountName: localStorage.getItem("username") }, tssguiConf.encryptionKey);
                const response = await fetch(`${url}/tssgui/confirmAccountPassword?key=${encodeURIComponent(encryptedData.encryptedKey)}&data=${encodeURIComponent(encryptedData.encryptedPayload)}&iv=${encodeURIComponent(encryptedData.iv)}`, { headers: { 'tssgui-tenant-code': localStorage.getItem('tenantCode') } });
                if (!response.ok) {
                    throw new Error(`URL : ${url}/tssgui/confirmAccountPassword?password=${deletePassword}&accountId=${clientId}&accountName=${localStorage.getItem("username")}`+',Failed to fetch data');
                }
                const data = await response.json();
                Log('AccountType','INFO', 'URL : '+`${url}/tssgui/confirmAccountPassword?password=${deletePassword}`+',Response : '+data);
                if (data.additionalInfo.result == 1){
                    try{
                        setDeleteTooltipMessage('')
                        setDeleteValidationTheme('form')
			setLoading(true);
                        const encryptedDelData = await encryptPayload({ accountTypeId: delAccountTypeId, productId: delProductId, clientId, accountGroupId }, tssguiConf.encryptionKey);
                        const response = await fetch(`${url}/tssgui/deleteAccountType?key=${encodeURIComponent(encryptedDelData.encryptedKey)}&data=${encodeURIComponent(encryptedDelData.encryptedPayload)}&iv=${encodeURIComponent(encryptedDelData.iv)}`, {
                            method: 'DELETE',
                            headers: { 'tssgui-tenant-code': localStorage.getItem('tenantCode') },
                        });
                        if (!response.ok) {
			                     setLoading(false);
                        }
                        if(response.ok){
			    setLoading(false);
                            const resultString = await response.text();
                	    Log('AccountType','INFO', 'URL : '+`${url}/tssgui/deleteAccountType?accountTypeId=${delAccountTypeId}&productId=${delProductId}&clientId=${clientId}`+',Response : '+JSON.stringify(resultString));
                            const responseObject = JSON.parse(resultString);
                            const alerttype = responseObject.additionalInfo.alerttype;
                            const disp_msg = responseObject.response;
                            if (alerttype == "alert-danger"){
				showToast('error',disp_msg);
                            }
                            else{
				showToast('success',disp_msg);
				getAccountTypeDetails();
                            }
	                    const modal = document.querySelector("#accountTypeDeleteModal");
	                    if (modal) {
                   	      modal.classList.remove('show');
                   	      modal.style.display = 'none';
                   	      const backdrop = document.querySelector('.modal-backdrop');
                   	      if (backdrop) {
                      		backdrop.remove();
                   	      }
                	    }

                        }
			cancel();
                    }
                    catch (error) {
		        Log('AccountType','Exception','URL : '+`${url}/tssgui/deleteAccountType?accountTypeId=${delAccountTypeId}&productId=${delProductId}&clientId=${clientId}&clientIp=${clientIp}&sessionId=${sessionId}`+`,Error deleting account Type ${delAccountTypeName}. ${error}`);
			setLoading(false);
                    }
                }
                else {
                    setDeleteValidationTheme("formError");
                    setDeleteTooltipMessage(t("modules.AccountType.deletePage.validation.invalidPswd"));
                }
            } catch (error) {
		 Log('AccountType','Exception',`Error deleting account Type ${delAccountTypeName}. ${error}`);
            }
        }
    }
    const cancel = () => {
        setDeletePassword('');
        setDeleteValidationTheme('form')
        setDeleteTooltipMessage('')
    }

    ////////////////////////////////////////////////////////////////////
    var modAccessType = "";
      const AccountTypeModifyDetails = {
        accountTypeId,
        accountType,
        productId,
        product,
        accountGroupId,
        accountGroup,
        landingPage,
        modAccessType
      };

  //     const showAccountTypeModifyPage = async (accountTypeDetails) => {
  // 	resetModifyFields();
  // 	const { accountTypeId, productId, accountGroupId, product, accountType, accountGroup, landingPage, landingPageId } = accountTypeDetails;
  // 	setProductId(productId);
  // 	setProduct(product);
  // 	setAccountTypeId(accountTypeId);
  // 	setAccountType(accountType);
  // 	setAccountGroupId(accountGroupId);
  // 	setAccountGroup(accountGroup);
  // 	setLandingPage(landingPage);
  // 	setLandingPageId(landingPageId);
  //         setProductDefValue({value: productId, label: product});	
  // 	setAccountGroupDefValue({value:accountGroupId, label:accountGroup});
  // 	setLandingPageDefValue({value:landingPageId, label:landingPage});
  // 	try {
  //             const encryptedData = await encryptPayload({ productId, groupId: accountGroupId, accessType: accountTypeId }, tssguiConf.encryptionKey);
  //             const response = await fetch(`${url}/tssgui/getModulesSubmodules?key=${encodeURIComponent(encryptedData.encryptedKey)}&data=${encodeURIComponent(encryptedData.encryptedPayload)}&iv=${encodeURIComponent(encryptedData.iv)}`, { headers: { 'tssgui-tenant-code': localStorage.getItem('tenantCode') } });
  //             if (!response.ok) {
  //                 throw new Error(`${url}/tssgui/getModulesSubmodules?productId=${productId}&groupId=${accountGroupId}&accessType=${accountTypeId}, Failed to fetch data: ${response.status} ${response.statusText}`);
  //             }
  //             const jsonData = await response.json();
  //             Log('AccountType','INFO', 'URL : '+`${url}/tssgui/getModulesSubmodules?productId=${productId}&groupId=${accountGroupId}&accessType=${accountTypeId}`+',Data fetched successfully, Response : '+JSON.stringify(jsonData));
  //           /*onst data = jsonData.module.map((item) =>
  //           ({
  //                   moduleName: item.alias,
  //                   moduleId: item.moduleId,
  //                   submodules: item.submodules.map((submodule) => ({
  //                           modulePid: submodule.modulePid,
  //                           moduleId: submodule.moduleId,
  //                           linkPath: submodule.linkPath,
  //                           permission: submodule.conformedPermission,
  //                           selPermission: submodule.selectedPermission
  //                   }))
  //           }));*/


  // 	  const modulesById = {};
  // const childrenByParentId = {};

  // jsonData.forEach(module => {
  //   modulesById[module.moduleId] = module;
  //   if (!childrenByParentId[module.modulePid]) {
  //     childrenByParentId[module.modulePid] = [];
  //   }
  //   childrenByParentId[module.modulePid].push(module);
  // });

  // function buildTree(parentId) {
  //   const children = childrenByParentId[parentId] || [];
  //   return children.map(module => ({
  //     moduleName: module.modulePathHierarchy,
  //     moduleId: module.moduleId,
  //     linkPath: module.modulePathHierarchy,
  //     moduleLevel: module.moduleLevel,
  //     permission: module.confirmedPermission,
  //     selPermission: module.selectedPermission,
  //     submodules: buildTree(module.moduleId) // Recursively get children
  //   }));
  // }


  //       const data = buildTree(0);

  //           setModifyModuleList(data); // Update state with fetched data


  //         } catch (error) {
  //             Log('AccountType','Exception',`${error}`);
  //         }
  //         setIsAccountGroupSel(true);	
  // 	setDisplayModifyPage(true);
  // 	setDisplayAddPage(false);
  //   }


  const showAccountTypeModifyPage = async (accountTypeDetails) => {
      resetModifyFields();
      const { accountTypeId, productId, accountGroupId, product, accountType, accountGroup, landingPage, landingPageId } = accountTypeDetails;
      
      setProductId(productId);
      setProduct(product);
      setAccountTypeId(accountTypeId);
      setAccountType(accountType);
      setAccountGroupId(accountGroupId);
      setAccountGroup(accountGroup);
      setLandingPage(landingPage);
      setLandingPageId(landingPageId);
      setProductDefValue({value: productId, label: product});	
      setAccountGroupDefValue({value: accountGroupId, label: accountGroup});
      setLandingPageDefValue({value: landingPageId, label: landingPage});
      
      try {
          const encryptedData = await encryptPayload({ 
              productId, 
              groupId: accountGroupId, 
              accessType: accountTypeId,
              clientId,
          }, tssguiConf.encryptionKey);
          
          const response = await fetch(`${url}/tssgui/getModulesSubmodules?key=${encodeURIComponent(encryptedData.encryptedKey)}&data=${encodeURIComponent(encryptedData.encryptedPayload)}&iv=${encodeURIComponent(encryptedData.iv)}`, 
          { headers: { 'tssgui-tenant-code': localStorage.getItem('tenantCode') } });
          
          if (!response.ok) {
              throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
          }
          
          const jsonData = await response.json();
          
          // Validate data
          if (!Array.isArray(jsonData)) {
              throw new Error('Invalid response format: expected array');
          }
          
          Log('AccountType', 'INFO', `Data fetched successfully, Response: ${JSON.stringify(jsonData)}`);
          
          const modulesById = {};
          const childrenByParentId = {};
          
          jsonData.forEach(module => {
              modulesById[module.moduleId] = module;
              if (!childrenByParentId[module.modulePid]) {
                  childrenByParentId[module.modulePid] = [];
              }
              childrenByParentId[module.modulePid].push(module);
          });
          
          const buildTree = (parentId, depth = 0) => {
              if (depth > 100) return []; // Prevent infinite recursion
              const children = childrenByParentId[parentId] || [];
              return children.map(module => ({
                  moduleName: module.modulePathHierarchy,
                  moduleId: module.moduleId,
                  linkPath: module.modulePathHierarchy,
                  moduleLevel: module.moduleLevel,
                  permission: module.confirmedPermission,
                  selPermission: module.selectedPermission,
                  submodules: buildTree(module.moduleId, depth + 1)
              }));
          };
          
          const data = buildTree(0);
          setModifyModuleList(data);
          
      } catch (error) {
          Log('AccountType', 'Exception', error.message || error);
          console.error('Error in showAccountTypeModifyPage:', error);
      }
      
      setIsAccountGroupSel(true);	
      setDisplayModifyPage(true);
      setDisplayAddPage(false);
  };
/////////////////////////////////////////////////////////////////////////////////
  const [modSelectedPermissions, setModSelectedPermissions] = useState({});

  /*const modAccountTypeChange = (moduleId, newValue) => {
	
        setModSelectedPermissions(prevState => ({
            ...prevState,
            [moduleId]: newValue
        }));
  };*/
  const modAccountTypeChange = (moduleId, newValue) => {
    setModSelectedPermissions(prevState => {
        // Create a copy of the previous state
        const updatedState = { ...prevState };
        // If newValue is 0, remove the moduleId property from the state
        if (newValue === 0 || newValue == "" || newValue === null) {
             updatedState[moduleId];
        } else {
            // Otherwise, update the moduleId with the new value
            updatedState[moduleId] = newValue;
        }
        return updatedState;
    });
  };

  modAccessType = Object.entries(modSelectedPermissions).reduce((modAccessType, [key, value]) => {
	modAccessType.push(`${key}$${value.reduce((acc, val) => acc + parseInt(val), 0)}`);
        return modAccessType;
  }, []).join('$');


  ////////////////////////////////////////////////////////////////////////

  const modifyAccountType = async () => {      
            const requestBody = {  
                 "clientId":  parseInt(clientId,10), 
                 "accessStatus": 1,  
                 "accessTypeName": accountType,
                 "landingPage": landingPageId,
		             "accessType": parseAccessType(modAccessType)
               }
               try {
	 	//setLoading(true);
              const encryptedData = await encryptPayload(requestBody, tssguiConf.encryptionKey);
              const response = await fetch(`${url}/tssgui/modifyAccountType?productId=${productId}&accountGroupId=${accountGroupId}&accountTypeId=${accountTypeId}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  'tssgui-tenant-code': localStorage.getItem('tenantCode'),
                },
                body: JSON.stringify({ key: encryptedData.encryptedKey, data: encryptedData.encryptedPayload, iv: encryptedData.iv }),
              });
              if(response.ok){        
	        //setLoading(false);
                const resultString = await response.text();
                Log('AccountType','INFO', 'URL : '+`${url}/tssgui/modify/accountType`+',Request : '+JSON.stringify(requestBody)+',Response : '+JSON.stringify(resultString));
                const rspObj = JSON.parse(resultString);
                const alertType = rspObj.additionalInfo.alerttype;
                const disp_msg = rspObj.response;

                if (alertType === "alert-danger"){
		    showToast('error',disp_msg);
                }
                else{
		    showToast('success',disp_msg);
                }
		const modal = document.querySelector("#accountTypePreviewModal");
    		if (modal) {
		   modal.classList.remove('show');
		   modal.style.display = 'none';
		   const backdrop = document.querySelector('.modal-backdrop');
		   if (backdrop) {
		      backdrop.remove();
		   }
		}
	      }
	      else {
		infoAlert(t("modules.Generic.alertMsg.modify")+" "+t("modules.AccountType.label"));
		//setLoading("false");
	      }
	}
	  catch (error) {
             Log('AccountType','Exception','URL : '+`${url}/tssgui/modify/accountType`+',Request : '+JSON.stringify(requestBody)+`,Error modifying account Type. ${error}`);
	     //setLoading(false);
        }
  }

    //////////////////////////////////////////////////////////////////

    const resetAddFields = () =>{
        setAccountType('');
        setProduct('');
        setAccountGroup('');
        setLandingPage('');
	setIsAccountGroupSel(false);
        setSelectedPermissions({});
	setAccountTypeValidationTheme("formHover");
	setAccountTypeErrMsg('');
	setProductValidationTheme("selectHover");
	setProductErrMsg('');
	setAccountGroupValidationTheme("selectHover");
	setAccountGroupErrMsg('');
	setLandingPageValidationTheme("selectHover");
	setLandingPageErrMsg('');
    }
    const resetModifyFields = () =>{
        //showAccountTypeModifyPage(accountTypeDetails);
        setDisplayModifyPage(false);
        setAccountType('');
        setAccountTypeId('');
        setProduct('');
        setProductId('');
        setAccountGroup('');
        setAccountGroupId('');
        setLandingPage('');
        setLandingPageId('');
	setIsAccountGroupSel(false);
        setModSelectedPermissions({});
    }

  return (
    <>
      {/* <ContentHeader title={t("modules.AccountType.label")} /> */}

      {modulePermission != "0" &&(
      <>
      {loading && (<TssSpinner isLoading={loading} />)}
      {!loading &&(
       <>
      { displayAddPage && (!isConfirmPswd ? (
        <ConfirmPswd  LoadCreateAccountType = {LoadCreateAccountType} 
	      	      SetPswdInputVal = {SetPswdInputVal}
                      validationTheme = {validationTheme}
                      tooltipMessage = {tooltipMessage} />
            ) :
             (<AccountTypeCreate closeAddPage = {handleClose} 
		     		 addData = {addData} 
		                
		     		 ValidateAccountType = {validateAccountType}
		     		 AccountTypeErrMsg = {accountTypeErrMsg}
		     		 AccountTypeValidationTheme= {accountTypeValidationTheme} 
		     		 ProductErrMsg = {productErrMsg}
		     		 ProductValidationTheme = {productValidationTheme}
		     		 AccountGroupErrMsg = {accountGroupErrMsg}
		     		 AccountGroupValidationTheme = {accountGroupValidationTheme}
		     		 AccountGroupKey = {accountGroupKey}
		     		 LandingPageErrMsg = {landingPageErrMsg}
		     		 LandingPageValidationTheme = {landingPageValidationTheme}
		     		 LandingPageKey = {landingPageKey}
		     	
		     		 ChangeProduct = {changeProduct}
		     		 ChangeAccountGroup = {changeAccountGroup}
		     		 isAccountGroupSel = {isAccountGroupSel}
		     		 ChangeLandingPage = {changeLandingPage}
						     		
		     		 ProductList = {pdtList}
		     		 AccountGroupList = {accountGroupList}
		     		 LandingPageList = {landingPageList}
		     		 ModuleList = {moduleList}
		     		 PermissionList = {permissionList}
		     		 AccountTypeChange={accountTypeChange}
				 AccountTypeDetails = {AccountTypeDetails}
		      		 ShowPreviewModal = {viewAccountTypePreviewModal}
				 OpenModal = {openModal}
		     		 ModuleAccessTypes = {selectedPermissions}
		     		 AddAccountType = {addAccountType}/>
  
        )
      )}
      { displayModifyPage && (
	      <>
             <AccountTypeModify  modifyData = {modifyData} 
		                
		     		 ValidateAccountType = {validateAccountType}
		     		 AccountTypeErrMsg = {accountTypeErrMsg}
		     		 AccountTypeValidationTheme= {accountTypeValidationTheme} 
		     		 ProductErrMsg = {productErrMsg}
		     		 ProductValidationTheme = {productValidationTheme}
	      			 ProductDefValue = {productDefValue}
		     		 AccountGroupErrMsg = {accountGroupErrMsg}
		     		 AccountGroupValidationTheme = {accountGroupValidationTheme}
	      			 AccountGroupDefValue = {accountGroupDefValue}
		     		 LandingPageErrMsg = {landingPageErrMsg}
		     		 LandingPageValidationTheme = {landingPageValidationTheme}
	      			 LandingPageDefValue = {landingPageDefValue}
		     	
		     		 ChangeProduct = {changeProduct}
		     		 ChangeAccountGroup = {changeAccountGroup}
		     		 isAccountGroupSel = {isAccountGroupSel}
		     		 ChangeLandingPage = {changeLandingPage}
						     		
		     		 ProductList = {pdtList}
		     		 AccountGroupList = {accountGroupList}
		     		 LandingPageList = {landingPageList}
		     		 ModuleList = {modifyModuleList}
		     		 PermissionList = {permissionList}
		     		 AccountTypeChange={modAccountTypeChange}
				 AccountTypeDetails = {AccountTypeModifyDetails}
		      		 ShowPreviewModal = {viewAccountTypePreviewModal}
				 OpenModal = {openModal}
		     		 ModuleAccessTypes = {modSelectedPermissions}
		     		 ModifyAccountType = {modifyAccountType}
	      			 CloseModifyPage = {closeModifyPage} 
	               		 ModulePermission= {modulePermission}
               />
	      </>
      )}
      <AccountTypeView LoadAddPage = {handleClick} 
	  	       deleteRow = {deleteRow}
	               AccountTypes = {accountTypes}
	      	       GetAccountTypeDetails = {getAccountTypeDetails}
	  	       ShowAccountTypeModifyPage ={showAccountTypeModifyPage}
	  	       ShowDeleteAccountTypeModal = {showDeleteAccountTypeModal}
	  	       AccountTypeToBeDeleted = {accountTypeToBeDeleted}
	  	       AccountTypePdtToBeDeleted = {accountTypePdtToBeDeleted}
	  	       AccountTypeIdToBeDeleted = {accountTypeIdToBeDeleted}
	      	       Cancel = {cancel}
	               DeleteValidationTheme = {deleteValidationTheme}
	  	       DeleteTooltipMessage = {deleteTooltipMessage}
	  	       DeletePassword = {validateDeletePassword}
	      	       ResetDeletePassword = {deletePassword}
	  	       DeleteAccountType = {deleteAccountType}
	               ModulePermission= {modulePermission}
	  />
    </>
   )}
   </>
   )}

   </>
  );
};

export default AccountTypeMain;
