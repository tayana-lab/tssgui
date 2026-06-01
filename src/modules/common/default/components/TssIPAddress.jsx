import React, { useRef, useState, useEffect } from 'react';
import { checkipAddress} from '@app/modules/common/default/js/validate.js'
import { useDispatch, useSelector } from 'react-redux';

const IPAddressField = ({ mandatory=false, label, onChange = () => {}, min=0, max=255, ipFields = 4 ,defaultValue="",alert=false}) => {
  const inputRefs = useRef([]);
  const [theme, setTheme] = useState("tss-ipField");
  const [inputFieldId, setInputFieldId] = useState(null);
  const [isFocused, setIsFocused] = useState(false);
  const [focusIndex, setFocusIndex] = useState(null);
  const [toolTipIndex, setToolTipIndex] = useState(0);
  const [errorIndex, setErrorIndex] = useState([]);
  const [showTooltip, setShowTooltip] = useState(false);
  // const [ip, setIp] = useState(Array(ipFields).fill(""));
  const [ip, setIp] = useState(defaultValue.length>0 ? defaultValue.split(".") : ["","","",""]);
  const [inputInfo, setInputInfo] = useState(`Enter numeric value between ${min} and ${max}`);
  const [errorInfo, setErrorInfo] = useState(`The value should be between ${min} and ${max}`);
  const [tooltipTheme, setTooltipTheme] = useState("Light");
  const indexFields = 3;
  const darkMode = useSelector((state) => state.ui.darkMode);
  const [isValid, setIsValid] = useState(true);
  

  useEffect(() => {
    if (alert) {
      setErrorIndex([0,1,2,3]);
      setTheme("tss-ipField-error");
      setErrorInfo("IPAddress is mandatory");
    }
  }, [alert]);

  const handleMouseEnter = (index) => {
    alert(":::::::::enter:::::::::")
    setToolTipIndex(index);
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setToolTipIndex(0);
    setShowTooltip(false);
  };

  const handleKeyDown = (e, index) => {
    if (e.key === '.' || e.key === 'ArrowRight') {
      e.preventDefault();
      const nextIndex = index + 1;
      setInputFieldId(nextIndex);
      if (nextIndex < inputRefs.current.length) {
        inputRefs.current[nextIndex].focus();
      }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const nextIndex = index - 1;
      setInputFieldId(nextIndex);
      if (nextIndex >= 0) {
        inputRefs.current[nextIndex].focus();
      }
    }
  };

  const handleOnFocus = (index) => {
    if (!errorIndex.includes(index)) {
      setIsFocused(true);
      setFocusIndex(index);
      setTheme("tss-ipField-hover");
      setShowTooltip(true);
    } else {
     
      setToolTipIndex(index);
      setTheme("tss-ipField-error");
      setTooltipTheme("Dark");
      setShowTooltip(true);
    }
    
  };

  const handleOnBlur = () => {
    if (theme !== "tss-ipField-error") {
      setIsFocused(false);
      setFocusIndex(0);
      setTheme("tss-ipField");
    }
    setShowTooltip(false);
  };

  const isIpValid = (ipArray) => {
    return ipArray.every(value => {
      const num = parseInt(value, 10);
      return num >= min && num <= max;
    });
  };

  const handleInputValueChange = (event, index) => {
    const value = event.target.value;
 
    //const regex = new RegExp(`^(0|[1-9]\\d{0,${maxDigits - 1}})$`);
    const errorMessage = checkipAddress(value,"IP Address",min,max,index)
    if (errorMessage === null) {
      const newIp = [...ip];
      newIp[index] = value;
      setIp(newIp);
      setErrorIndex((prevError) => prevError.filter((i) => i !== index));
      setTheme("tss-ipField");
      setTooltipTheme("Light");
      setShowTooltip(false);
      const isValid = isIpValid(newIp);
      onChange(newIp.join("."), isValid ? true : false);
     
    } else {
      const newIp = [...ip];
      newIp[index] = value;
      setIp(newIp);
      setErrorIndex((prevError) => [...prevError, index]);
      setTheme("tss-ipField-error");
      setErrorInfo(errorMessage);
      setTooltipTheme("Dark");
      setShowTooltip(true);
      setToolTipIndex(index);
      const isValid = isIpValid(newIp);
      onChange(newIp.join("."), isValid ? true : false);
    }
  };

  return (
    <div className="tss-IPAddressFieldDiv">
      <fieldset className="p-2" id="TSSGUI_InputTextFieldSetStyle">
        <legend className="w-auto" style={{ position: 'relative' }}>
          <p className="mb-2 ml-0" id="tss-ipAddress-labelStyle">
            &nbsp;&nbsp;{label}
            <p style={{ display: mandatory ? "inline" : "none" }} className='mandatory'>*</p>
            
          </p>
        </legend>

        <div className="tss-IPAddressField" >
          {Array.from({ length: ipFields }).map((_, index) => (
            <span key={index} onMouseEnter={() => handleMouseEnter(index)} onMouseLeave={handleMouseLeave}>
              <input
                className={inputFieldId === index || (isFocused && focusIndex === index) ? theme : errorIndex.includes(index) ? "tss-ipField-error" : "tss-ipField"}
                type="text"
                ref={(el) => (inputRefs.current[index] = el)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onFocus={() => handleOnFocus(index)}
                onBlur={handleOnBlur}
                maxLength={3}
                value={ip[index]}
                onChange={(e) => handleInputValueChange(e, index)}
                // style={{border:"none"}}
              />
              {showTooltip && toolTipIndex === index && (
                <p className={`tss-ipField-tooltip${errorIndex.includes(index) && theme === "tss-ipField-error" ? tooltipTheme : "Light"} ${darkMode? 'toolTipStyle-dark' : ''} `}>
                  {errorIndex.includes(index) && theme === "tss-ipField-error" ? errorInfo : inputInfo}
                </p>
              )}
              {index < indexFields && (
                <span className="tss-ipAddress-seperator">&nbsp;&nbsp;.&nbsp;&nbsp;</span>
              )}
              {/* {index < indexFields && (
                <span style={{height:"50px"}}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <span className="tss-ipAddress-seperator"></span>
                </span>
              )} */}  
            </span>
          ))}
        </div>
      </fieldset>
    </div>
  );
};

export default IPAddressField;
