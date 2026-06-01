import React, { useState,useEffect } from 'react';

const TssPanel = ({panelId="",panelBodyId="", header, footer,className="", collapseReq=true, isCollapsed=false,children,onClick =() => {}}) => {

  const [isCollapsedFlag, setIsCollapsedFlag] = useState(isCollapsed);

  useEffect(() => {
        setIsCollapsedFlag(isCollapsed);
  }, [isCollapsed]);

  const toggleCollapse = () => {
    setIsCollapsedFlag(!isCollapsedFlag);
    onClick()
  };

  return (
	 <div id={panelId} className={`card tss-panel ${isCollapsedFlag ? 'collapsed' : ''}`} >	

	  {collapseReq ? (
        	<div className={`card-header tss-panel-header ${className}`} onClick={toggleCollapse} style={{cursor:'pointer'}} > {header} </div>
      	  ) : (
        	<div className={`card-header tss-panel-header ${className}`} style={{cursor:'context-menu'}} > {header} </div>
      	  )}

         {children && <div className={`card-body tss-panel-body ${isCollapsedFlag ? 'collapse' : 'collapse show'}`}  id={panelBodyId}>{children}</div>}
	       {footer   && <div className="card-footer tss-panel-footer">{footer}</div>}
        </div>
  );
};
export default TssPanel;

