import React, { useEffect, useState} from 'react';
import { useTranslation } from 'react-i18next';
import TssIcon from '@modules/common/default/components/TssIcon'; 
import TssConf from '@modules/conf/TssGui.json';
import TssModal from '@modules/common/default/components/TssModal';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
const ContentHeader = () => {
  const [t] = useTranslation();
  const [selectedVersion, setSelectedVersion] = useState("Version 1"); // Initialize state variable
  const [filePathIncluded,setFilePathIncluded] = useState(false);
  const handleVersionSelect = (version) => {
    setSelectedVersion(version); // Update state variable when a version is selected
  };
const darkMode = useSelector((state) => state.ui.darkMode);
  useEffect(() => {
    setSelectedVersion(t('topnavi.label.version') + " 1");
  }, [t('topnavi.label.version')]);

  const modulePath = localStorage.getItem("modulePath");
  const moduleVersionType= localStorage.getItem("moduleVersionType");
  const moduleHeading = localStorage.getItem("moduleHeading");
  const manual = localStorage.getItem("manual");
  const landingPage = localStorage.getItem("landingPage");
   const navigate = useNavigate(); 
useEffect(() => {
 
if (manual && manual.includes("File:")) {
        setFilePathIncluded(true)
} else {
     setFilePathIncluded(false);
}

},[manual]);


  var updatedModulePath;
  if (modulePath) {
     updatedModulePath = modulePath.replace(/->/g, "  /  ");
    localStorage.setItem("modulePath", updatedModulePath);
  }

const handleManualClick = () =>{


    if (!manual) {
      console.error('File path not found in localStorage.');
      return;
    }

    const cleanedFilePath = manual.replace(/^File:\//, '');
     const filePath = cleanedFilePath.split('/').slice(0, -1).join('/');
    const fileName = cleanedFilePath.substring(cleanedFilePath.lastIndexOf('/') + 1);
 const url = `${TssConf.SERVER_JS_API_URI}/download?filePath=${encodeURIComponent(filePath)}&fileName=${encodeURIComponent(fileName)}`;

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
      link.click();changeStyle
      link.parentNode.removeChild(link);
    })
    .catch(error=> console.error('Error downloading file:', error));
};


const btnProps = { 

"data-target" : !filePathIncluded?"#myFirstModal":"" , 

"data-toggle" : !filePathIncluded? "modal":"", 

 };
	
const handleHomeClick =()=>{
 
if(landingPage == "SiteMap"){

  localStorage.setItem("modulePath","");
   localStorage.setItem("moduleVersionType","0");
   localStorage.setItem("moduleHeading","Sitemap");
   navigate("/sitemap");


}else{
   localStorage.setItem("modulePath","");
   localStorage.setItem("moduleVersionType","0");
   localStorage.setItem("moduleHeading","Dashboard");
   navigate("/dashboard");

}

}; 

  return (
    <section className="content-header">
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-6">
          <h5 className='tss-heading' style={{marginBottom:"0px"}}>{moduleHeading}</h5>
          </div>
          <div className="col-sm-6" >
            <ol className="breadcrumb float-sm-right">
              <li className="breadcrumb-item">
              {modulePath !="" &&(
                <TssIcon iconKey="tss_manual" id="manualIcon" title="Click to get manual" 
				 className='tss-primary-icon' 
               onClick={filePathIncluded ? handleManualClick : null}
               iconProps={btnProps} 

/> 
)}
               <span>&nbsp;&nbsp;&nbsp;</span>
                <a className='tss-anchor'  onClick={handleHomeClick}>Home</a>
                {modulePath !="" &&( 
                <span>&nbsp;/&nbsp;</span>
                )}
              </li>
              <li className="">{updatedModulePath}&nbsp;&nbsp;&nbsp;</li>
              {/* {title !== 'Accounts'  && ( */}
              {moduleVersionType !="0" && moduleVersionType !=null && (
                <li className=" border rounded" style={{width:"100px",backgroundColor:"#fff"}}>
                    <div className="dropdown">                 
                      <a className="nav-link " id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style={{fontWeight :'normal',padding:"0",textAlign:"center"}} title={t('topnavi.title.version')}>
                      {selectedVersion} 
                      <small> <i className="fas fa-light fa-chevron-down"></i></small>
                      </a>                 
                      <div className="dropdown-menu" aria-labelledby="dropdownMenuLink" style={{width:'auto'}}>
                        <a className="dropdown-item" href="#" onClick={() => handleVersionSelect(t('topnavi.label.version') +" 1")}> {t('topnavi.label.version')} 1</a>
                        <a className="dropdown-item" href="#" onClick={() => handleVersionSelect(t('topnavi.label.version') +" 2")}> {t('topnavi.label.version')} 2</a>
                        <a className="dropdown-item" href="#" onClick={() => handleVersionSelect(t('topnavi.label.version') +" 3")}> {t('topnavi.label.version')} 3</a>
                      </div>                
                  </div>
                </li>
              )}
              {/* )}   */}
            </ol>
          </div>
        </div>
      </div>

       <TssModal 

          modalId="myFirstModal" 
          modalBodyId="myModalBody" 
          className="modal-lg" 
	  header="Manual" 
        > 
        
         {manual}

        </TssModal> 

    </section>
  );
};

export default ContentHeader;
