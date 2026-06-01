import React, { useState, useEffect, useRef } from 'react';
import TssIcon from '@modules/common/default/components/TssIcon';
import CustomTooltipFeildSet from './CustomToolTipForFeildSet';
import { useDispatch, useSelector } from 'react-redux';

const TssInputSelectBoxSearch = ({
  label = "",
  mandatory = false,
  options = [],
  onChange = (index, element) => {},
  defaultValue = {},
  disabled = false,
  isSeachable = true,
  placeholder = "Select Options",
  onSelect = () => {},
  validationTheme = "selectForm",
  tooltipMessage = "",
  maxLength = true
}) => {
  const [searchQuery, setSearchQuery] = useState(defaultValue.label || "");
  const [selectOptionValue, setSelectionOptionValue] = useState(defaultValue.label || "");
  const [validation, setValidation] = useState(validationTheme);
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const [displayRequiredIcon, setDisplayRequiredIcon] = useState(validation === "selectFormError");
  const searchInputRef = useRef(null);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const optionsRef = useRef([]);
  const fieldSetRef = useRef(null);
  const dropdownRef = useRef(null);
  const darkMode = useSelector((state) => state.ui.darkMode);

  useEffect(() => {
    setValidation(validationTheme);
    setDisplayRequiredIcon(validationTheme === "selectFormError");
  }, [validationTheme]);

  // useEffect(() => {
  //   setSearchQuery(defaultValue.label || "");
  //   setSelectionOptionValue(defaultValue.label || "");
  // }, [defaultValue]);

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
    
    toggleDropDown()
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
    if (!disabled) {
      const rect = fieldSetRef.current.getBoundingClientRect();
      setDropdownPosition({ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX, width: rect.width });
      setShowDropdown(prevShowDropdown => !prevShowDropdown);
      if (!showDropdown) {
        setTimeout(() => {
          if (searchInputRef.current) {
            searchInputRef.current.focus();
          }
        }, 0);

        setSearchQuery("");
      }
    }
  };

  const handleSearchChange = (event) => {
    // if (!disabled) {
    //   setSearchQuery(event.target.value);
    //   setHighlightedIndex(0);
    // }
  };

  const handleInputSearchChange = (event) => {
    if (!disabled) {
      setSearchQuery(event.target.value);
    }
  };


  const handleOptionSelect = (index, element) => {
  setSearchQuery(element.label)
    setSelectionOptionValue(element.label);
    setShowDropdown(false);
    onChange(index, element);
    onSelect(element);
  };

  const filterOptions = options.filter(option => {
    const searchStr = searchQuery ? searchQuery.toString().toLowerCase() : '';
    return option.label.toString().toLowerCase().includes(searchStr);
  });


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
      handleOptionSelect(highlightedIndex, filterOptions[highlightedIndex]);
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

  const shouldUseAutoWidth = options && options.length > 0 && Array.isArray(options) && options.some(element => element.label && element.label.length > 30);

  const handleMouseEnter = (index) => {
    setHighlightedIndex(index);
  };

  return (
    <div>
      <div tabIndex={0} onKeyDown={handleKeyDown} style={{ outline: 'none', width: '100%' }}>
        <div style={{ position: 'relative' }} className={`selectHover ${validation} ${disabled ? 'tss-disableField' : ''}`}>
          <fieldset ref={fieldSetRef} className="p-2" id="TSSGUI_SelectFieldLabelStyle">
            <legend className="w-auto" style={{ position: 'relative', zIndex: 1 }}>
              <p className="mb-0" id="TSSGUI_LabelStyles"  title = {label} style={{whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis', maxWidth:'100%',display:'block'}}>
                &nbsp;&nbsp;{label}<span style={{ display: mandatory ? 'inline' : "none" }} className='mandatory'>*&nbsp;&nbsp;</span>
                &nbsp;&nbsp;
              </p>
            </legend>
            <input
              className={`form-control dropdown-select-dark ${disabled ? 'tss-disableField' : ''}`}
              id="TSSGUI_SelectFieldStyle"
              placeholder={placeholder}
              onFocus={handleLegendNameOnFocus}
              onBlur={handleLegendNameOnBlur}
              onChange={handleInputSearchChange}   
              value={searchQuery}
              disabled={disabled}
              style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
            />
            <div onClick={toggleDropDown} className="TSSGUI_SelectFieldDropDownIcon">
              {!showDropdown ? (
                <TssIcon iconKey="tss_dropdownOpen" className="tss-dark-icon" />
              ) : (
                <TssIcon iconKey="tss_dropdownClose" className="tss-dark-icon" />
              )}
            </div>
            {displayRequiredIcon && (
              <CustomTooltipFeildSet content="Mandatory" theme="Dark">
                <TssIcon iconKey="tss_errorAlert" className="tss-danger-icon SelctBoxRequiredIcon" />
              </CustomTooltipFeildSet>
            )}
          </fieldset>
          {showDropdown && !disabled && (
            <div
              ref={dropdownRef}
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                zIndex: 9999,
                width: `${dropdownPosition.width}px`,
              
              }}
              className='TSSGUI_SelectSearchOptionStyle no-option-dark'
            >
              <ul id="tss-optionList">
                {isSeachable && options.length < 0 && (
                  <>
                    <li style={{ marginBottom: "10px", display: "none" }}></li>
                    <li style={{ display: "inline", position: "relative", marginTop: "2px",whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis', maxWidth:'100%',display:'block' }}>
                            
                      <input
                        ref={searchInputRef}
                        className='TSSGUI_SelectSearchBoxStyle'
                        placeholder="Search"
                        onChange={handleSearchChange}
                        disabled={disabled}
                      />
                    </li>
                  </>
                )}
                <li style={{ height: "12%", display: "none" }}></li>
                {filterOptions.length > 0 ? (
                  filterOptions.map((element, index) => (
                    <li
                      ref={(el) => (optionsRef.current[index] = el)}
                      onMouseEnter={() => handleMouseEnter(index)}
			                className={`options ${highlightedIndex === index ? 'tss-selected-option' : ''} ${element.value === defaultValue.value ? 'tss-selected-option' : ''}`}
                      onClick={() => handleOptionSelect(index, element)}
                      key={index}
                      style={{whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis', maxWidth:'100%',display:'block'}}
                      title={element.label}
                    >
                      {element.label}
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
    </div>
  );
};

export default TssInputSelectBoxSearch;

