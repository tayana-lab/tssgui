import React, { useState, useEffect }from 'react'
import moment from 'moment';
import ProvTrackerView from '@app/modules/admin/ProvTrackerView'
import Log from '@app/modules/common/default/components/TssGUILog'
import {infoAlert} from '@app/modules/common/default/components/TssFunction';
import conf from '@modules/conf/TssGui.json'
import encryptPayload from '@app/modules/common/default/js/encryptPayload.js';
import { useTranslation } from 'react-i18next';
import { useLogout } from '@app/modules/common/default/utils/oidc-providers';
import TssSpinner from '@app/modules/common/default/components/TssSpinner';



const url = conf.SERVER_JS_API_URI;
let clientID, clientIP, sessionID, clientName, userName, productId;

const moduleId = 1200;
const prodId = conf.PRODUCT_ID

var eventIds = "";

const ProvTrackerMain = () => {
	const [t]= useTranslation();
    const logOut = useLogout();

    const [loading, setLoading] = useState(true);
    const [permission, setPermission] = useState('0')
	const [accountList, setAccountList] = useState([])
	const [provGroupList, setProvGroupList] = useState([])
	const [options, setOptions] = useState([]);
	const [allAccount, setAllAccount] = useState({value: '-1', label:t('modules.tracker.provTracker.label.allOption')})
	const [accountObject, setAccountObject] = useState([])
	const [accountId, setAccountId] = useState('-1')
    const [startDate, setStartDate ] = useState('')
	const [endDate, setEndDate ] = useState('')
	const [provTrackerDetails, setProvTrackerDetails] = useState([])
	const [showTable, setShowtable] = useState(true)
        
        const [product, setProduct] = useState({value: '-1', label:t('modules.tracker.provTracker.label.allOption')});
        const [productList, setProductList] = useState([]);
    //////////////////////////////////////////////////////////////////////////\
    useEffect(()=> {
        setAccountObject(allAccount)  
    },[])

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
                setPermission(permission)
                Log('Audit-Provisioning', 'INFO', 'Data fetched successfully : '+JSON.stringify(data));
            } catch (error) {
                Log('Audit-Provisioning', 'ERROR', 'Error fetching data : '+error);
            }
        };      
        fetchData();
    }, []);

    //////////////////////////////////////////////////////////////////////
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const encryptedData = await encryptPayload({ acctId: clientID }, conf.encryptionKey);
                const response = await fetch(`${url}/productDetails?key=${encodeURIComponent(encryptedData.encryptedKey)}&data=${encodeURIComponent(encryptedData.encryptedPayload)}&iv=${encodeURIComponent(encryptedData.iv)}`, { headers: { 'tssgui-tenant-code': localStorage.getItem('tenantCode') } });
                setLoading(false)
                if (!response.ok) {
                    throw new Error('Error fetching products');
                }
                const data = await response.json();
                const productData  = data.map((product) => ({ label: product.productName, value: product.productId }));
                const updatedProducts = [{value: '-1', label:t('modules.tracker.provTracker.label.allOption')}, ...productData];
                Log('Audit-Provisioning', 'INFO' ,'Fetched Groups:'+JSON.stringify(updatedProducts));
                setProductList(updatedProducts);
            } catch (error) {
                Log('Audit-Provisioning', 'ERROR' ,'Error fetching groups:'+error);
            }
        };

        fetchProducts();
    }, []);
    //////////////////////////////////////////////////////////////////////
	useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const encryptedData = await encryptPayload({ productId: prodId == 0 ? product?.value : productId, acctId: clientID }, conf.encryptionKey);
                const response = await fetch(`${url}/tssgui/getAccountList?key=${encodeURIComponent(encryptedData.encryptedKey)}&data=${encodeURIComponent(encryptedData.encryptedPayload)}&iv=${encodeURIComponent(encryptedData.iv)}`, { headers: { 'tssgui-tenant-code': localStorage.getItem('tenantCode') } });
                setLoading(false)
                if (!response.ok) {
                    throw new Error('Error fetching groups');
                }
                const data = await response.json();
                Log('Audit-Provisioning', 'INFO' ,'Fetched Groups:'+JSON.stringify(data)); 
                setAccountList(data);
            } catch (error) {
                Log('Audit-Provisioning', 'ERROR' ,'Error fetching groups:'+error);
            }
        };

        fetchAccounts();
    }, [product]);
	///////////////////////////////////////////////////////////////////////
	useEffect(() => {
        const fetchGroups = async () => {
            try {
                const encryptedData = await encryptPayload({ productId: prodId == 0 ? product?.value : productId }, conf.encryptionKey);
                const response = await fetch(`${url}/tssgui/getProvGroups?key=${encodeURIComponent(encryptedData.encryptedKey)}&data=${encodeURIComponent(encryptedData.encryptedPayload)}&iv=${encodeURIComponent(encryptedData.iv)}`, { headers: { 'tssgui-tenant-code': localStorage.getItem('tenantCode') } });
                if (!response.ok) {
                    throw new Error('Error fetching groups');
                }
                const data = await response.json();
                Log('Audit-Provisioning', 'INFO' ,'Fetched Groups:'+JSON.stringify(data)); 
                setProvGroupList(data);
            } catch (error) {
                Log('Audit-Provisioning', 'ERROR' ,'Error fetching groups:'+error);
            }
        };

        fetchGroups();
    }, [product]);
    ////////////////////////////////////////////////////////////////////////
    useEffect(() => {
        const fetchEvents = async (groupId) => {
            try {
                const encryptedData = await encryptPayload({ productId: prodId == 0 ? product?.value : productId, groupId }, conf.encryptionKey);
                const response = await fetch(`${url}/tssgui/getProvEvents?key=${encodeURIComponent(encryptedData.encryptedKey)}&data=${encodeURIComponent(encryptedData.encryptedPayload)}&iv=${encodeURIComponent(encryptedData.iv)}`, { headers: { 'tssgui-tenant-code': localStorage.getItem('tenantCode') } });
                if (!response.ok) {
                    throw new Error('Error fetching events');
                }
                const data = await response.json();
                Log('Audit-Provisioning', 'INFO' ,`Fetched Events for group ${groupId}:`+JSON.stringify(data));
                return data;
            } catch (error) {
                Log('Audit-Provisioning', 'ERROR' ,`Error fetching events for group ${groupId}:`+error);
                return [];
            }
        };

        const getOptions = async () => {
            const groupOptions = await Promise.all(provGroupList.map(async (group) => {
                const events = await fetchEvents(group.groupId);
                return {
                    label: group.groupName,
                    options: events.map(event => ({
                        value: event.eventId, 
                        label: event.eventName
                    }))
                };
            }));
            setOptions(groupOptions);
        };

        if (provGroupList.length > 0) {
            getOptions();
        }
    }, [provGroupList]);

    ////////////////////////////////////////////////////////////////////////////
    useEffect(() => {        
        const today = new Date();
        const startDt = new Date(today);
        startDt.setHours(0, 0, 0, 0);
        const formattedStartDate = startDt.toISOString().split('T')[0] + 'T00:00:00';
        let sDate = formattedStartDate.replace("T", " ");
        const endDt = new Date(today);
        endDt.setHours(23, 59, 59, 999);
        const formattedEndDate = endDt.toISOString().split('T')[0] + 'T23:59:59';
        let tDate = formattedEndDate.replace("T", " ");
        setStartDate(sDate);
        setEndDate(tDate);
    }, []);
    ////////////////////////////////////////////////////////////////////////////
    const changeTimeRange = (flag) => {  
	setShowtable(false)
        let fromDate = startDate;
        let toDate = endDate;  
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
        setStartDate(formatToDateTimeString(fromDate));
        setEndDate(formatToDateTimeString(toDate));
    };
    /////////////////////////////////////////////////////////////////////////////
    const formatToDateTimeString = (date) => {
        const formattedDate = new Intl.DateTimeFormat('en-IN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        }).format(date);
      
        const parts = formattedDate.split('/');
        
        return `${parts[2].slice(0, 4)}/${parts[1]}/${parts[0]} ${formattedDate.split(' ')[1]}`.replace(/\//g, '-');
    };
    ///////////////////////////////////////////////////////////////////////////////
    useEffect(() => {
        const fetchProvAuditDetails = async() => {
	    if (!startDate || !endDate) {
                return; 
            }
            const formattedStartDate = startDate.replace('T', ' ');
            const formattedEndDate = endDate.replace('T', ' ');
            try {
                const encryptedData = await encryptPayload({ clientId: clientID, acctId: -1, fDate: formattedStartDate, tDate: formattedEndDate, eventId: -2, prodId: prodId == 0 ? product?.value : productId }, conf.encryptionKey);
                const response = await fetch(`${url}/tssgui/provAudit?key=${encodeURIComponent(encryptedData.encryptedKey)}&data=${encodeURIComponent(encryptedData.encryptedPayload)}&iv=${encodeURIComponent(encryptedData.iv)}`, { headers: { 'tssgui-tenant-code': localStorage.getItem('tenantCode') } });
                if (!response.ok) {
                    throw new Error('Error fetching provising audit details');
                }
                const data = await response.json();
                Log('Audit-Provisioning', 'INFO' ,'Fetched provising audit details successfully'); 
                setProvTrackerDetails(data);
            } catch (error) {
                Log('Audit-Provisioning', 'ERROR' ,'Error fetching provising audit details:'+error);
            }
        };

        fetchProvAuditDetails();
    }, [startDate,endDate]);  


    ///////////////////////////////////////////////////////////////////////
    const fetchProvAuditDetails = async() => {
        const formattedStartDate = startDate.replace('T', ' ');
        const formattedEndDate = endDate.replace('T', ' ');
        if(endDate < startDate){
            infoAlert(t("modules.tracker.provTracker.infoAlert.endDate"))
        }
        else{
            try {
                setShowtable(true)
                const encryptedData = await encryptPayload({ clientId: clientID, acctId: accountId, fDate: formattedStartDate, tDate: formattedEndDate, eventId: eventIds == '' ? -2 : eventIds, prodId: prodId == 0 ? product?.value : productId }, conf.encryptionKey);
                const response = await fetch(`${url}/tssgui/provAudit?key=${encodeURIComponent(encryptedData.encryptedKey)}&data=${encodeURIComponent(encryptedData.encryptedPayload)}&iv=${encodeURIComponent(encryptedData.iv)}`, { headers: { 'tssgui-tenant-code': localStorage.getItem('tenantCode') } });
                if (!response.ok) {
                    throw new Error('Error fetching provising audit details');
                }
                const data = await response.json();
                Log('Audit-Provisioning', 'INFO' ,'Fetched provising audit details successfully'); 
                setProvTrackerDetails(data);
            } catch (error) {
                Log('Audit-Provisioning', 'ERROR' ,'Error fetching provising audit details:'+error);
            }
        }
    }
    /////////////////////////////////////////////////////////////////////////
    const changeProduct = (event) => {
	setShowtable(false)
	setProduct(event);
        setAccountObject({value: '-1', label:t('modules.tracker.provTracker.label.allOption')})
        eventIds = '-2';
    }
    ////////////////////////////////////////////////////////////////////////
    const changeStartDate = (event) => {
        setShowtable(false)
        setStartDate(event)
    }
    ////////////////////////////////////////////////////////////////////////
    const changeEndDate = (event) => {
        setShowtable(false)
        setEndDate(event)
    }
    ///////////////////////////////////////////////////////////////////////
    const changeAccount = (event) => {
        setShowtable(false)
        setAccountObject(event)
        setAccountId(event.value)
    }

    //////////////////////////////////////////////////////////////////////
    const changeEvents = (event) => {
        setShowtable(false)
        eventIds = (event != "") ? event : '-2' 
    }	    
    ///////////////////////////////////////////////////////////////////////
	return (       
		<>
        {permission == 0 && (<TssSpinner isLoading={true} />)}
        {permission != "0" &&(
			<ProvTrackerView    
				ProductList = {productList}
                                Product = {product}
                                NewProduct = {changeProduct}
				AccountList = {accountList}
                                AllOption = {allAccount}
				Account = {accountObject}
				NewAccount = {changeAccount}
                                Events = {options}
				NewEvents = {changeEvents}
                                StartDate = {startDate}
				NewStartDate = {changeStartDate}
                                EndDate = {endDate}
				NewEndDate = {changeEndDate}
                                ChangeTime = {changeTimeRange}
                                ProvTrackerDetails = {provTrackerDetails}
                                Search = {fetchProvAuditDetails}
                                ShowTable = {showTable}      
                               
            />
        )} 
		</>  
	)
}

export default ProvTrackerMain
