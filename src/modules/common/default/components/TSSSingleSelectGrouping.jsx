import React, { useState,useRef ,useEffect} from 'react';
import CustomTooltipFeildSet from './CustomToolTipForFeildSet'
import TssIcon from '@modules/common/default/components/TssIcon';
import ReactDOM from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
const TSSSingleSelectGrouping = (
  {options, 
   label, 
   mandatory=false ,
   disabled=false,
   onChange = () => {},
   isSeachable = true,
   //selectAllOption =true,
   placeholder="Select Options",
   validationTheme = "selectForm",
   tooltipMessage ="",
   defaultValue = "",
   //displaySelectAllOption = false
  }) => {

  const [borderColor, setBorderColor] = useState("#BDBDBD");
  const [displayMandatory, setDisplayMandatory] = useState(mandatory ? "block" : "none");
  const [showDropdown, setShowDropdown] = useState(false);
  const [listIndex, setListIndex] = useState(null);
  const [optionColor, setOptionColor] = useState("black");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOptions, setSelectedOptions] = useState(defaultValue.label || "");
  const [selectAllBackground, setSelectAllBackground] = useState("");
  //const [selectAll, setSelectAll] = useState(false);
    const [selectOptionValue, setSelectionOptionValue] = useState(defaultValue.label || "");
  const [groupBackground, setGroupBackground] = useState("");
  const [group, setGroup] = useState(false);
  const [displaySelectAll,setDisplaySelectAll] = useState("flex");
 // const [displayClearOptionsIcon,setDisplayClearOptionsIcon] = useState(false);
  const [validation,setValidation] = useState(validationTheme);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const [displayRequiredIcon, setDisplayRequiredIcon] = useState(validation === "selectFormError");
  var checkedOptions = []
  const fieldSetRef = useRef(null);
  const dropdownRef = useRef(null);
 const darkMode = useSelector((state) => state.ui.darkMode); 
 useEffect(() => {
    setValidation(validationTheme);
    setDisplayRequiredIcon(validationTheme === "selectFormError");
  }, [validationTheme]);

  useEffect(() => {
    setSelectedOptions(defaultValue.label || "");
  }, [defaultValue]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        fieldSetRef.current &&
        !fieldSetRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);




  const handleLegendNameOnFocus = () => {
    if (!disabled && validationTheme !== "selectFormError") {
    // setDisplayMandatory(mandatory ? "block" : "none");
    setValidation("selectHover");
    }
  };

  const handleLegendNameOnBlur = () => {
    if (!disabled && validationTheme !== "selectFormError") {
    // setValidation(mandatory ? "selectFormError":"selectForm");
    setValidation("selectForm");
    }
  };

  const toggleDropDown = () => {
    if (!disabled) {
      const rect = fieldSetRef.current.getBoundingClientRect();
      setDropdownPosition({ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX, width: rect.width });
      
    setShowDropdown(prevShowDropdown => !prevShowDropdown);
    if (!showDropdown) {
      setListIndex(null);
      setSearchQuery("");
    //  setDisplayClearOptionsIcon(selectedOptions.length==0 ? false :true)
    }
   }
  };

  const handleSearchChange = (event) => {
    if (!disabled) {
    setSearchQuery(event.target.value);
    setShowDropdown(true);
    }
  };




