import React,{ useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  toggleSidebarMenu
} from '@app/modules/common/default/store/reducers/ui';
import TssIcon from '@app/modules/common/default/components/TssIcon';
import SearchDropdown from '@app/modules/welcome/SearchDropdown';
import LanguagesDropdown from '@app/modules/welcome/LanguagesDropdown';
import ProductsDropdown from '@app/modules/welcome/ProductsDropdown';
import ThemesDropdown from '@app/modules/welcome/ThemesDropdown';
import UserDropdown from '@app/modules/welcome/UserDropdown';
import TenantDropdown from '@app/modules/welcome/TenantDropdown';
import conf from '@modules/conf/TssGui.json';
import TssContentHeader from '../common/default/components/TssContentHeader';
import '@modules/common/default/scss/Header.css'
import Log from '@app/modules/common/default/components/TssGUILog.js'


const productTitle = conf.PRODUCT_TITLE;
const Header = () => {
  const [t] = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const navbarVariant = useSelector((state: any) => state.ui.navbarVariant);
  const headerBorder = useSelector((state: any) => state.ui.headerBorder);
  const authentication = useSelector((state: any) => state.auth.authentication);

  const [manualPath, setManualPath] = useState("");

  const handleSitemap = () =>{
   localStorage.setItem("modulePath","");
   localStorage.setItem("moduleVersionType","0");
   localStorage.setItem("moduleHeading","Sitemap");
   navigate("/sitemap"); 
  }
 
const handleDashboardClick =() =>{
   localStorage.setItem("modulePath","");
   localStorage.setItem("moduleVersionType","0");
   localStorage.setItem("moduleHeading","Dashboard");
   navigate("/dashboard");
} 
const handleUploadTrackerClick =() =>{
   localStorage.setItem("modulePath","");
   localStorage.setItem("moduleVersionType","0");
   localStorage.setItem("moduleHeading","File Upload Tracker");
   navigate("/fileUploadTracker");
} 
  const handleToggleMenuSidebar = () => {
    dispatch(toggleSidebarMenu());
  };

  const getContainerClasses = useCallback(() => {
    let classes = `main-header navbar navbar-expand ${navbarVariant} tss-topnav`;
    if (headerBorder) {
      classes = `${classes} border-bottom-0`;
    }
    return classes;
  }, [navbarVariant, headerBorder]);

  ////////////////////////////////////////////////////////////////////////////////////////

  useEffect(() => {
        const fetchProductManualPath = async () => {
            try {
                const response = await fetch(`${conf.SERVER_JS_API_URI}/getProductManualPath?productId=${conf.PRODUCT_ID}`);
                if (!response.ok) {
                    throw new Error("Error fetching data ");
                }
                const data = await response.text();
                setManualPath(data);
                Log('Top Nav', 'INFO', 'Data fetched successfully : ' + JSON.stringify(data));
            } catch (error) {
                Log('Top Nav', 'ERROR', 'Error fetching data : ' + error);
            }
        }
        fetchProductManualPath();
    },[])


  ////////////////////////////////////////////////////////////////////////////////////////
/*  const downloadManual = () => {
   const link = document.createElement('a');
    link.href = manualPath; // e.g., '/manuals/product1.pdf'
    
    const fileName = manualPath.substring(manualPath.lastIndexOf('/') + 1);
    link.download = fileName;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } 
*/


const downloadManual = async () => {
  if (!manualPath || manualPath =="" || manualPath == null) {
      return;
    }

    const cleanedFilePath = manualPath.replace(/^File:\//, '');
     const filePath = cleanedFilePath.split('/').slice(0, -1).join('/');
    const fileName = cleanedFilePath.substring(cleanedFilePath.lastIndexOf('/') + 1);
 const url = `${conf.SERVER_JS_API_URI}/download?filePath=${encodeURIComponent(filePath)}&fileName=${encodeURIComponent(fileName)}`;

  fetch(url)
    .then(response => {
      // Handle response based on content type
      if (response.ok) {
        return response.blob();
      } else {
        throw new Error('Network response was not ok');
      }
    })
    .then(blob => {
      // Create blob link to download
      const fileURL = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = fileURL;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    })
    .catch(error=> console.error('Error downloading file:', error));

};

 ///////////////////////////////////////////////////////////////////////////////////////
  return (
   <>
    <nav className={getContainerClasses()}>
      <ul className="navbar-nav">
        <li className="nav-item">
          <button
            onClick={handleToggleMenuSidebar}
            type="button"
            className="nav-link tss-topnav-icons"
          >
            <TssIcon iconKey="tss_bars"/>
          </button>
        </li>  
      </ul>

    <h3 className='ms-2 pt-2 pb-1 tss-product-title mt-1'><b>{productTitle} </b></h3>

      <ul className="navbar-nav ml-3">
      <div className='ml-2'/>
        <li className="nav-item">
          
           <div className="mt-1 d-flex flex-column align-items-center " >
            <TssIcon iconKey="tss_sitemap" onClick={handleSitemap} title={t('topnavi.title.siteMap')} size={10} />
		<small style={{ fontSize: '10px' }} >
                          <b className='zoom-hide-text'>&nbsp;{t('SiteMap')}</b></small>
            </div> 
         
        </li>
        <div className='ml-2'/>
        <li className="nav-item ml-3 mr-3">
          <div className="mt-1 d-flex flex-column align-items-center " onClick = {downloadManual}>
            <TssIcon iconKey="tss_manual"title={t('topnavi.title.manual')} />
            <small style={{ fontSize: '10px' }} >
		          <b className='zoom-hide-text'>&nbsp;{t('topnavi.label.manual')}</b></small>
          </div>
        </li>
        
      </ul>
      <ul className="navbar-nav ml-auto">
         {conf.DISPLAY_DASHBOARD_ICON == true &&( 
          <div className='nav-item mt-2' onClick={handleDashboardClick} style={{cursor:"pointer"}} title={t('topnavi.title.dashboard')} >
       <div >
        <TssIcon iconKey='tss_dashboard' />
       </div>
      </div>
       )}
       {conf.DISPLAY_TRANSLATOR_ICON == true &&(
       <>
       <div className='ml-4'/>
        <LanguagesDropdown  title={t('topnavi.title.language')}/>
       </>
       )}
       {conf.DISPLAY_PRODUCTS_ICON == true &&(
        <>
        <div className='ml-4' />
        <ProductsDropdown/>
        </>
       )}
       <TenantDropdown />
       {conf.DISPLAY_THEMES_ICON == true &&(
        <>
        <div className='ml-2' />
        <div className='ml-4' />
        <ThemesDropdown />
        </>
       )}
        {conf.DISPLAY_FILE_UPLOAD_ICON == true &&(
         <>
         <div className='ml-3' />
          <div className='nav-item mt-2' onClick={handleUploadTrackerClick} style={{cursor:"pointer"}} title={t('topnavi.title.fileUploadTracker')} >
       <div >
        <TssIcon iconKey='tss_upload' />
       </div>
      </div>
     </> 
     )}

        <div className='ml-2' />  
       <span style={{display:"flex",alignItems:"center"}} style={{ marginTop:"5px"}} >
		<UserDropdown/>
	</span> 
      </ul>
    
    </nav>
{/*    <div style={{backgroundColor:"#f4f6f9"}}>
    <TssContentHeader title={'Dashboard'}/>
    </div> */}

   
 </>
  );
};

export default Header;
