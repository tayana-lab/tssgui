import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TssConf from "@app/modules/conf/TssGui.json";
import productFeatures from '@app/modules/conf/Products.json';

const Panel = ({ module, submodules, onModuleClick, onItemClick }) => {
  const renderSubmodules = (submodules) => {
    return (
      <ul className="list-none space-y-2">
        {submodules.map((submodule) => {
          const icon = submodule.moduleIcon || 'fa fa-share';
          return (
            <li key={submodule.moduleId}>
              <a
                href="javascript:void(0);"
                onClick={() => onItemClick(submodule)}
                className="flex items-center gap-2 text-sm p-1 rounded hover:bg-gray-100 hover:text-blue-600 transition-colors"
              >
                <i className={`fa ${icon}`} style={{ width: '15px', fontSize: '12px' }}></i>
                <span className="truncate">{submodule.moduleHeading}</span>
              </a>
              {submodule.submodules && submodule.submodules.length > 0 && (
                <div className="pl-4">
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
    <div className="tss-card">
      <div className="tss-card-header" style={{ background: "#c4b0f3", color: "#fff" }}>
        <a href="javascript:void(0);" id={module.moduleId} className="font-semibold">
          {module.moduleHeading}
        </a>
      </div>
      <div className="tss-card-body">
        {renderSubmodules(submodules)}
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
        // Error parsing data
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
        setProductDetails(data);
      } catch (error) {
        // Error fetching product details
      }
    };

    fetchProductDetails();
  }, []);

  const handleRedirect = async (Url, productId) => {
    let productUrl = "";
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
      } else {
        productUrl = `${Url}?token=${token}`;
        window.location.href = productUrl;
      }
    } catch (error) {
      // Error during authentication
    }
  };

  const aliasLabelMap = {
    BMP: "Bulk Messaging",
    Monitoring: "AMS",
    Analytics: "Advanced Analytics",
    MCA: "Call Mgt Services"	
  };

  return (
    <div>
      {TssConf.PRODUCT_ID == '0' ? (
        <div className="w-full">
          {productDetails.length == 0 ? (
            <div className="flex items-center justify-center py-24">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--color-primary-light)' }}>
                  <i className="fas fa-inbox text-2xl" style={{ color: 'var(--color-primary)' }} />
                </div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text-muted)', fontFamily: 'Gilroy-Bold, sans-serif' }}>
                  No Products Available
                </h3>
                <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  Your product catalog will appear here once configured.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {productDetails
                .filter(product => product.productId !== TssConf.PRODUCT_ID)
                .map(product => {
                  const isDisabled = product.status == 0;

                  return (
                    <div
                      key={product.productId}
                      className="group"
                    >
                      <div
                        className="tss-card cursor-pointer flex flex-col h-full transition-all duration-200 hover:shadow-lg"
                        onClick={!isDisabled ? () => handleRedirect(product.productUrl, product.productId) : undefined}
                        style={{
                          opacity: isDisabled ? 0.5 : 1,
                          pointerEvents: isDisabled ? 'none' : 'auto',
                        }}
                        onMouseEnter={() => setHoveredProductId(product.productId)}
                        onMouseLeave={() => setHoveredProductId(null)}
                      >
                        {/* Card Header with Product Name */}
                        <div className="tss-card-header border-b">
                          <h3 className="font-bold text-center w-full" style={{ color: '#034694', fontFamily: 'Gilroy-Bold, sans-serif' }}>
                            {aliasLabelMap[product.productName] || product.productName}
                          </h3>
                        </div>

                        {/* Card Body */}
                        <div className="tss-card-body flex-1 flex flex-col items-center justify-center min-h-48 relative overflow-hidden">
                          {hoveredProductId !== product.productId ? (
                            <>
                              <img
                                src={`/images/${product.productName}.svg`}
                                alt={product.productName}
                                className="max-h-32 max-w-full object-contain mb-4"
                              />
                              <div className="text-center mt-auto">
                                <a
                                  href="javascript:void(0);"
                                  className="inline-flex items-center gap-1 text-xs font-medium transition-colors"
                                  style={{ color: '#6C6C6C' }}
                                >
                                  More info
                                  <img src="/images/arrow.svg" alt="arrow" style={{ height: '12px' }} />
                                </a>
                              </div>
                            </>
                          ) : (
                            <div className="w-full h-full flex flex-col justify-start p-3 bg-white bg-opacity-95">
                              <h4 className="text-xs font-semibold mb-2" style={{ color: '#034694' }}>Features</h4>
                              <ul className="text-xs space-y-1 overflow-y-auto flex-1">
                                {(productFeatures[product.productId] || []).map((feature, index) => (
                                  <li
                                    key={index}
                                    className="flex items-start gap-2"
                                    style={{ color: '#034694' }}
                                  >
                                    <span className="text-xs mt-0.5">•</span>
                                    <span className="line-clamp-2">{feature}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