const handleOptionSelect = (value) => {
    setSelectedOptions(value.label);
    onChange(value);   
  };
  
  

  const handleMouseHover = () => {
    if (!disabled) {
    setOptionColor("black");
    }
  };

  const handleMouseLeave = () => {
    if (!disabled) {
    setOptionColor("black");
    }
  };

  const handleSearchClear = () => {
    if (!disabled) {
    setSearchQuery("");
    }
  }
  

  const filterOptions = options.flatMap((group, groupIndex) => {
    const hasMatchingOption = group.options.some(option =>
      option.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
  
    if (hasMatchingOption || group.label.toLowerCase().includes(searchQuery.toLowerCase())) {
      return [
        { type: "group", label: group.label, groupIndex },
        ...group.options.filter(option =>
          option.label.toLowerCase().includes(searchQuery.toLowerCase())
        )
      ];
    }
    
    return [];
  });

  
  const handleGroupSelect = (label, groupIndex, event) => {
    if (event) {
      event.stopPropagation();
    }
    if (!disabled) {
      const group = options[groupIndex];
      const groupValues = group.options.map(option => option.label);
      const newSelectedOptions = [...selectedOptions];
      const groupAlreadySelected = groupValues.every(value => newSelectedOptions.includes(value));
  
      if (groupAlreadySelected) {
        // Deselect all options in the group
        groupValues.forEach(value => {
          const index = newSelectedOptions.indexOf(value);
          if (index !== -1) {
            newSelectedOptions.splice(index, 1);
          }
        });
      } else {
        // Select all options in the group
        groupValues.forEach(value => {
          if (!newSelectedOptions.includes(value)) {
            newSelectedOptions.push(value);
          }
        });
      }
      const selectedOptionsValue = newSelectedOptions.flatMap(option => {
        return options.flatMap(group => {
          return group.options.filter(item => item.label === option).map(item => item.value);
        });
      });
     
      setSelectedOptions(newSelectedOptions);
  
      const allOptions = options.flatMap(group => group.options.map(option => option.label));
      setGroup(!group);
      onChange(selectedOptionsValue);
    }
  };
  

  const suboptions = options.flatMap(option => option.options.map(optionSub => optionSub.label));
  

  const handleCloseDropdown = () =>
  {    
    if (!disabled) {
        setShowDropdown(false);
    }
  }


  return (
    <div onMouseLeave={handleCloseDropdown}>
    <div style={{ position: 'relative' }} className={`selectHover ${validation} ${disabled ? 'tss-disableField' : ''}`}  >
      <fieldset ref={fieldSetRef} className="p-2 selectHover "  id="TSSGUI_SelectFieldLabelStyle">
        <legend className="w-auto" style={{ position: 'relative', zIndex: 1 }}>
          <p className="mb-0" id="TSSGUI_LabelStyles"  title = {label} style={{whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis', maxWidth:'100%',display:'block'}}>
          &nbsp;&nbsp;{label}<span style={{ display: displayMandatory === "block" ? 'inline' : "none"}} className='mandatory'>*</span>&nbsp;&nbsp;
          </p>
        </legend>
        {/* <CustomTooltipFeildSet content={selectedOptions.length>0 ? selectedOptions.join(', '): "Select Options"}  theme="Dark"> */}
        <input
          className='form-control dropdown-select-dark'
          id="TSSGUI_SelectFieldStyle"
          placeholder={placeholder}
          onFocus={handleLegendNameOnFocus}
          onBlur={handleLegendNameOnBlur}
          onClick={toggleDropDown}
          value={selectedOptions}
          title={selectedOptions}
          onChange={() => {}}
          readOnly
          style={{ cursor: disabled ? 'not-allowed' : 'default'}}
        />
             
        <div onClick={toggleDropDown} className="TSSGUI_SelectFieldDropDownIcon" style={{ zIndex: 1 }}>
          {!showDropdown ? (
              <TssIcon iconKey="tss_dropdownOpen" className="tss-dark-icon"/>
          ) : (
              <TssIcon iconKey="tss_dropdownClose" className="tss-dark-icon"/>
          )}
        </div>

        
        {displayRequiredIcon  && (
        <CustomTooltipFeildSet content={tooltipMessage} theme="Dark"> 
        <TssIcon iconKey="tss_errorAlert" className="tss-danger-icon SelctBoxRequiredIcon" />
         </CustomTooltipFeildSet>
        )} 
      </fieldset>

      {showDropdown && !disabled && (
        <div ref={dropdownRef} className='TSSGUI_SelectSearchOptionStyle'
        
        style={{
          position: "absolute",
          top: "100%",
          left: 0,
          width: `${dropdownPosition.width}px`,
          zIndex: 9999
         
        }}
     >
          <ul id="tss-singleselect-optionlist">

           {isSeachable && options.length>0 &&(
           <>
           <li style={{ marginTop:"2px" ,display:"inline",position:"relative",width:"auto",height: "5px"}}>
              
              <input
                className='TSSGUI_SelectSearchBoxStyle'
                placeholder="Search"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            
              <TssIcon iconKey="tss_inputClear" className="tss-dark-icon tss-inputClearStyle"  onClick={handleSearchClear}/>
            </li>

            <li style={{ height: "10%",display:"none" }}></li>
            </>
           )
            }
            {filterOptions.length > 0 && (
            <>
            <li style={{width:"auto",height: "5px"}}></li>
            { filterOptions.map((group, groupIndex) => (
              <React.Fragment key={groupIndex}>
                {group.type === "group" && (
                  <>
                  <li 
                   style={{whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis', maxWidth:'100%',display: 'block'}}
                   className={`group-label `}
                   title={group.label}
                   id="MultiSelectMainOptionstyles" 
                   //onClick={(event) => { event.stopPropagation(); handleGroupSelect(group.label,group.groupIndex)}}
                   >
                    {group.label}
                  </li>

                   <li style={{width:"auto",height: "5px",display:"none"}}></li>
                   </>               
                )}
                {group.type !== "group" && (
                  <>
                  <li
                    className={`options ${selectedOptions == group.label ? 'tss-singleSelectGrouping-option-select' : 'tss-singleSelectGrouping-option' } `}
                    onMouseOver={handleMouseHover}
                    title={group.label}
                    onMouseLeave={handleMouseLeave}
                    key={groupIndex}
                    id="TSSGUI_MultiSelectOptionsStyle"
                    onClick={() => handleOptionSelect(group)}
                    style={{whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis', maxWidth:'100%',display:'block'}}
                  >
                      &nbsp;&nbsp;&nbsp;{group.label}
                  </li>
                  <li style={{width:"auto",height: "3px",display:"none"}}></li>
                  </>
                )}
              </React.Fragment>
            ))}
            </>
            )}
            {filterOptions.length === 0  && (
              <ul>
                <li className='defaultOptions'><span>No Option Available</span></li>
              </ul>  
            )

            }
          </ul>
        </div>
      )}
    </div>
    </div>
  );
};

export default TSSSingleSelectGrouping;
