import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const CustomTooltipFeildSet = ({ children, content ,theme}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleMouseEnter = () => {
    setShowTooltip(true);
  };
 const darkMode = useSelector((state) => state.ui.darkMode);
  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  return (
    <div>
   
      <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
       {children}
      </div>
      {showTooltip && (
        <div className={`TSSGUI_ToolTipStyle${theme} toolTipStyle-dark`} style={{ pointerEvents: "none"}} >
          {content}
        </div>
      )}
    </div>
  );
};

export default CustomTooltipFeildSet;
