import React, { useState, useEffect,useRef } from 'react';
import CustomTooltipFeildSet from './CustomToolTipForFeildSet';
import TssIcon from '@modules/common/default/components/TssIcon';
import { useDispatch, useSelector } from 'react-redux';

const TssTextBox = ({ placeholderName = "", mandatory = false, label = "", properties = {}, tooltipMessage = "", inputInfo = "", validation = "form", disabled = false, name = "inputField",size="",currencyUnit="",appendEnd=false,enableDataList=false,datalistOptions=[],handleOnBlur=()=>{},handleOnFocus=()=>{},autoFocus = false}) => {
  const [displayMandatory, setDisplayMandatory] = useState("none");
  const [displayInputInfo,setDisplayInputInfo] = useState(true)
  const [internalValidation, setInternalValidation] = useState(disabled ? "formDisabled" : validation || "form");
  
  useEffect(() => {
    setDisplayMandatory(mandatory ? "block" : "none");
  }, [mandatory]);

  
  useEffect(() => {
    setInternalValidation(validation);
  }, [validation]);

  const inputRef = useRef(null);
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

const darkMode = useSelector((state) => state.ui.darkMode);
  const handleLegendNameOnFocus = () => {
    handleOnFocus()
    if (internalValidation === "formError" || internalValidation === "formSuccess") {
      return;
    }
    setInternalValidation("formHover");
  };

  const handleLegendNameOnBlur = () => {
    if (internalValidation === "formError" || internalValidation === "formSuccess") {
      return;
    }
    setInternalValidation("form");
  };

  const handleMouseLeave = () => {
    handleOnBlur()
     if (internalValidation === "formError" || internalValidation === "formSuccess") {
   return;
 }
 setInternalValidation("form");
 }   

  return (
    <div className={`${internalValidation} ${disabled ? 'tss-disableField' : ""}`} id="fieldSetDiv">
      <fieldset className='p-2 selectHover '  id="TSSGUI_InputTextFieldSetStyle"  style={{height:`${label !=="" ? "50px" : "43px"}`,marginTop:`${label !=="" ? "0px" : "8px"}`}} >
        {label!== "" && (<legend className="w-auto" style={{ position: 'relative'}}>
          <p title = {label} style={{whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis', maxWidth:'100%',display:'block'}} className="mb-0" id="TSSGUI_LabelStyles">
            &nbsp;&nbsp;{label}
            <span style={{ display: displayMandatory === "block" ? 'inline' : "none" }} className='mandatory'>*</span>
            &nbsp;&nbsp;
          </p>
        </legend>)}
       
       {enableDataList && datalistOptions.length>0 ? (
        
          <>
          <input
            ref={inputRef}
            autoComplete="on"
            list={`datalist_${label}`}
            id={`input_${label}`}
            name={label}
            title={properties.value}
            placeholder={placeholderName}
            {...properties}
            className="form-control dropdown-select-dark"
            onFocus={handleLegendNameOnFocus}
            onBlur={handleLegendNameOnBlur}
            onMouseLeave={handleMouseLeave}
            disabled={disabled}
            style={{
              border:"none",
              height: "25px",
              background: "none",
              position:"absolute",
              top: "30%",
              transform: "translateY(-50%)",
              marginLeft:"-7px",
              width: internalValidation === "formError" ? "86%" : "100%",
              marginTop: label !== "" ? "-4px" : "4px"
            }}
          />
          <datalist id={`datalist_${label}`}>
            {datalistOptions.map((element, index) => (
              <option key={index} value={element.value} />
            ))}
          </datalist>

          </>
        ) : (!enableDataList && inputInfo && !disabled ? (
        <CustomTooltipFeildSet content={inputInfo} theme="Light" >
          <div style={{ display: "flex", alignItems: "center",position:"relative",width:"100%" }}>
           {currencyUnit!=="" && !appendEnd && !enableDataList &&(
            <input
            className='form-control dropdown-select-dark'
            id="TSSGUI_InputTextFieldStyle"
            value={currencyUnit}
            readOnly={true}
            style={{marginLeft:"-14px",width:"auto",marginTop:`${label !=="" ? "-4px" : "4px"}`,fontSize:currencyUnit=="+" ? "25px":""}}
          />)}
          <input
            ref={inputRef}
            className='form-control dropdown-select-dark'
            id="TSSGUI_InputTextFieldStyle"
            placeholder={placeholderName}
            title={properties.value}
            {...properties}
            onFocus={handleLegendNameOnFocus}
            onBlur={handleLegendNameOnBlur}
            disabled={disabled}
            onMouseLeave={handleMouseLeave}
            name={name}
            style={{marginLeft:currencyUnit!=="" && !appendEnd ? "25px":label=="" ?"-15px": "-7px",marginRight:currencyUnit!=="" && appendEnd ? "20px": internalValidation === "formError" && currencyUnit!=="" && appendEnd ? "20px": "-7px",width: internalValidation === "formError" ? "86%" : currencyUnit!=="" && appendEnd ? "86%" : label=="" ? "auto":"95%" ,marginTop:`${label !=="" ? "-4px" : "10px"}`}}
          />
          {currencyUnit!=="" && appendEnd && !enableDataList && (<input
            className='form-control dropdown-select-dark'
            id="TSSGUI_InputTextFieldStyle"
            value={currencyUnit}
	    readOnly={true}
            style={{position:"absolute",marginLeft:internalValidation === "formError" && label=="" ? "55%": internalValidation !== "formError" && label=="" ? "75%" : internalValidation === "formError" && label!=="" ? "77%":"85%",width:"50px",marginTop:`${label !=="" ? "-6px" : "7px"}`,fontSize:currencyUnit=="+" ? "25px":""}}
          />)}
          </div>
        </CustomTooltipFeildSet>)
          :
          <>
          <div style={{ display: "flex", alignItems: "center",position:"relative",width:"100%" }}>
          {currencyUnit!=="" && !appendEnd && !enableDataList &&(
            <input
            className='form-control dropdown-select-dark'
            id="TSSGUI_InputTextFieldStyle"
            value={currencyUnit}
	    readOnly={true}
            style={{marginLeft:"-14px",width:"auto",marginTop:`${label !=="" ? "-4px" : "4px"}`,fontSize:currencyUnit=="+" ? "25px":""}}
          />)}
          <input
            ref={inputRef}
            className={`form-control dropdown-select-dark ${disabled ? 'tss-disableField' : ""}`}
            id="TSSGUI_InputTextFieldStyle"
            placeholder={placeholderName}
            {...properties}
            title={properties.value}
            onFocus={handleLegendNameOnFocus}
            onBlur={handleLegendNameOnBlur}
            onMouseLeave={handleMouseLeave}
            disabled={disabled}
            name={name}
            style={{marginLeft:currencyUnit!=="" && !appendEnd ? "25px":label=="" ?"-15px": "-7px",marginRight:currencyUnit!=="" && appendEnd ? "20px": internalValidation === "formError" && currencyUnit!=="" && appendEnd ? "20px": "-7px",width: internalValidation === "formError" ? "86%" : currencyUnit!=="" && appendEnd ? "86%" : label=="" ? "auto":"95%" ,marginTop:`${label !=="" ? "-4px" : "10px"}`}}
          />
           {currencyUnit!=="" && appendEnd && !enableDataList && (<input
            className='form-control dropdown-select-dark'
            id="TSSGUI_InputTextFieldStyle"
            value={currencyUnit}
	    readOnly={true}
            style={{position:"absolute",marginLeft:internalValidation === "formError" && label=="" ? "55%": internalValidation !== "formError" && label=="" ? "75%" : internalValidation === "formError" && label!=="" ? "77%":"85%",width:"50px",marginTop:`${label !=="" ? "-6px" : "7px"}`,fontSize:currencyUnit=="+" ? "25px":""}} 
          
          
          />)}
          </div>
          </>
        
        )}

        
        <CustomTooltipFeildSet content={tooltipMessage} theme="Dark">
          <TssIcon iconKey="tss_errorAlert" className={`tss-danger-icon ${label=="" ? 'formErrorIconLabelNull' : 'formErrorIcon'}`} />
        </CustomTooltipFeildSet>
      </fieldset>
    </div>
  );
};

export default TssTextBox;
