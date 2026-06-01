import React,{useState,useRef,useEffect} from 'react';
import TssIconConfig from '@modules/conf/TssIcon';
import { useDispatch, useSelector } from 'react-redux';

const TssIcon = ({iconKey="" ,id="", title="", className="",isDisabled=false, onClick,onHover, iconProps  }) => {

	const { type: IconType, icon, class:iconClass } = TssIconConfig[iconKey];

	const handleClick = () => {
    		if (!isDisabled && onClick) {
      			onClick();
    		}
  	};
	const darkMode = useSelector((state) => state.ui.darkMode);
	const handleHover = () => {
		if(!isDisabled && onHover)
	    {
			onHover();
		}		
	}

	const iconClassName = `${iconClass} tss-icon ${className} ${isDisabled ? 'tss-disabled-icon' : ''} `; 

	return (
	 <IconType id={id} icon={icon} className={iconClassName} title={title} onClick={handleClick} onMouseEnter={handleHover} {...iconProps} />
  	);
};

export default TssIcon;

