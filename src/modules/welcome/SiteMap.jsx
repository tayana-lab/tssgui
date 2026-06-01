import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TssConf from "@app/modules/conf/TssGui.json";
import productFeatures from '@app/modules/conf/Products.json';

const Panel = ({ module, submodules, onModuleClick, onItemClick }) => {
  const renderSubmodules = (submodules) => {
    return (
      <ul className="list-unstyled pl-3">
        {submodules.map((submodule) => {
          const icon = submodule.moduleIcon || 'fa fa-share'; // Default icon
          return (
            <li key={submodule.moduleId} className="mb-2">
              <a
                href="javascript:void(0);"
                onClick={() => onItemClick(submodule)}
                className="tss-paragraph"
              >
                <i className={`fa ${icon}`} style={{ width: '15px' }}></i>&nbsp;&nbsp;
                {submodule.moduleHeading}
              </a>
              {submodule.submodules && submodule.submodules.length > 0 && (
                <div className="pl-3">
                  {renderSubmodules(submodule.submodules)}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    );
  };

  return (
<div className="col-md-3 col-sm-4 col-xs-12 mb-3 d-flex">
  <div className={`card flex-grow-1 d-flex flex-column ${submodules.length / 10 < 6 ? 'short-card' : ''}`}>
        
<div className="card-header" style={{ background: "#c4b0f3" }} id="sitemap-header">
          <h5 className="card-title">
            <a href="javascript:void(0);" id={module.moduleId} className="tss-paragraph">
              <b>{module.moduleHeading}</b>
            </a>
          </h5>
        </div>
        <div className="card-body" style={{padding: "1px",paddingTop: "12px"}} >
          {renderSubmodules(submodules)}
        </div>
      </div>
    </div>
  );
};

const SiteMap = () => {
  const [modules, setModules] = useState([]);
  const navigate = useNavigate();
  const [productDetails, setProductDetails] = useState([]);
  const username = localStorage.getItem("username");
  const password = atob(localStorage.getItem("password"));
  const acctId = localStorage.getItem("acctID");
  const [hoveredProductId, setHoveredProductId] = useState(null);

  useEffect(() => {
    const modulesJSON = localStorage.getItem('productModules');
    if (modulesJSON) {
      try {
        const parsedData = JSON.parse(modulesJSON);
        setModules(parsedData);
      } catch (error) {
       // console.error('Error parsing localStorage data:', error);
      }
    }
  }, []);

  const handleModuleClick = (module) => {
    // Add logic for module click if needed
  };

  const handleItemClick = (submodule) => {
    if (submodule.modulePage) {
      localStorage.setItem("moduleVersionType", submodule.versionType ? submodule.versionType : '0');
      localStorage.setItem("modulePath", submodule.modulePathHierarchy ? submodule.modulePathHierarchy : '');
      localStorage.setItem("moduleHeading", submodule.moduleHeading ? submodule.moduleHeading : '');
      localStorage.setItem("manual", submodule.helpText ? submodule.helpText : '');
      navigate(submodule.modulePage);
    }
  };

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`${TssConf.SERVER_JS_API_URI}/productDetails?acctId=${acctId}&tenantCode=${localStorage.getItem("tenantCode")}`);
        if (!response.ok) {
          throw new Error('Failed to fetch product details');
        }
        const data = await response.json();
	  //    console.log(data);
        setProductDetails(data);
      } catch (error) {
       // console.log("Error", error);
      }
    };

    fetchProductDetails();
  }, []);

  const handleRedirect = async (Url, productId) => {

   var productUrl="";
    try {
      const response = await fetch(`${TssConf.SERVER_JS_API_URI}/generateToken`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password, productId })
      });

      if (!response.ok) {
        throw new Error('Failed to authenticate');
      }
      const data = await response.json();
      const { token } = data;
     
	  productUrl = `${Url}?token=${token}`;
     
    if (productId == 70 || productId == 90) {
	  productUrl = `${Url}`;  
         window.open(productUrl, '_blank');
      }else{
	 productUrl = `${Url}?token=${token}`;
         window.location.href = productUrl;
      }

    } catch (error) {
    //  console.error('Error during authentication', error);
    }
  };
