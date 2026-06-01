import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import CustomTooltipFeildSet from './CustomToolTipForFeildSet';
import TssIcon from '@modules/common/default/components/TssIcon';

const TssTextArea = ({
  label,
  placeholder,
  validation = "form",
  properties,
  disabled = false,
  rows = 4,
  cols = 2,
  inputInfo = "",
  tooltipMessage = "",
  mandatory = false,
  value,
  onChange,handleOnBlur=()=>{},handleOnFocus=()=>{}
}) => {
  const [Validation, setValidation] = useState('form');
  const [internalValidation, setInternalValidation] = useState(disabled ? "formDisabled" : validation || "form");

  useEffect(() => {
    setInternalValidation(validation);
  }, [validation]);

  const handleLegendNameOnFocus = () => {
    if(handleOnFocus)
    {
       handleOnFocus(true)
    }  
    if (internalValidation === "formError" || internalValidation === "formSuccess") {
      return;
    }
    setValidation("formHover");
  };

  const handleLegendNameOnBlur = () => {
    if(handleOnFocus)
    {
       handleOnFocus(false)
    } 
    if (internalValidation === "formError" || internalValidation === "formSuccess") {
      return;
    }
    setValidation("form");
  };

  const handleMouseLeave = () => {
     if (internalValidation === "formError" || internalValidation === "formSuccess") {
   return;
  }
  setInternalValidation("form");
 }   

  return (
    <div className={`${internalValidation} ${disabled ? 'tss-disableField' : ""}`}>
      <fieldset className="p-2" id="TSSGUI_TextAreaFieldSetStyle">
        <legend className="w-auto" style={{ position: 'relative' }}>
          <p className="mb-0" id="TSSGUI_LabelStyles">
            &nbsp;&nbsp;{label}
            <span className='mandatory' style={{ display: mandatory ? "inline" : "none" }}>*</span>
            &nbsp;&nbsp;
          </p>
        </legend>

        {inputInfo ? (
          <CustomTooltipFeildSet content={inputInfo} theme="Light">
            <Form.Control
              as="textarea"
              className={`${internalValidation} ${disabled ? 'tss-disableField' : ""}`}
              rows={rows}
              cols={cols}
              placeholder={placeholder}
              id="TSSGUI_BootstrapTextArea"
               onFocus={(e) => handleOnFocus?.(true, label, e.target.selectionStart)}
              onBlur={() => handleOnFocus?.(false, label, null)}
              onClick={(e) => handleOnFocus?.(true, label, e.target.selectionStart)}
              onKeyUp={(e) => handleOnFocus?.(true, label, e.target.selectionStart)}
              onSelect={(e) => handleOnFocus?.(true, label, e.target.selectionStart)}
              value={value}              
              onChange={onChange}       
              {...properties}
              disabled={disabled}
            />
          </CustomTooltipFeildSet>
        ) : (
          <Form.Control
            as="textarea"
            className={`${internalValidation} ${disabled ? 'tss-disableField' : ""}`}
            rows={rows}
            cols={cols}
            placeholder={placeholder}
            id="TSSGUI_BootstrapTextArea"
            onFocus={(e) => handleOnFocus?.(true, fieldName, e.target.selectionStart)}
            onBlur={() => handleOnFocus?.(false, fieldName, null)}
            onClick={(e) => handleOnFocus?.(true, fieldName, e.target.selectionStart)}
            onKeyUp={(e) => handleOnFocus?.(true, fieldName, e.target.selectionStart)}
            onSelect={(e) => handleOnFocus?.(true, fieldName, e.target.selectionStart)}
            value={value}              
            onChange={onChange}       
            {...properties}
            disabled={disabled}
          />
        )}
      </fieldset>

      <CustomTooltipFeildSet content={tooltipMessage} theme="Dark">
        <TssIcon iconKey="tss_errorAlert" className="tss-danger-icon formTextAreaErrorIcon" />
      </CustomTooltipFeildSet>
    </div>
  );
};

export default TssTextArea;

