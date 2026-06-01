import React,{useState,useRef,useEffect} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TssIcon from '@app/modules/common/default/components/TssIcon';
import TssIconConfig from '@modules/conf/TssIcon';
import { useDispatch, useSelector } from 'react-redux';
const TssButton = ({id="", type="button", label="", title="", className="", onClick, isDisabled=false ,btnProps,iconSupport=true}) => {

  const buttonStyle = {
//    cursor: onClick ? "cursor" : "auto"
  };

  const [buttonClass,setButtonClass]=useState("tss-btn")
  const [animation,setAnimation]=useState(false)

  const handleOnMouseEnter =() => {
    setButtonClass("tss-primary-onhover-btn")
    setAnimation(true)
  }
const darkMode = useSelector((state) => state.ui.darkMode);
  const handleOnMouseLeave = () =>{
    setButtonClass("tss-btn")
    setAnimation(false)
  }
  const handleClick = () => {
    if (!isDisabled && onClick) {
      onClick();
    }
  };

   const buttonClassName = `btn tss-btn-bg ${buttonClass} ${className} ${isDisabled ? 'tss-disabled-btn' : ''}`;

  return (
	  <button type={type}  
            onMouseEnter={handleOnMouseEnter} 
            onMouseLeave={handleOnMouseLeave} 
            className={buttonClassName} 
            disabled={isDisabled}  
            title={title} 
            id={id} 
            onClick={handleClick} 
            style={buttonStyle} 
            {...btnProps} >
            {label}

            {iconSupport && TssIconConfig[label] && (<>
                {/* &nbsp;&nbsp;<TssIcon iconKey={label} /> */}
                &nbsp;&nbsp;<FontAwesomeIcon icon={TssIconConfig[label].icon}  beat={animation} spinPulse={label=="Reset" || label=="Add TimeZones"?animation:false}/>
                </>
            )}
          
    </button>
  );
};

export default TssButton;

