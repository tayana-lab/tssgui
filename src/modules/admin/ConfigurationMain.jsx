import React, { useState, useEffect} from 'react';
import { useTranslation } from 'react-i18next';
import Log from '@app/modules/common/default/components/TssGUILog';
import encryptPayload from '@app/modules/common/default/js/encryptPayload.js';
import tssguiConf from '@modules/conf/TssGui.json'
import { useLogout } from '@app/modules/common/default/utils/oidc-providers';
import ConfigurationView from '@app/modules/admin/ConfigurationView';
import ConfigurationAdd from '@app/modules/admin/ConfigurationAdd';
 
const ConfigurationMain = ({mode}) => {
    const [displayAddPage, setDisplayAddPage] = useState(false);
    const [displaySearchPage, setDisplaySearchPage] = useState(false);
    const [tempVariable, setTempVariable] = useState(0);
    const [types, setTypes] = useState('');
    const [permission,setPermission]=useState('');
    const url = tssguiConf.SERVER_JS_API_URI;
    const productId = localStorage.getItem("productID");
    const clientID = localStorage.getItem("acctID");
    const clientIP = localStorage.getItem("clientIP");
    const sessionID = localStorage.getItem("sessionID");
    const clientName = localStorage.getItem("acctName");
    const userName = localStorage.getItem("username");
     
    const moduleId =1600;
    const logOut = useLogout();
    const [loading, setLoading]  = useState(true); 

const [t] = useTranslation();
useEffect(() => {
    const fetchData = async () => {
        try {
            const encryptedData = await encryptPayload({ productId, clientId: clientID, moduleId, clientIp: clientIP, sessionId: sessionID, tenantCode: localStorage.getItem("tenantCode") }, tssguiConf.encryptionKey);
            const response = await fetch(`${url}/tssgui/checkAccess?key=${encodeURIComponent(encryptedData.encryptedKey)}&data=${encodeURIComponent(encryptedData.encryptedPayload)}&iv=${encodeURIComponent(encryptedData.iv)}`, { headers: { 'tssgui-tenant-code': localStorage.getItem('tenantCode') } });

            if (!response.ok) {
                throw new Error("Error fetching data ");
            }
            const data = await response.text();
            const responseObject = JSON.parse(data);
            const permission1 = responseObject.permission;
            if (permission1 == 0) {
              logOut();
	    }
	    else
		setLoading(false);

            setPermission(permission1)
            Log('StakeHolder', 'INFO', 'Data fetched successfully : '+JSON.stringify(data));
        } catch (error) {
            Log('StakeHolder', 'ERROR', 'Error fetching data : '+error);
        }
    };
    fetchData();
}, []);

  const handlePlusClick = () => 
    {
        setDisplayAddPage(true);
        setDisplaySearchPage(false);
        setTypes(null); 
    };
    const handleEditClick = (rowData, index) => {
      setDisplaySearchPage(true);
      setDisplayAddPage(false);
      setTypes(rowData);
  };
    const handleAddClose=()=>
    {
        setDisplayAddPage(false);
    }
    const handleSearchClose=()=>
    {
        setDisplaySearchPage(false);
    }


  return (
    <div>
       {(displayAddPage) && (
                <ConfigurationAdd 
                LoadAddPage={true} 
                LoadSearchPage={false} 
                closeAddPage={handleAddClose} tempVariable={tempVariable}
                setTempVariable={setTempVariable} types={types} checkPermission={permission}/>
            )}
             {(displaySearchPage) && (
                <ConfigurationAdd 
                LoadAddPage={false} 
                LoadSearchPage={true} 
                closeAddPage={handleSearchClose} tempVariable={tempVariable}
                setTempVariable={setTempVariable} types={types} checkPermission={permission}/>
            )}
	  {!loading && (
      <ConfigurationView  LoadAddPage={handlePlusClick} LoadSearchPage={handleEditClick}  tempVariable={tempVariable}  checkPermission={permission} moduleId={mode}/>
   	)} 
    </div>
  )
}
export default ConfigurationMain;
