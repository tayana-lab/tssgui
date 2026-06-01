import React,{useState, useEffect, useRef} from 'react';
import { useTranslation } from 'react-i18next';
import {infoAlert} from '@app/modules/common/default/components/TssFunction';
import { chkDateWithTimeWithDateFormat }  from '@app/modules/common/default/components/TssFunction';
import { validateFromDateTimeAndToDateTimeWithDateFormat }  from '@app/modules/common/default/components/TssFunction';
import moment from 'moment';
import Log from '@app/modules/common/default/components/TssGUILog.js'
import encryptPayload from '@app/modules/common/default/js/encryptPayload.js';
import tssguiConf from '@modules/conf/TssGui.json';
import AuditTrackerView from '@modules/admin/AuditTrackerView';
import { useLogout } from '@app/modules/common/default/utils/oidc-providers';
import TssSpinner from '@app/modules/common/default/components/TssSpinner';

let clientId,clientIp,sessionId,serverIp,clientName,productId;

const AuditTrackerMain = () => {

  const [t]                  = useTranslation();
  const logOut               = useLogout();
  const url                  = tssguiConf.SERVER_JS_API_URI;
  const tssguiDateFormat     = tssguiConf.DATE_FORMAT;
  const tssguiTimeFormat     = tssguiConf.DATETIME_FORMAT;
  const pageModuleId         = 1200;
  const prodId               = tssguiConf.PRODUCT_ID;
	
  const [modulePermission, setModulePermission] = useState(0);   
  const [accountList,setAccountList]               = useState([]);
  const [auditTrackerList, setAuditTrackerList]    = useState([]);
  const [eventList, setEventList]                  = useState([]);

  const dateFormat = tssguiDateFormat+' '+tssguiTimeFormat;
  const formattedDate = moment(new Date()).format(tssguiDateFormat);
  const [fDate, setFDate] = useState(formattedDate+' 00:00:00');
  const [tDate, setTDate] = useState(formattedDate+' 23:59:59');
  const [modifiedAccountId, setModifiedAccountId] = useState('-1');
  const [eventId, setEventId] = useState('-2');
  const [modifiedAccount,setModifiedAccount] = useState({label: 'All', value: -1 });
  const [event,setEvent] = useState({label: 'All', value: -2 }); 
  const [showAuditDetails,setShowAuditDetails] = useState(true);
  const [fDateValidate, setFDateValidate] = useState(true);   

  const [product, setProduct] = useState({label: 'All', value: -1 });
  const [productList, setProductList] = useState([]);

 ///////////////   Set Value         //////////////////////
 //
 const changeProduct = (event) => {
setProduct(event)
setShowAuditDetails(false);
setModifiedAccountId(-1)
}

  const changeAccount = (option) => {
        setModifiedAccountId(option.value);
	setShowAuditDetails(false);
  }

  const changeEvent = (option) => {
        setEventId(option.value);
	setShowAuditDetails(false);
  }
  
  const changeFDate = (selectedDate) => {
        setFDate(moment(selectedDate).format(dateFormat));
	setShowAuditDetails(false);
	// validateFDate(fDate);
  }

  const validateFDate = (fDate) => {
     const errorMessage = chkDateWithTimeWithDateFormat(fDate,t("modules.tracker.filter.fDate"),dateFormat,t);
     if(errorMessage) {
       infoAlert(errorMessage);
       setFDateValidate(false);
       setShowAuditDetails(false);
     }
  }

  const changeTDate = (selectedDate) => {
        setTDate(moment(selectedDate).format(dateFormat));
	setShowAuditDetails(false);
	// validateTDate(fDate,tDate);
  }

  const validateTDate = (fDate,tDate) => {
	const errorMessage = chkDateWithTimeWithDateFormat(tDate,t("modules.tracker.filter.tDate"),dateFormat,t);
	if(errorMessage) {
	  infoAlert(errorMessage);
          setShowAuditDetails(false);
 	}
	if(fDateValidate)
	{
	  const errorMessage = validateFromDateTimeAndToDateTimeWithDateFormat(fDate,"From Date",tDate,"To Date",dateFormat,t);
          if(errorMessage) {
             infoAlert(errorMessage);
             setShowAuditDetails(false);
	  }
        }
  }

    const changeTimeRange = (flag) => {
        let fromDate = fDate;
        let toDate = tDate;
        switch (flag) {
            case 1:
                fromDate = moment().subtract(1, 'hour').toDate();
                toDate = moment().toDate();
                break;
            case 2:
                fromDate = moment().subtract(6, 'hour').toDate();
                toDate = moment().toDate();
                break;
            case 3:
                fromDate = moment().startOf('day').toDate();
                toDate = moment().toDate();
                break;
            case 4:
                fromDate = moment().subtract(1, 'days').startOf('day').toDate();
                toDate = moment().subtract(1, 'days').endOf('day').toDate();
                break;
            case 5:
                fromDate = moment().subtract(6, 'days').startOf('day').toDate();
                toDate = moment().toDate();
                break;
            case 6:
                fromDate = moment().subtract(29, 'days').startOf('day').toDate();
                toDate = moment().toDate();
                break;
            case 7:
                fromDate = moment().startOf('month').toDate();
                toDate = moment().toDate();
                break;
            default:
                return;
        }
        setFDate(moment(fromDate).format(dateFormat));
        setTDate(moment(toDate).format(dateFormat));
	setShowAuditDetails(false);
    };
   ///////////////   API Integration   //////////////////////
    useEffect(() => {
         clientId   = localStorage.getItem("acctID");
         clientIp   = localStorage.getItem("clientIP");
         sessionId  = localStorage.getItem("sessionID");
         serverIp   = localStorage.getItem("serverIP");
         clientName = localStorage.getItem("acctName")
         productId  = parseInt(localStorage.getItem("productID"),10)
    },[]);

    useEffect(() => {
        const fetchAccessData = async () => {
            try {
                const encryptedData = await encryptPayload({ productId, clientId, moduleId: pageModuleId, clientIp, sessionId , tenantCode: localStorage.getItem("tenantCode")}, tssguiConf.encryptionKey);
                const response = await fetch(`${url}/tssgui/checkAccess?key=${encodeURIComponent(encryptedData.encryptedKey)}&data=${encodeURIComponent(encryptedData.encryptedPayload)}&iv=${encodeURIComponent(encryptedData.iv)}`, { headers: { 'tssgui-tenant-code': localStorage.getItem('tenantCode') } });
                if (!response.ok) {
                    throw new Error(t("modules.Generic.errorMsg.failed"));
                }
                const data = await response.text();
                const responseObject = JSON.parse(data);
                const permission = responseObject.permission;
                if(permission == 0){
                  logOut();
                }
                setModulePermission(permission);
                Log('Audit-System','INFO','URL : '+`${url}/tssgui/checkAccess?productId=${productId}&clientId=${clientId}&moduleId=${pageModuleId}&clientIp=${clientIp}&sessionId=${sessionId}`+',Data fetched successfully, Response : '+ JSON.stringify(data));
            } catch (error) {
                Log('Audit-System','Exception',`Error fetching data: ${error}`);
            }
        };
        fetchAccessData();
    }, []);

    ////////////////////////////////////////////////////////////////////////////////////

     useEffect(() => {
    const fetchProductList = async () => {
     try {
      const encryptedData = await encryptPayload({ acctId: clientId }, tssguiConf.encryptionKey);
      const response = await fetch(`${url}/productDetails?key=${encodeURIComponent(encryptedData.encryptedKey)}&data=${encodeURIComponent(encryptedData.encryptedPayload)}&iv=${encodeURIComponent(encryptedData.iv)}`, { headers: { 'tssgui-tenant-code': localStorage.getItem('tenantCode') } });
      if (!response.ok) {
        throw new Error('Failed to fetch Details');
      }
      const jsonData = await response.json();
      const data = jsonData.map((product) => ({ label: product.productName, value: product.productId }));
      const updatedData = [{ label: 'All', value: -1 }, ...data];
      Log('Audit-System','INFO','URL : '+url+',Data fetched successfully, Response: '+JSON.stringify(updatedData));
      setProductList(updatedData); // Update state with fetched data 
     } catch (error) {
       Log('Audit-System','Exception',`Error fetching data: ${error}`);
     }
    };
        fetchProductList();
    }, []);
    ///////////////////////////////////////////////////////////////////////////////////
   
    useEffect(() => {
    const fetchAccountList = async () => {
     try {
      const encryptedData = await encryptPayload({ productId: prodId == 0 ? product?.value : productId, acctId: clientId }, tssguiConf.encryptionKey);
      const response = await fetch(`${url}/tssgui/getAccountList?key=${encodeURIComponent(encryptedData.encryptedKey)}&data=${encodeURIComponent(encryptedData.encryptedPayload)}&iv=${encodeURIComponent(encryptedData.iv)}`, { headers: { 'tssgui-tenant-code': localStorage.getItem('tenantCode') } });
      if (!response.ok) {
        throw new Error('Failed to fetch Details');
      }
      const jsonData = await response.json();
      const data = jsonData.map((item) => ({ label: item.displayName+"("+item.accountName+")", value: item.accountId }));
      const updatedData = [{ label: 'All', value: -1 }, ...data];
      Log('Audit-System','INFO','URL : '+url+',Data fetched successfully, Response: '+JSON.stringify(updatedData));
      setAccountList(updatedData); // Update state with fetched data
     } catch (error) {
       Log('Audit-System','Exception',`Error fetching data: ${error}`);
     }
    };
	fetchAccountList();
    }, []);
   
    useEffect(() => {
    const fetchEventList = async () => {
     try {
      const response = await fetch(`${url}/tssgui/getAuditEvents`, { headers: { 'tssgui-tenant-code': localStorage.getItem('tenantCode') } });
      if (!response.ok) {
        throw new Error('Failed to fetch Details');
      }
      const jsonData = await response.json();
      const data = jsonData.map((item) => ({ label: item.eventName, value: item.eventId }));
      const updatedData = [{ label: 'All', value: -2 }, ...data];

      Log('Audit-System','INFO','URL : '+url+',Data fetched successfully, Response: '+JSON.stringify(updatedData));
      setEventList(updatedData); // Update state with fetched data
     } catch (error) {
       Log('Audit-System','Exception',`Error fetching data: ${error}`);
     }
    };
      fetchEventList();
    }, []);

    useEffect(() => {
        getAuditTrackerDetails();
    }, []);

        const getAuditTrackerDetails = async () => {
		setShowAuditDetails(true);
	    validateFDate(fDate);
	    validateTDate(fDate,tDate);
            try {
                const encryptedData = await encryptPayload({ dateFormat, fDate, tDate, acctId: modifiedAccountId, eventId, productId: prodId == 0 ? product?.value : productId }, tssguiConf.encryptionKey);
                const response = await fetch(`${url}/tssgui/systemAudit?key=${encodeURIComponent(encryptedData.encryptedKey)}&data=${encodeURIComponent(encryptedData.encryptedPayload)}&iv=${encodeURIComponent(encryptedData.iv)}`, { headers: { 'tssgui-tenant-code': localStorage.getItem('tenantCode') } });

              if (!response.ok) {
                    throw new Error(t("modules.Generic.errorMsg.failed"));
                }
                const data = await response.json();
                
                setAuditTrackerList(data);
		// if(data.length > 1000) {
		//   showToast('warning',t("modules.tracker.auditTracker.validation.searchAlert"));
		// }
 	        Log('Audit-System','INFO','URL : '+`${url}/tssgui/get/audit/details?dateFormat=${dateFormat}&fDate=${fDate}&tDate=${tDate}&acctId=${modifiedAccountId}&eventId=${eventId}`+',Data fetched successfully');
            } catch (error) {
                Log('Audit-System','Exception',`Error fetching data: ${error}`);
            }
        };
  ///////////////////////////////////////////////////////////////////////////

    // useEffect(() => {
    //     const defAccount = accountList.find(option => option.value === modifiedAccountId);
    //     if (defAccount) {
    //         setModifiedAccount(defAccount);
    //     }
    // }, [accountList]);

    useEffect(() => {
      const defAccount = accountList.find(option => option.value == modifiedAccountId);
      if (defAccount) {
          setModifiedAccount(defAccount);
      }
  }, [accountList,modifiedAccountId]);

    // useEffect(() => {
    //     const defEvent = eventList.find(option => option.value === eventId);
    //     if (defEvent) {
    //         setEvent(defEvent);
    //     }
    // }, [accountList]);

    useEffect(() => {
      const defEvent = eventList.find(option => option.value == eventId);
      if (defEvent) {
          setEvent(defEvent);
      }
  }, [accountList,eventId]);



  return (
   <>
   {modulePermission == 0 && <TssSpinner isLoading={true} />} 
   {modulePermission != 0 &&(
    <div>
      
      <AuditTrackerView AuditTrackerList = {auditTrackerList}
                        ProductList = {productList}
                        Product ={product}
                        ChangeProduct = {changeProduct}
	  		AccountList = {accountList}
	  		EventList = {eventList}
	  		ChangeAccount = {changeAccount}
	  		ChangeEvent = {changeEvent}
	  		ChangeFDate = {changeFDate}
	  		ChangeTDate = {changeTDate}
	  		ModifiedAccount = {modifiedAccount}
	  		Event = {event}
	  		FDate = {fDate}
	  		TDate = {tDate}
	  		GetAuditTrackerDetails = {getAuditTrackerDetails}
	  		ShowAuditDetails = {showAuditDetails}
	   		ChangeTime = {changeTimeRange}
      />
    </div>
   )}
     
  </>
  );
};

export default AuditTrackerMain;



//prdId == 0 ? product?.value :
