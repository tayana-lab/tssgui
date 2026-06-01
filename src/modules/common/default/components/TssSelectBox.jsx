import React, { useState, useEffect, useRef } from 'react';
import CustomTooltipFeildSet from './CustomToolTipForFeildSet';
import TssIcon from '@modules/common/default/components/TssIcon';
import { useDispatch, useSelector } from 'react-redux';
const TssSelectBox = ({
  label="" ,
  mandatory = false,
  options = [],
  placeholder = "Select Options",
  defaultValue = {},
  onChange = () => {},
  disabled = false,
  validationTheme = "selectForm",
  tooltipMessage = "",
  useAutoWidth = false
}) => {


  const [displayMandatory, setDisplayMandatory] = useState(mandatory ? "block" : "none");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectOptionValue, setSelectionOptionValue] = useState(defaultValue.label || null);
  const [validation, setValidation] = useState(validationTheme);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const fieldSetRef = useRef(null);
  const dropdownRef = useRef(null);
  const optionsRef = useRef([]);
  const [displayRequiredIcon, setDisplayRequiredIcon] = useState(validation === "selectFormError");
  const darkMode = useSelector((state) => state.ui.darkMode);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  useEffect(() => {
    setValidation(validationTheme);
    setDisplayRequiredIcon(validationTheme === "selectFormError");
  }, [validationTheme]);



  //console.log(":::In component:::defaultValue::::::"+JSON.stringify(defaultValue));
  // useEffect(() => {
  //   if (defaultValue && defaultValue.label) {
  //     if (defaultValue.label == selectOptionValue) {
  //       setSelectionOptionValue(defaultValue.label);
  //     }
  //   }
  // }, [defaultValue, selectOptionValue]);

  

  useEffect(() => {
    if (defaultValue && defaultValue.label) {
        setSelectionOptionValue(defaultValue.label);
    }
  }, [defaultValue, selectOptionValue]);
  

  useEffect(() => {
    setDisplayRequiredIcon(validation === "selectFormError");
  }, [validation]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        fieldSetRef.current &&
        !fieldSetRef.current.contains(event.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleOptionSelect = (option) => {
    if (!disabled) {
      setSelectionOptionValue(option.label);
      onChange(option);
      setShowDropdown(false);
    }
  };

  const handleLegendNameOnFocus = () => {
    if (!disabled && validationTheme !== "selectFormError") {
      setValidation("selectHover");
    }
  };

  const handleLegendNameOnBlur = () => {
    if (!disabled && validationTheme !== "selectFormError") {
      setValidation("selectForm");
    }
  };

  const toggleDropDown = (event) => {
    if (!disabled) {
      const rect = fieldSetRef.current.getBoundingClientRect();
      setDropdownPosition({ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX, width: rect.width });
      setShowDropdown((prevShowDropdown) => !prevShowDropdown);
    }
  };

  
  const handleEnterKeyDropDown = (event) => {
  if (event.key === "Enter") {
    setShowDropdown(prevValue=>!prevValue);
  }
};

  const handleKeyDown = (event) => {
  if (!showDropdown) return;

  if (event.key === 'ArrowDown') {
    event.preventDefault();
    setHighlightedIndex((prevIndex) =>
      prevIndex < options.length - 1 ? prevIndex + 1 : 0
    );
  } else if (event.key === 'ArrowUp') {
    event.preventDefault();
    setHighlightedIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : options.length - 1
    );
  } else if (event.key === 'Enter' && highlightedIndex >= 0) {
    event.preventDefault();
    handleOptionSelect(options[highlightedIndex]);
  }
};

// Scroll the highlighted option into view
useEffect(() => {
  if (highlightedIndex >= 0 && optionsRef.current[highlightedIndex]) {
    optionsRef.current[highlightedIndex].scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
    });
  }
}, [highlightedIndex]);

  const handleMouseEnter = (index) => {
    setHighlightedIndex(index);
  };


  const shouldUseAutoWidth = options.length>0 && Array.isArray(options) && options.some(element => element.label && element.label.length > 30) || useAutoWidth;

  return (
    <div tabIndex={0} className="SelectContainer">
      <div tabIndex={0} onKeyDown={handleKeyDown} style={{ position: 'relative' }} className={`selectHover  ${validation} ${disabled ? 'tss-disableField' : ''}`}>
        <fieldset ref={fieldSetRef} className="p-2" id="TSSGUI_SelectFieldLabelStyle" style={{height:`${label !=="" ? "50px" : "43px"}`}}>
          <legend className="w-auto" style={{ position: 'relative', zIndex: 1 }}>
          {label !== "" && (
          <p className="mb-0"  title = {label} style={{whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis', maxWidth:'100%',display:'block'}} id="TSSGUI_LabelStyles">
            &nbsp;&nbsp;{label}
            <span
              style={{ display: label !== "" && displayMandatory === "block" ? 'inline' : "none" }}
              className='mandatory'
            >
              *
            </span>
            &nbsp;&nbsp;
          </p>
        )}
          </legend>
          
          <input
            className={`form-control dropdown-select-dark ${disabled ? 'tss-disableField' : ""}`}
            id="TSSGUI_SelectFieldStyle"
            placeholder={placeholder}
            onFocus={handleLegendNameOnFocus}
            onBlur={handleLegendNameOnBlur}
            onClick={toggleDropDown}
            value={selectOptionValue}
            title={selectOptionValue}
            readOnly
            onKeyDown={handleEnterKeyDropDown}
            tabIndex={0}
            title={selectOptionValue}
            disabled={disabled}
            style={{ cursor: disabled ? 'not-allowed' : 'default', width: displayRequiredIcon || !showDropdown || showDropdown ? "77%" : "100%" ,marginTop:`${label !=="" ? "-4px" : "1px"}`, whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis', maxWidth:displayRequiredIcon || !showDropdown || showDropdown ? "77%" : "100%" ,display:'block'}}
          />
          <div onClick={toggleDropDown} className="TSSGUI_SelectFieldDropDownIcon" style={{ zIndex: 1, cursor: disabled ? 'not-allowed' : 'pointer',marginTop:`${label !==""  ? "0%" : "10px" }`}}>
            {!showDropdown ? (
              <TssIcon iconKey="tss_dropdownOpen" className={`tss-dark-icon ${disabled ? 'tss-disableField' : ""}`} />
            ) : (
              <TssIcon iconKey="tss_dropdownClose" className={`tss-dark-icon ${disabled ? 'tss-disableField' : ""}`} />
            )}
          </div>
          {displayRequiredIcon && (
            <CustomTooltipFeildSet content={tooltipMessage} theme="Dark">
              <TssIcon iconKey="tss_errorAlert" className={label !=="" ? "tss-danger-icon SelctBoxRequiredIcon" : "tss-danger-icon SelctBoxRequiredIconLabelNull"}/>
            </CustomTooltipFeildSet>
          )}
        </fieldset>
        {showDropdown && !disabled && (
          <div ref={dropdownRef} style={{ position: "relative", zIndex: 9999 }}>
            <div
              className='TSSGUI_SelectFieldStyle no-option-dark' 
              style={{
                width: `${dropdownPosition.width}px`,
              }}

            >
              <ul style={{ margin: 0 }} id="tss-optionList" >
                {options.length > 0 ? options.map((element, index) => (
                  <React.Fragment key={index}>
                    <li
                      tabIndex={0}
                      ref={(el) => (optionsRef.current[index] = el)}
                      onClick={() => handleOptionSelect(element)}
                      onMouseEnter={() => handleMouseEnter(index)}
                      className={`options ${highlightedIndex === index ? 'tss-option-hover' : ''} ${element.value === defaultValue.value ? 'tss-selected-option' : ''}`}
                      title={element.label}  
                      style={{whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis', maxWidth:'100%',display:'block'}}                  
                    >
                      {element.label}
                    </li>
                    <li className='tss_avoid_list' ></li>
                  </React.Fragment>
                )) : (

                  <li className='defaultOptions' ><span>No Option Available</span></li>
                )}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TssSelectBox;