const desiredOrder = [0,50, 10, 20, 60, 70, 80,90,100];

const aliasLabelMap = {
  BMP: "Bulk Messaging",
  Monitoring: "AMS",
  Analytics: "Advanced Analytics",
  MCA: "Call Mgt Services"	
};


  return (
  
	  <div>
  {TssConf.PRODUCT_ID == '0' ? (
<div className="container mt-4">
  <div
    className="row"
    style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: '1rem',
    }}
  >
    {productDetails.length == 0 ? (
      <div className="col-12" style={{ textAlign: "center" }}>
        <h5 className="text-muted">No Products Available</h5>
      </div>
    ) : (
          productDetails
  .filter(product =>  product.productId !== TssConf.PRODUCT_ID)
  .map(product => {

          const isDisabled = product.status == 0;

          return (
            <div
              key={product.productId}
              className="d-flex justify-content-center"
              style={{
                flexBasis: 'calc(25% - 1rem)',
                maxWidth: 'calc(25% - 1rem)',
                marginBottom: '1rem',
              }}
            >
              <div
                className="card shadow-lg p-3 d-flex flex-column"
                 onClick={!isDisabled ? () => handleRedirect(product.productUrl, product.productId) : undefined}
                 style={{
                  width: '100%',
                  borderRadius: '30px',
                  overflow: 'hidden',
                  transition: 'transform 0.3s ease, opacity 1s ease',
                                cursor: isDisabled ? 'not-allowed' : 'pointer',
                  pointerEvents: isDisabled ? 'none' : 'auto',
                  opacity: isDisabled ? 0.5 : 1,

                }}

                onMouseEnter={(e) => {
                        setHoveredProductId(product.productId)
			if (!isDisabled) e.currentTarget.style.transform = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
			setHoveredProductId(null)
                  if (!isDisabled) e.currentTarget.style.transform = "scale(1)";
                }}

              >
        <div className="d-flex align-items-center justify-content-center mb-3">
                  <h5 className="fw-bold mb-0" style={{color:"#034694"}}>{aliasLabelMap[product.productName] || product.productName}</h5>
                </div>
          
   {hoveredProductId !== product.productId && (
	   <>



          <div className="d-flex align-self-center">
            <img
              src={`/images/${product.productName}.svg`}
              alt={product.alias}
              style={{
                height: "140px",
                width: "240px",
                objectFit: "contain",
                transition: 'opacity 3s ease', // Smooth opacity change
              }}
            />
          </div>

	      <div className="text-center mt-auto">
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: "none", color: "#6C6C6C" }}
                  >
                    More info <img src="/images/arrow.svg" alt="arrow" />
                  </a>
                </div>
</>
        )}

{hoveredProductId == product.productId && (
  <div
    className="salient-features"
    style={{
      position: 'absolute',
      top: '70%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      color: '#003e5c',
      borderRadius: '10px',
      display: 'flex',
      flexDirection: 'column',
      textAlign: 'left',
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      overflow: 'hidden',
		    
    }}
  >

<ul
      style={{
        listStyleType: 'disc',
        margin: 0,
      }}
    >


    {(productFeatures[product.productId] || []).map((feature, index) => (
    
<li
          key={index}
          style={{
            marginBottom: '0px', // space between list items
            fontWeight: 500,
            fontSize: '15px',
             color: '#034694',			  
            opacity: hoveredProductId === product.productId ? 1 : 0,
            transform: hoveredProductId === product.productId ? 'translateY(0)' : 'translateY(10px)',
          }}
        >
          {feature}
        </li>
    ))}
	</ul>
  </div>
)}

              </div>
            </div>
    );
        })
    )}
  </div>
</div>

  ) : (
    <div className="row d-flex flex-wrap align-items-stretch">
      {modules.map((module) => (
        <Panel
          key={module.moduleId}
          module={module}
          submodules={module.submodules || []}
          onModuleClick={handleModuleClick}
          onItemClick={handleItemClick}
        />
      ))}
    </div>
  )}
</div>


  );
};




export default SiteMap;

