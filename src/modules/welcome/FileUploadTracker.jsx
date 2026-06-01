import React,{useState, useEffect, useRef} from 'react';
import { useTranslation } from 'react-i18next';
import {infoAlert} from '@app/modules/common/default/components/TssFunction';
import { chkDateWithTimeWithDateFormat }  from '@app/modules/common/default/components/TssFunction';
import { validateFromDateTimeAndToDateTimeWithDateFormat }  from '@app/modules/common/default/components/TssFunction';
import moment from 'moment';
import Log from '@app/modules/common/default/components/TssGUILog.js'
import tssguiConf from '@modules/conf/TssGui.json';
import FileUploadTrackerView from '@modules/welcome/FileUploadTrackerView';
import { useLogout } from '@app/modules/common/default/utils/oidc-providers';
import TssSpinner from '@app/modules/common/default/components/TssSpinner';

let clientId,clientIp,sessionId,serverIp,clientName,productId,tenantCode;

const FileUploadTracker = () => {

  const [t]                  = useTranslation();
  const logOut               = useLogout();
  const url                  = tssguiConf.SERVER_JS_API_URI;
  const tssguiDateFormat     = tssguiConf.DATE_FORMAT;
  const tssguiTimeFormat     = tssguiConf.DATETIME_FORMAT;
  const prodId               = tssguiConf.PRODUCT_ID;
  const [loading, setLoading] 			= useState(false)
	
  const [modulePermission, setModulePermission] = useState(0);   
  const [accountList,setAccountList]               = useState([]);
  const [fileUploadTrackerList, setFileUploadTrackerList]    = useState([]);
  const [eventList, setEventList]                  = useState([]);

  const dateFormat = tssguiDateFormat+' '+tssguiTimeFormat;
  const formattedDate = moment(new Date()).format(tssguiDateFormat);
  const [fDate, setFDate] = useState(formattedDate+' 00:00:00');
  const [tDate, setTDate] = useState(formattedDate+' 23:59:59');
  const [transId,setTransId]               = useState(-1);
  const [showTrackerDetails,setShowTrackerDetails] = useState(true);
  const [fDateValidate, setFDateValidate] = useState(true);   

  const [product, setProduct] = useState({label: 'All', value: -1 });
  const [productList, setProductList] = useState([]);

 ///////////////   Set Value         //////////////////////
 //
  
  const changeFDate = (selectedDate) => {
        setFDate(moment(selectedDate).format(dateFormat));
	setShowTrackerDetails(false);
  }

  const validateFDate = (fDate) => {
     const errorMessage = chkDateWithTimeWithDateFormat(fDate,t("modules.tracker.filter.fDate"),dateFormat,t);
     if(errorMessage) {
       infoAlert(errorMessage);
       setFDateValidate(false);
       setShowTrackerDetails(false);
     }
  }

  const changeTDate = (selectedDate) => {
        setTDate(moment(selectedDate).format(dateFormat));
	setShowTrackerDetails(false);
  }

  const validateTDate = (fDate,tDate) => {
	const errorMessage = chkDateWithTimeWithDateFormat(tDate,t("modules.tracker.filter.tDate"),dateFormat,t);
	if(errorMessage) {
	  infoAlert(errorMessage);
          setShowTrackerDetails(false);
 	}
	if(fDateValidate)
	{
	  const errorMessage = validateFromDateTimeAndToDateTimeWithDateFormat(fDate,"From Date",tDate,"To Date",dateFormat,t);
          if(errorMessage) {
             infoAlert(errorMessage);
             setShowTrackerDetails(false);
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
	setShowTrackerDetails(false);
    };

    const setTxnId = (event) => {
	if(event.target.value == "")
           setTransId(-1);
	else
	   setTransId(event.target.value);
	setShowTrackerDetails(false);
    }

    const handleDownload = async (fileName,downloadFileName) => {

	    // Call your API to download the file
           try {
                const response = await fetch(`${url}/tssgui/downloadFile?fileName=${fileName}&fileStatus=1&tenantCode=${tenantCode}`);

		if (!response.ok) {
			throw new Error(t("modules.Generic.errorMsg.failed"));
		}
		const blob = await response.blob();
		const urlBlob = window.URL.createObjectURL(blob);

		const a = document.createElement('a');
		a.href = urlBlob;
		a.download = downloadFileName;
		document.body.appendChild(a);
		a.click();
		a.remove();

		window.URL.revokeObjectURL(urlBlob);

		Log('FileUploadTracker','INFO','URL : '+`${url}/tssgui/downloadFile?fileName=${fileName}&fileStatus=1&tenantCode=${tenantCode}`+',Data fetched successfully');
	   } catch (error) {
		   Log('FileUploadTracker','Exception',`Error fetching data: ${error}`);
	   }

    };

   ///////////////   API Integration   //////////////////////
    useEffect(() => {
         clientId   = localStorage.getItem("acctID");
         clientIp   = localStorage.getItem("clientIP");
         sessionId  = localStorage.getItem("sessionID");
         serverIp   = localStorage.getItem("serverIP");
         clientName = localStorage.getItem("acctName");
	 tenantCode = localStorage.getItem("tenantCode");
         productId  = parseInt(localStorage.getItem("productID"),10)
    },[]);

    useEffect(() => {
        getFileUploadDetails();
    }, []);

        const getFileUploadDetails = async () => {
		setShowTrackerDetails(true);
	    validateFDate(fDate);
	    validateTDate(fDate,tDate);
            try {
                const response = await fetch(`${url}/tssgui/getFileUploadDetails?transId=${transId}&fromDate=${fDate}&toDate=${tDate}&acctId=${clientId}&productId=${productId}&tenantCode=${tenantCode}`);

	      //setLoading(true);
              if (!response.ok) {
                    throw new Error(t("modules.Generic.errorMsg.failed"));
                }
                const data = await response.json();

                setFileUploadTrackerList(data);
	      //setLoading(false);
                // if(data.length > 1000) {
                //   showToast('warning',t("modules.tracker.auditTracker.validation.searchAlert"));
                // }
                Log('Audit-System','INFO','URL : '+`${url}/tssgui/getFileUploadDetails?transId=${transId}&fromDate=${fDate}&toDate=${tDate}&acctId=${clientId}&productId=${productId}&tenantCode=${tenantCode}`+',Data fetched successfully');
            } catch (error) {
                Log('Audit-System','Exception',`Error fetching data: ${error}`);
            }

        };

  return (
   <>
      {loading && (<TssSpinner isLoading={loading} />)}
      {!loading &&(
       <>
      
        <FileUploadTrackerView FileUploadTrackerList = {fileUploadTrackerList}
	  		ChangeFDate = {changeFDate}
	  		ChangeTDate = {changeTDate}
	  		FDate = {fDate}
	  		TDate = {tDate}
			TransId = {setTxnId}
	  		GetFileUploadDetails = {getFileUploadDetails}
	   		ChangeTime = {changeTimeRange}
			ShowTrackerDetails = {showTrackerDetails}
			handleDownload = {handleDownload}
        />
       </>
      )}  
  </>
  );
};

export default FileUploadTracker;



//prdId == 0 ? product?.value :
