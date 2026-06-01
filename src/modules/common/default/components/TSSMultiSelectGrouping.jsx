import React, { useState,useRef ,useEffect} from 'react';
import CustomTooltipFeildSet from './CustomToolTipForFeildSet'
import TssIcon from '@modules/common/default/components/TssIcon';
import ReactDOM from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
const TSSMultiSelectGrouping = (
  {options, 
   label, 
   mandatory=false ,
   disabled=false,
   onChange = () => {},
   isSeachable = true,
   selectAllOption =true,
   placeholder="Select Options",
   validationTheme = "selectForm",
   tooltipMessage ="",
   defaultValue = ""
  }) => {

  
  const [borderColor, setBorderColor] = useState("#BDBDBD");
  const [displayMandatory, setDisplayMandatory] = useState(mandatory ? "block" : "none");
  const [showDropdown, setShowDropdown] = useState(false);
  const [listIndex, setListIndex] = useState(null);
  const [optionColor, setOptionColor] = useState("black");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [selectAllBackground, setSelectAllBackground] = useState("");
  const [selectAll, setSelectAll] = useState(false);
  const [groupBackground, setGroupBackground] = useState("");
  const [group, setGroup] = useState(false);
  const [displaySelectAll,setDisplaySelectAll] = useState("flex");
  const [displayClearOptionsIcon,setDisplayClearOptionsIcon] = useState(false);
  const [validation,setValidation] = useState(validationTheme);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const [displayRequiredIcon, setDisplayRequiredIcon] = useState(validation === "selectFormError");
  
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [groupHighlightedIndex,seGrouptHighlightedIndex] = useState(-1);
  const groupOptionsRef = useRef([]);
  const optionsRef = useRef([]);

  var checkedOptions = []
  const fieldSetRef = useRef(null);
  const dropdownRef = useRef(null);
 const darkMode = useSelector((state) => state.ui.darkMode); 
 useEffect(() => {
    setValidation(validationTheme);
    setDisplayRequiredIcon(validationTheme === "selectFormError");
  }, [validationTheme]);


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
	  

  // useEffect(() => {
  //   const allOptions = options.flatMap(group => group.options.map(option => option.label));
  //   if (defaultValue === "Select All") {
  //     setSelectedOptions(allOptions);
  //     setSelectAll(true);
	  //     A
  //     setDisplayClearOptionsIcon(true);
  //   }
  // }, [defaultValue, options]);


 useEffect(() => {
  const allOptionLabels = options.flatMap(group => group.options.map(option => option.label));

  if (Array.isArray(defaultValue) && defaultValue.includes("Select All")) {
    setSelectedOptions(allOptionLabels);
    setSelectAll(true);
    setDisplayClearOptionsIcon(true);
  }
  else if (Array.isArray(defaultValue) && defaultValue.length === allOptionLabels.length) {
    setSelectedOptions(allOptionLabels);
    setSelectAll(true);
    setDisplayClearOptionsIcon(true);
  }
  else if (Array.isArray(defaultValue) && defaultValue.length > 0) {
    const defaultLabels = defaultValue.flatMap(value =>
      options.flatMap(group =>
        group.options.filter(option => option.value === value).map(option => option.label)
      )
    );
    setSelectedOptions(defaultLabels);
    setSelectAll(false);
    setDisplayClearOptionsIcon(defaultLabels.length > 0);
  }
  else {
    setSelectedOptions([]);
    setSelectAll(false);
    setDisplayClearOptionsIcon(false);
  }
}, [defaultValue, options]);

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
      setDisplayClearOptionsIcon(selectedOptions.length==0 ? false :true)
    }
   }
  };

  const handleSearchChange = (event) => {
    if (!disabled) {
    setSearchQuery(event.target.value);
    setShowDropdown(true);
    }
  };



	  

  const handleSelectAll = (event) => {
    //console.log("Checked status:", event.target.checked); // true or false
    
    if (!disabled) {
      var allOptions = options.flatMap(group => group.options.map(option => option.label));
      if(event.target.checked)
      {
          setDisplayClearOptionsIcon(true)
          setSelectedOptions(allOptions);
          setSelectAll(true);
          //setDisplayRequiredIcon(selectAll ? true : false)
          var selectedOptionsValue = allOptions.flatMap(option => {
            return options.flatMap(group => {
              return group.options.filter(item => item.label === option).map(item => item.value);
            });
          });
          
          onChange(selectedOptionsValue);
      }
      else
      {
          setDisplayClearOptionsIcon(false)
          setSelectedOptions([]);
          setSelectAll(false);
          onChange([]);
      }
         
   
    }
  };


  const handleOptionSelect = (value, event) => {
  if (event) {
    event.stopPropagation();
  }

  if (!disabled) {
    setSelectedOptions(prevSelectedOptions => {
      let newSelectedOptions;

      if (prevSelectedOptions.includes(value)) {
        newSelectedOptions = prevSelectedOptions.filter(option => option !== value);
      } else {
        newSelectedOptions = [...prevSelectedOptions, value];
      }

      newSelectedOptions = [...new Set(newSelectedOptions)];


      const selectedOptionsValue = newSelectedOptions.flatMap(option =>
        options.flatMap(group =>
          group.options
            .filter(item => item.label === option)
            .map(item => item.value)
        )
      );

      const allOptions = options.flatMap(group => group.options.map(option => option.label));
      setSelectAll(newSelectedOptions.length === allOptions.length);
  
      setDisplayClearOptionsIcon(newSelectedOptions.length > 0);
      onChange(selectedOptionsValue);

      return newSelectedOptions;
    });
  }
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

  
  // const handleGroupSelect = (label, groupIndex, event) => {
  //   if (event) {
  //     event.stopPropagation();
  //   }
  //   if (!disabled) {
  //     const group = options[groupIndex];
  //     const groupValues = group.options.map(option => option.label);
  //     const newSelectedOptions = [...selectedOptions];
  //     const groupAlreadySelected = groupValues.every(value => newSelectedOptions.includes(value));
  
  //     if (groupAlreadySelected) {
  //       // Deselect all options in the group
  //       groupValues.forEach(value => {
  //         const index = newSelectedOptions.indexOf(value);
  //         if (index !== -1) {
  //           newSelectedOptions.splice(index, 1);
  //         }
  //       });
  //       setDisplayClearOptionsIcon(newSelectedOptions.length > 0);
  //     } else {
  //       // Select all options in the group
  //       groupValues.forEach(value => {
  //         if (!newSelectedOptions.includes(value)) {
  //           newSelectedOptions.push(value);
  //         }
  //       });
  //       setDisplayClearOptionsIcon(true);
  //     }
  //     const selectedOptionsValue = newSelectedOptions.flatMap(option => {
  //       return options.flatMap(group => {
  //         return group.options.filter(item => item.label === option).map(item => item.value);
  //       });
  //     });
     
  //     setSelectedOptions(newSelectedOptions);
  
  //     const allOptions = options.flatMap(group => group.options.map(option => option.label));
  //     setSelectAll(newSelectedOptions.length === allOptions.length);
  //     setGroup(!group);

  //     console.log(":::::selectedOptionsValue:::::::"+selectedOptionsValue+":::::newSelectedOptions:::::::"+newSelectedOptions)
  //     onChange(selectedOptionsValue);
  //   }
  // };


  const handleGroupSelect = (label, groupIndex, event) => {
  if (event) {
    event.stopPropagation();
  }
  if (!disabled) {
    const group = options[groupIndex];
    const groupValues = group.options.map(option => option.label);
    let newSelectedOptions = [...selectedOptions];
    const groupAlreadySelected = groupValues.every(value => newSelectedOptions.includes(value));

    if (groupAlreadySelected) {
      newSelectedOptions = newSelectedOptions.filter(val => !groupValues.includes(val));
    } else {
      newSelectedOptions = Array.from(new Set([...newSelectedOptions, ...groupValues]));
    }

    setDisplayClearOptionsIcon(newSelectedOptions.length > 0);

    const selectedOptionsValue = Array.from(new Set(
      newSelectedOptions.flatMap(optionLabel =>
        options.flatMap(group =>
          group.options
            .filter(item => item.label === optionLabel)
            .map(item => item.value)
        )
      )
    ));

    setSelectedOptions(newSelectedOptions);

    const allOptions = options.flatMap(group => group.options.map(option => option.label));
    setSelectAll(newSelectedOptions.length === allOptions.length);

    setGroup(prev => !prev);
    onChange(selectedOptionsValue);
  }
};
  

  
  const deleteOption = () => {
    const allLabels = options.flatMap(option => {
      const mainOptionLabels = option.label;
      const subOptionsLabels = option.options.map(o => o.label);
      return [mainOptionLabels, ...subOptionsLabels];
    });
  
    if (selectAll && allLabels.length === filterOptions.length) {
      setSelectedOptions([]);
      setSelectAllBackground('');
      setGroupBackground('');
      setSelectAll(false);
      checkedOptions = [];
    } else {
      setSelectedOptions(prevSelectedOptions => {
        const newSelectedOptions = prevSelectedOptions.slice(0, -1);
        checkedOptions = newSelectedOptions;
        return checkedOptions;
      });
       setDisplayClearOptionsIcon(checkedOptions.length == 1 ? false : true);
    }

    const selectedOptionsValue = checkedOptions.flatMap(option => {
      return options.flatMap(group => {
        return group.options.filter(item => item.label === option).map(item => item.value);
      });
    });
    onChange(selectedOptionsValue);
    
  };
  
  useEffect(()=>{
          if(selectedOptions.length==0)
          {
             setDisplayClearOptionsIcon(false);
          }
  },[selectedOptions]);

  const suboptions = options.flatMap(option => option.options.map(optionSub => optionSub.label));
  

  const handleCloseDropdown = () =>
  {    
    if (!disabled) {
        setShowDropdown(false);
    }
  }


 const handleKeyDown = (event) => {
  if (!showDropdown) return;

  if (event.key === 'ArrowDown') {
    event.preventDefault();

      // Navigate normal options
      setHighlightedIndex((prevIndex) =>
        prevIndex < filterOptions.length - 1 ? prevIndex + 1 : 0
      );
  } 
  else if (event.key === 'ArrowUp') {
    event.preventDefault();

      setHighlightedIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : filterOptions.length - 1
      );
  } 
  else if (event.key === 'Enter') {
    event.preventDefault();

    if (highlightedIndex >= 0) {
      // Enter on normal option
      handleOptionSelect(filterOptions[highlightedIndex]?.label);
    }
  }
};

   useEffect(() => {
   if (highlightedIndex >= 0 && optionsRef.current[highlightedIndex]) {
     optionsRef.current[highlightedIndex].scrollIntoView({
       behavior: 'smooth',
       block: 'nearest',
     });
   }
 }, [highlightedIndex]);


 useEffect(() => {
   if (groupHighlightedIndex >= 0 && optionsRef.current[groupHighlightedIndex]) {
     groupOptionsRef.current[groupHighlightedIndex].scrollIntoView({
       behavior: 'smooth',
       block: 'nearest',
     });
   }
 }, [groupHighlightedIndex]);


 const handleMouseEnter = (index) => {
   setHighlightedIndex(index);
 };


 const handleGroupMouseEnter = (index) => {
   seGrouptHighlightedIndex(index);
 };

 const handleEnterKeyDropDown = (event) => {
   if (event.key === "Enter") {
    setShowDropdown(prevValue=>!prevValue);

   }
 };

  return (
    <div tabIndex={0} className="SelectContainer">
    <div tabIndex={0} onKeyDown={handleKeyDown} style={{outline: 'none',position: 'relative' }} className={`selectHover ${validation} ${disabled ? 'tss-disableField' : ''}`}  >
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
          value={options.length > 0 ? suboptions.length === selectedOptions.length ? "All Options are Selected" : selectedOptions.length >=4 ? selectedOptions.length+ " Options are Selected" : selectedOptions.join(', ') : ""}
          onChange={() => {}}
          title={options.length > 0 ? suboptions.length === selectedOptions.length ? "All Options are Selected" : selectedOptions.length >=4 ? selectedOptions.length+ " Options are Selected" : selectedOptions.join(', ') : ""}
          readOnly
          tabIndex={0}
          onKeyDown={handleEnterKeyDropDown}
          style={{ cursor: disabled ? 'not-allowed' : 'default',width: (displayClearOptionsIcon || displayRequiredIcon) ? "78%" : "90%" }}
        />
         {/* </CustomTooltipFeildSet> */}
        {displayClearOptionsIcon && (
       
          <TssIcon iconKey="tss_removeOptions" className="tss-dark-icon TSSGUI_RemoveOptionIconStyle" onClick={deleteOption}/>

        //  <TssIcon iconKey="tss_removeOptions" className="tss-dark-icon" id="tss-multiSelectGrouping-removeOptions" onClick={deleteOption} />
      )}

      
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
          <ul id="tss-multiselect-optionlist">

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
            {selectAllOption &&  options.length>0 && filterOptions.length > 1 &&
            <li className={`TSSGUI_SelectFieldSelectAllOption ${selectAll? 'tss-multiSelect-option' : '' }`}  onClick={handleSelectAll}>
              <input type='checkbox' onClick={handleSelectAll} readOnly checked={selectAll}  style={{ marginTop: "2px",marginLeft:"5px"}} /> &nbsp;&nbsp;&nbsp;Select All
            </li>
            }
            <li style={{width:"auto",height: "5px",background:"none"}}></li>
            { filterOptions.map((group, groupIndex) => (
              <React.Fragment key={groupIndex}>
                {group.type == "group" && (
                  <>
                  <li 
                   title={group.label}
                   ref={(el) => (groupOptionsRef.current[groupIndex] = el)}
                   onMouseEnter={()=>handleGroupMouseEnter(groupIndex)}
                   style={{whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis', maxWidth:'100%',display:'block'}}
                   className={`group-label ${groupHighlightedIndex  === groupIndex ? 'tss-option-hover' : groupBackground !== "" ? 'tss-multiSelect-option' : '' } `}
                   id="MultiSelectMainOptionstyles" 
                   onClick={(event) => { event.stopPropagation(); handleGroupSelect(group.label,group.groupIndex)}}>
                    <input
                      type='checkbox'
                      readOnly
                      checked={
                        (() => {
                          const groupObj = options.find(gr => gr.label === group.label);
                          if (!groupObj || !groupObj.options?.length) return false;
                         
                          const groupLabels = groupObj.options.map(option => option.label);
                          return groupLabels.every(label => selectedOptions.includes(label));
                        })()
                      }

                      onClick={() => handleGroupSelect(group.label,group.groupIndex)}
                      style={{ marginTop: "2px" ,marginLeft:"5px"}}
                    /> &nbsp;&nbsp;&nbsp;{group.label}
                  </li>

                   <li style={{width:"auto",height: "5px",display:"none"}}></li>
                   </>               
                )}
                {group.type !== "group" && (
                  <>
                  <li
                    ref={(el) => (optionsRef.current[groupIndex] = el)}
                    className={`options ${highlightedIndex === groupIndex ? 'tss-option-hover' : selectedOptions.includes(group.label)? 'tss-multiSelect-option' : '' } `}
                    onMouseOver={handleMouseHover}
                    onMouseLeave={handleMouseLeave}
                    onMouseEnter={handleMouseEnter}
                    key={groupIndex}
                    title={group.label}
                    id="TSSGUI_MultiSelectOptionsStyle"
                    onClick={() => handleOptionSelect(group.label)}
                    style={{whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis', maxWidth:'100%',display:'block'}}
                  >
                    <input type='checkbox' readOnly checked={selectedOptions.includes(group.label)}   onClick={(event) => { event.stopPropagation(); handleOptionSelect(group.label); }} style={{ marginTop: "2px" ,marginLeft:"10px"}} /> &nbsp;&nbsp;&nbsp;{group.label}
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

export default TSSMultiSelectGrouping;
