import React, { useState,useEffect,useId  } from 'react';
import CustomTooltipFeildSet from './CustomToolTipForFeildSet';
import TssIcon from '@modules/common/default/components/TssIcon';

const TssFileUpload = ({ label, mandatory,tooltipMessage = "", inputInfo = "Choose File", validation = "form", onFileChange,disabled = false ,acceptFileType="",defaultFileName=""}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const inputId = useId();

  const [internalValidation, setInternalValidation] = useState(disabled ? "formDisabled" : validation || "form");
  useEffect(() => {
    setInternalValidation(validation);
  }, [validation]);


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
   
    onFileChange(file);
  };

  const handleLegendNameOnFocus = () => {
    setInternalValidation("formHover");
  };

  const handleLegendNameOnBlur = () => {
    setInternalValidation("form");
  };

  return (
    <div className={`${internalValidation} ${disabled ? 'tss-disableField' : ""}`}>
      <fieldset className="p-2" id="TSSGUI_InputFileFieldSetStyle">
        <legend className="w-auto" style={{ position: 'relative' }}>
          <p className="mb-0" id="TSSGUI_InputTextFieldLabelStyle">
            &nbsp;&nbsp;{label}
            <span style={{ display: mandatory ? "inline" : "none" }} className='mandatory'>*</span>
          </p>
        </legend>
        <div className="FileDiv">
          <div className='TSSGUI_FileIputContainerStyle'>
            <input id={inputId} type="file" onChange={handleFileChange} disabled={disabled} style={{ display: 'none' }} accept={acceptFileType!==""? acceptFileType : ""}  />
            {!disabled ? (<CustomTooltipFeildSet content={selectedFile ? selectedFile.name : inputInfo} theme="Light">
              <input
                type="text"
                value={selectedFile ? selectedFile.name : defaultFileName}
                onFocus={handleLegendNameOnFocus}
                onBlur={handleLegendNameOnBlur}
                placeholder='Choose File'
                readOnly
                disabled={disabled}
                className='TSSGUI_FileIputStyle'
                onClick={() => document.getElementById(inputId).click()}
              />
              </CustomTooltipFeildSet>) : 
              <input
              type="text"
              value={selectedFile ? selectedFile.name : defaultFileName}
              onFocus={handleLegendNameOnFocus}
              onBlur={handleLegendNameOnBlur}
              placeholder='Choose File'
              readOnly
              disabled={disabled}
              className='TSSGUI_FileIputStyle'
              onClick={() => document.getElementById(inputId).click()} 
            />}

            <CustomTooltipFeildSet content={tooltipMessage} theme="Dark">
                <TssIcon iconKey="tss_errorAlert" className="tss-danger-icon formFileUploadErrorIcon" />
            </CustomTooltipFeildSet>
          </div>
           <button type="button" title="Browse" className="TSSGUI_FileIputButtonStyle" disabled={disabled} onClick={() => document.getElementById(inputId).click()}>Browse</button>
        </div>

      </fieldset>
    </div>
  );
};

export default TssFileUpload;
