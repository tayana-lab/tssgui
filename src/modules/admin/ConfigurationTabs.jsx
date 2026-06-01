
import ConfigurationMain from '@app/modules/admin/ConfigurationMain';
import React, {useState} from 'react'
import TssTabs from '@app/modules/common/default/components/TssTabs';
import { useTranslation } from 'react-i18next';
import {useEffect} from 'react'
import Log from '@app/modules/common/default/components/TssGUILog';
import tssguiConf from '@modules/conf/TssGui.json'

const ConfigurationTabs = () =>
{
    const [t]= useTranslation();
    const [activeTab, setActiveTab] = useState('0');
    localStorage.setItem("activeTab", activeTab )
    const [loading, setLoading] = useState(true);
    const [ConfigurationModulelist, setConfigurationModulelist] = useState([]);
    const Url=tssguiConf.SERVER_JS_API_URI; 

    const fetchData = async () => {
        try {
        setLoading(true);
            const response = await fetch(`${Url}/getConfigModuleList`, { headers: { 'tssgui-tenant-code': localStorage.getItem('tenantCode') } });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
    
            Log('Configuration', 'INFO', 'Data fetched successfully : '+JSON.stringify(data));
            
            setConfigurationModulelist(data);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            Log('Application', 'ERROR', 'Error fetching data : '+error);
        }
    };
    
    useEffect(() => {
        fetchData();
    }, []);

    const TABLIST =ConfigurationModulelist.map((item) => ({
        Name: item.moduleName, // tab name
        Component: <ConfigurationMain key={item.moduleId} Tabs={item.moduleName} mode={item.moduleId} />
      }));
 
    return (
        <>
      {!loading && TABLIST.length > 0 && (
        <TssTabs tabsList={TABLIST} defaultTab={TABLIST[0].Name} />
      )}
    </>
)
}
 
export default ConfigurationTabs
