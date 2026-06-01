import React, { useState, useEffect, useRef } from 'react';
import TssIcon from '@modules/common/default/components/TssIcon';
import CustomTooltipFeildSet from './CustomToolTipForFeildSet';
import { useDispatch, useSelector } from 'react-redux';

const TssMultiSelectBox = ({
  label = "",
  mandatory = false,
  options,
  defaultValue = "",
  onSelect = () => {},
  isSeachable = false,
  selectAllOption = false,
  disabled = false,
  placeholder = "Select Options",
  validationTheme = "selectForm",
  tooltipMessage = "",
  disableOptions=[] 	
}) => {
  const [borderColor, setBorderColor] = useState("#BDBDBD");
  const [displayMandatory, setDisplayMandatory] = useState(mandatory ? true : false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [listBackground, setListBackground] = useState("none");
  const [listIndex, setListIndex] = useState(null);
  const [optionColor, setOptionColor] = useState("black");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [selectAllBackground, setSelectAllBackground] = useState("");
  const [selectAll, setSelectAll] = useState(false);
  const [displayClearOptionsIcon, setDisplayClearOptionsIcon] = useState(false);
  const [validation, setValidation] = useState(validationTheme);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const [displayRequiredIcon, setDisplayRequiredIcon] = useState(validation === "selectFormError");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const optionsRef = useRef([]);
	
  const fieldSetRef = useRef(null);
  const dropdownRef = useRef(null);
  var checkedOptions = [];
  var clearedOptions = [];

  useEffect(() => {
    if(selectedOptions.length>0)
    {
      setDisplayClearOptionsIcon(true)
    }
    else
    {
       setDisplayClearOptionsIcon(false);
    }   
  },[selectedOptions]);  
  useEffect(() => {
    setValidation(validationTheme);
    setDisplayRequiredIcon(validationTheme === "selectFormError");
  }, [validationTheme]);
const darkMode = useSelector((state) => state.ui.darkMode);
  useEffect(() => {
    if (defaultValue === "Select All") {
      const allOptionValues = options.map(option => option.value);
      setSelectedOptions(allOptionValues);
      setSelectAll(true);
      setDisplayClearOptionsIcon(true);
    } else if (Array.isArray(defaultValue) && defaultValue.length > 0) {
      const defaultValues = defaultValue.map(option => option.value);
      setSelectedOptions(defaultValues);
      setSelectAll(false);
      setDisplayClearOptionsIcon(defaultValues.length > 0);
    } else if (defaultValue && defaultValue.value) {
      const defaultValueValue = defaultValue.value;
      setSelectedOptions([defaultValueValue]);
      setSelectAllBackground(""); 
      setDisplayClearOptionsIcon(true);
      setSelectAll(false);
    }
  }, [defaultValue, options]); 

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

  const toggleDropDown = () => {
    if(!disabled)
    {
    const rect = fieldSetRef.current.getBoundingClientRect();
    setDropdownPosition({ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX, width: rect.width });
    setShowDropdown(prevShowDropdown => !prevShowDropdown);
    if (!showDropdown) {
      setListIndex(null);
      setListBackground("none");
      setOptionColor("black");
      setSearchQuery("");
      setSelectAllBackground(selectedOptions.length === filterOptions.length && filterOptions.length > 1 ? "#e3f2fd" : "");
    }
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setShowDropdown(true);
  };

  const handleSelectAll = () => {
    var filteredOptionValues=[]	  
    if(disableOptions.length>0)
    {
       filteredOptionValues = filterOptions.filter(option => !disableOptions.some(dis => dis.value === option.value)).map(option => option.value);
    }
    else
    {
        filteredOptionValues = filterOptions.map(option => option.value);
    }
	  
    const allFilteredOptionsSelected = filteredOptionValues.every(option => selectedOptions.includes(option));

    if (allFilteredOptionsSelected) {
      setDisplayClearOptionsIcon(false);
      setSelectedOptions(selectedOptions.filter(option => !filteredOptionValues.includes(option)));
      setSelectAllBackground("");
      onSelect([]);
    } else {
      setDisplayClearOptionsIcon(true);
      const setOptionsSelectAll = filteredOptionValues.filter(option => !selectedOptions.includes(option));
      setSelectedOptions([...selectedOptions, ...setOptionsSelectAll]);
      setSelectAllBackground("#e3f2fd");
      onSelect([...selectedOptions, ...setOptionsSelectAll]);
    }
  };

  const handleOptionSelect = (element, event) => {
    if (event) {
      event.stopPropagation();
    }

    setSelectedOptions(prevSelectedOptions => {
      if (prevSelectedOptions.includes(element.value)) {
        setDisplayClearOptionsIcon(false);
        checkedOptions = prevSelectedOptions.filter(option => option !== element.value);
        onSelect(checkedOptions);
        return prevSelectedOptions.filter(option => option !== element.value);
      } else {
        checkedOptions = [...prevSelectedOptions, element.value];
        setDisplayClearOptionsIcon(checkedOptions.length > 1 ? true : false);
        onSelect(checkedOptions);
        return [...prevSelectedOptions, element.value];
      }
    });
  };

  const handleSearchClear = () => {
    setSearchQuery("");
  };

  const deleteOption = () => {
    let clearedOptions = [];
  
    if (selectedOptions.length === filterOptions.length) {
      setDisplayClearOptionsIcon(false);
      setSelectedOptions([]);
      setSelectAllBackground('');
      onSelect(clearedOptions);
      // console.log(":::::::::clearedOptions all::::::::"+clearedOptions)
    } else {
      setSelectedOptions(prevSelectedOptions => {
        clearedOptions = prevSelectedOptions.slice(0, prevSelectedOptions.length - 1);
        onSelect(clearedOptions);
        return clearedOptions;  // Return the new state
      });
    }
  
    setDisplayClearOptionsIcon(selectedOptions.length == 0 ? false : true);
    //setDisplayRequiredIcon(mandatory && clearedOptions.length === 0 ? true : false);
  };
  

  // const filterOptions = options.filter(option =>
  //   option.label.toLowerCase().includes(searchQuery.toLowerCase())
  // );

  const filterOptions = options.filter(option =>
    option.label.toString().toLowerCase().includes(searchQuery.toString().toLowerCase())
  );
  const handleCloseDropdown = () => {
    setShowDropdown(false);
  };

  const shouldUseAutoWidth = options && options.length>0 && Array.isArray(options) && options.some(element => element.label && element.label.length > 25);

  const handleKeyDown = (event) => {
    if (!showDropdown) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setHighlightedIndex((prevIndex) =>
        prevIndex < filterOptions.length - 1 ? prevIndex + 1 : 0
      );
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setHighlightedIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : filterOptions.length - 1
      );
    } else if (event.key === 'Enter' && highlightedIndex >= 0) {
      event.preventDefault();
      setShowDropdown(true);
      handleOptionSelect(filterOptions[highlightedIndex]);
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

  const handleEnterKeyDropDown = (event) => {
    if (event.key === "Enter") {
     setShowDropdown(prevValue=>!prevValue);

    }
  };

  return (
    <div tabIndex={0} className="SelectContainer">
      <div tabIndex={0} onKeyDown={handleKeyDown} style={{ outline: 'none',position: 'relative' }} className={`${validation} ${disabled ? 'tss-disableField' : ''}`} >
        <fieldset ref={fieldSetRef} className="p-2" id="TSSGUI_SelectFieldLabelStyle" style={{display:"flex"}}>
          <legend className="w-auto" style={{ position: 'relative', zIndex: 1 }}>
            <p className="mb-0" id="TSSGUI_LabelStyles"  title = {label} style={{whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis', maxWidth:'100%',display:'block'}}>
            &nbsp;&nbsp;{label}<span style={{ display: displayMandatory ? 'inline' : "none" }} className='mandatory'>*</span>&nbsp;&nbsp;
            </p>
          </legend>
          <input
            className={`form-control dropdown-select-dark  ${disabled ? 'tss-disableField' : ''} `}
            id="TSSGUI_SelectFieldStyle"
            placeholder={placeholder}
            onFocus={handleLegendNameOnFocus}
            onBlur={handleLegendNameOnBlur}
            onClick={toggleDropDown}
            value={options.length > 0 ? selectedOptions.length === options.length ? "All Options are Selected" : selectedOptions.length >= 3 ? selectedOptions.length + " Options are Selected" : selectedOptions.map(optionValue => options.find(option => option.value == optionValue)?.label).join(', ') : ""}
            onChange={() => {}}
            readOnly
            disabled={disabled}
            tabIndex={0}
            title = {options.length > 0 ? selectedOptions.length === options.length ? "All Options are Selected" : selectedOptions.length >= 3 ? selectedOptions.length + " Options are Selected" : selectedOptions.map(optionValue => options.find(option => option.value == optionValue)?.label).join(', ') : ""}
            onKeyDown={handleEnterKeyDropDown}
            style={{ cursor: disabled ? 'not-allowed' : 'pointer', width: (displayClearOptionsIcon || displayRequiredIcon) ? "78%" : "90%",whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis', maxWidth:(displayClearOptionsIcon || displayRequiredIcon) ? "68%" : "90%",display:'block', flexGrow: 1,minWidth: 0  }}
          />
          {displayClearOptionsIcon && (
            
            <TssIcon iconKey="tss_removeOptions" className="tss-dark-icon TSSGUI_RemoveOptionIconStyle" onClick={deleteOption}
            />
          
          )}
          <div onClick={toggleDropDown} className='TSSGUI_SelectFieldDropDownIcon'  style={{ zIndex: 1 }}>
            {!showDropdown ? (
              <TssIcon iconKey="tss_dropdownOpen" className='tss-dark-icon' />
            ) : (
              <TssIcon iconKey="tss_dropdownClose" className="tss-dark-icon" />
            )}
          </div>

          {displayRequiredIcon && (
            <CustomTooltipFeildSet content={tooltipMessage} theme="Dark">
              <TssIcon iconKey="tss_errorAlert" className="tss-danger-icon SelctBoxRequiredIcon" onHover={()=>{setShowDropdown(false)}}/>
            </CustomTooltipFeildSet>
          )}
        </fieldset>
        {showDropdown && (
          <div ref={dropdownRef} className='TSSGUI_SelectSearchOptionStyle  checkbox-bg-dark'
            style={{
              width: `${dropdownPosition.width}px`,       
              zIndex: 9999,
            }}
          >
            <ul id='tss-multiselect-optionlist'   >

              {isSeachable && options.length > 0 && <li style={{ display: "inline", position: "relative", marginTop: "2px" }}>
                <input
                  className='TSSGUI_SelectSearchBoxStyle'
                  placeholder="Search"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  disabled={disabled}
                />
                <TssIcon iconKey="tss_inputClear" className='tss-dark-icon tss-inputClearStyle'   onClick={handleSearchClear} />
              </li>
              }
              {selectAllOption && options.length > 0 && filterOptions.length > 1 && <li onClick={handleSelectAll} className={`TSSGUI_SelectFieldSelectAllOption  ${selectedOptions.length === filterOptions.length && filterOptions.length > 0 ? 'tss-multiSelect-option' : ''} `} >
                <input type='checkbox' onClick={(event) => { event.stopPropagation(); handleSelectAll(); }} checked={
    selectAll ? selectAll : disableOptions.length === 0
      ? selectedOptions.length === filterOptions.length && filterOptions.length > 0
      : filterOptions
          .filter(option => !disableOptions.some(dis => dis.value === option.value))
          .every(enabledOption => selectedOptions.includes(enabledOption.value))
  } style={{ marginTop: "2px", marginLeft: "10px" }} disabled={disabled} /> &nbsp;&nbsp;&nbsp;Select All
              </li>
              }
              {filterOptions.length > 0 ? (
                filterOptions.map((element, index) => (
			
                  <li 
                    ref={(el) => (optionsRef.current[index] = el)}
                    onMouseEnter={() => handleMouseEnter(index)}
                    title={element.label}      
                    style={{whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis', maxWidth:'100%',display:'block',cursor:disableOptions.length>0 && disableOptions.filter(opt => opt.value == element.value).length>0 ? "not-allowed":"default" }}
                    onClick={disableOptions.some(opt => opt.value == element.value) ? "" : () => handleOptionSelect(element)} className={`options ${disableOptions.length>0 && disableOptions.filter(opt => opt.value == element.value).length>0 ?  'tss-multiSelect-option-disabled' : highlightedIndex === index && selectedOptions.includes(element.value) ? 'tss-option-hover' : selectedOptions.includes(element.value) ? 'tss-multiSelect-option' : ''} `}
                    key={index}
                    id="TSSGUI_MultiSelectOptionsStyle"
                  >
                    <input type='checkbox' title={element.label} onClick={(event) => { event.stopPropagation(); handleOptionSelect(element); }} checked={selectedOptions.includes(element.value)} style={{position: "relative",top: "2px",cursor:disableOptions.some(opt => opt.value == element.value) ? "not-allowed":"default"  }} disabled={disableOptions.some(opt => opt.value == element.value)} /> &nbsp;&nbsp;&nbsp;{element.label}
                  </li>
                ))
              ) : (
                <li className='defaultOptions'><span>No Option Available</span></li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default TssMultiSelectBox;
