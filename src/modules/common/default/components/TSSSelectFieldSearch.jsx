import React, { useState ,useEffect} from 'react';
import TssIcon from '@modules/common/default/components/TssIcon';
const TSSSelectFieldSearchComponent = ({ label="", mandatory=false ,options=[], defaultValue={}, onChange=()=>{}}) => {

  
  const [borderColor, setBorderColor] = useState("#BDBDBD");
  const [displayMandatory, setDisplayMandatory] = useState("none");
  const [showDropdown, setShowDropdown] = useState(false);
  const [listBackground, setListBackground] = useState("none");
  const [listIndex, setListIndex] = useState(null);
  const [optionColor, setOptionColor] = useState("black");
  const [searchQuery, setSearchQuery] = useState(defaultValue.label || "");
  const [selectOptionValue,setSelectionOptionValue] = useState(defaultValue.label || "");
  const [validation,setValidation] = useState("selectForm");


  useEffect(() => {
    setSelectionOptionValue(defaultValue ? defaultValue.label : "");
  }, [defaultValue]);

  
  const handleLegendNameOnFocus = () => {
    setDisplayMandatory(mandatory ? "block" : "none");
    setValidation("selectHover");
  };

  const handleLegendNameOnBlur = () => {
    setValidation("selectForm");
  };

  const toggleDropDown = () => {
    setShowDropdown(prevShowDropdown => !prevShowDropdown);
  };


  const handleMouseHover = (element) => {
    
    setSelectionOptionValue(element);
 
  };

  const handleMouseLeave = () => {
  
    setListBackground("none");
   
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setShowDropdown(true); 
  };

  const handleOptionSelect = (index, element) => {
    setListBackground("#007bff");
    setSearchQuery(element.label);
    onChange(element);
    setListIndex(index);
    setOptionColor("white");

  };

  


  const filterOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );


  const handleCloseDropdown = () =>
  {
    setShowDropdown(false);
  }

  return (
    <div style={{ position: 'relative' }} className={validation}>
      <fieldset className="p-2"  id="TSSGUI_SelectFieldLabelStyle" >
        <legend className="w-auto" style={{ position: 'relative', zIndex: 1 }}>
          <p className="mb-0" id="TSSGUI_LabelStyles">
            &nbsp;&nbsp;{label}&nbsp;&nbsp;<span style={{ display: displayMandatory === "block" ? 'inline' : "none", marginLeft: '5px' }} className='mandatory'>*</span>
          </p>
        </legend>
        <input
          className="form-control"
          id="TSSGUI_SelectFieldStyle"
          placeholder="Select Options"
          onFocus={handleLegendNameOnFocus}
          onBlur={handleLegendNameOnBlur}
          onClick={toggleDropDown}
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <div onClick={toggleDropDown} className="TSSGUI_SelectFieldDropDownIcon" style={{ zIndex: 1 }}>
        {
          !showDropdown ? (
        
            <TssIcon iconKey="tss_dropdownOpen" className="tss-dark-icon"/>
            )  :
          (
            <TssIcon iconKey="tss_dropdownClose" className="tss-dark-icon"/>
          )
         } 
        </div>
      </fieldset>
      {showDropdown && (
       <>
          {filterOptions.length > 0 ? (
            <div className="TSSGUI_SelectSeachFieldStyle" onMouseLeave={handleCloseDropdown}>
              <ul className="searchOptionList">
                {filterOptions.map((element, index) => (
                  <li
                    onClick={() => handleOptionSelect(index, element)}
                    onMouseOver={() => handleMouseHover(element.label)}
                    onKeyDown={() => handleMouseHover(element.label)}
                    onKeyUp={handleMouseLeave}
                    onMouseLeave={handleMouseLeave}
                    style={{
      
                      borderRadius: "5px",
                    }}
                    key={index}
                  >
                    {element.label}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className='dropdownDefault'>
              <ul >
                <li className='defaultOptions'><span>No Option Available</span></li>
              </ul>
            </div>
          )}
      </>
      )}
    </div>
  );
};

export default TSSSelectFieldSearchComponent;
