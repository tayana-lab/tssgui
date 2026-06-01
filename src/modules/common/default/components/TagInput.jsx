import React, { useState, useRef,useEffect } from "react";
import CustomTooltipFeildSet from './CustomToolTipForFeildSet';
import TssIcon from '@modules/common/default/components/TssIcon';
import { useDispatch, useSelector } from 'react-redux';

const TagInput =({label,placeholder,mandatoryValidation=false,mandatory=false,onChange=()=>{},numericValidation=false,alphanumericValidation=false,minLength=0,maxLength=0,defaultValue=[],startsWithValidation=false,startsWith="",inputInfo=""}) =>{
  const [tags, setTags] = useState([]);
  const inputRef = useRef(null);
  const [isInputEmpty, setIsInputEmpty] = useState(true);
  const [validationTheme,setValidationTheme] = useState("form")
  const [tooltipMessage,setToolTipMessage] = useState("")
  const darkMode = useSelector((state) => state.ui.darkMode);

  useEffect(()=>{
    if(mandatoryValidation)
    {
      setValidationTheme("formError")
      setToolTipMessage("Mandatory!")
    }  
    else
    {
      setValidationTheme(darkMode ? "formHoverDark" : "formHover")
      setToolTipMessage("")
    }
  },[mandatoryValidation])
  useEffect(() => {
  if (defaultValue && defaultValue.length > 0) {
    const cleaned = defaultValue.filter(tag => tag && tag.trim() !== "");
    setTags(cleaned);
  } else {
    setTags([]);
  }
}, [defaultValue]);
  
 const buildRegex = ({
  numericValidation,
  alphanumericValidation,
  startsWithValidation,
  startsWith = "",
  minLength = 0,
  maxLength = 0,
}) => {
  let baseSet = "."; // default: any char

  if (numericValidation) {
    baseSet = "\\d"; // only digits
  } else if (alphanumericValidation) {
    baseSet = "\\w\."; // letters, digits, underscore
  }

  let lengthPart = "";
  if (minLength > 0 || maxLength > 0) {
    if (maxLength > 0) {
      lengthPart = `{${minLength},${maxLength}}`;
    } else {
      lengthPart = `{${minLength},}`;
    }
  } else {
    lengthPart = "*";
  }

  if (startsWithValidation && startsWith) {
    const escaped = startsWith.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const effectiveMin = Math.max(0, minLength - escaped.length);
    const effectiveMax =
      maxLength > 0 ? Math.max(0, maxLength - escaped.length) : "";

    const restPart =
      effectiveMax !== ""
        ? `{${effectiveMin},${effectiveMax}}`
        : `{${effectiveMin},}`;

    return new RegExp(`^${escaped}${baseSet}${restPart}$`);
  }

  return new RegExp(`^${baseSet}${lengthPart}$`);
};


  const handleKeyDown = (e) => {
  const regex = buildRegex({
    numericValidation,
    alphanumericValidation,
    startsWithValidation,
    startsWith,
    minLength,
    maxLength
  });

  if (e.key === "Enter" || e.key === ",") {
    e.preventDefault();
    const value = inputRef.current.innerText.trim();

    if (value && regex.test(value)) {
      if (!tags.includes(value)) {
        setValidationTheme(darkMode ? "formHoverDark" : "formHover");
        onChange([...tags, value],"formHover");
        setTags([...tags, value]);
        inputRef.current.innerText = "";
      } else {
        onChange([...tags],"formError");
        setValidationTheme("formError");
        setToolTipMessage("Duplicate " + label);
      }
    } else {
     onChange([...tags],"formError");
      setValidationTheme("formError");

      // Build custom tooltip
      if (startsWithValidation && numericValidation) {
        setToolTipMessage(
          `Value must start with "${startsWith}", contain only digits, and be between ${minLength} and ${maxLength} characters`
        );
      } else if (startsWithValidation && alphanumericValidation) {
        setToolTipMessage(
          `Value must start with "${startsWith}", contain only alphanumeric characters, and be between ${minLength} and ${maxLength} characters`
        );
      } else if (numericValidation) {
        setToolTipMessage(
          `Please enter numeric values with min: ${minLength} and max: ${maxLength} digits`
        );
      } else if (alphanumericValidation) {
        setToolTipMessage(
          `Please enter alphanumeric values with min: ${minLength} and max: ${maxLength} characters`
        );
      } else if (startsWithValidation) {
        setToolTipMessage(
          `Value must start with "${startsWith}" and be between ${minLength} and ${maxLength} characters`
        );
      } else {
        setToolTipMessage("Invalid input");
      }
    }
  } else if (e.key === "Backspace" && inputRef.current.innerText === "") {
    onChange(tags.slice(0, -1),validationTheme);
    setTags(tags.slice(0, -1));
  }
};

  const handleInputChange = (e) => {
    setIsInputEmpty(!e.target.textContent.trim());
  };

  const removeTag = (index) => {
    const updatedTags = tags.filter((_, i) => i !== index);
    onChange(updatedTags)
    setTags(updatedTags);

    if (updatedTags.length === 0) {
      setIsInputEmpty(true);
    }
  };

  
  return (
  <div style={{ zIndex: "1" }} className={`${validationTheme}`}>
  <fieldset
    className={darkMode ? "tag-container p-2 selectHoverDark" : "tag-container p-2 selectHover"}
    id="TssTagInputFieldSetStyle"
    onClick={() => inputRef.current.focus()}
  >
    <legend className="w-auto" style={{ position: "relative" }}>
      <p
        title={label}
        style={{
          color: "#757575",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          maxWidth: "100%",
          display: "block"
        }}
        className="mb-0"
        id="TSSGUI_LabelStyles"
      >
        &nbsp;&nbsp;{label}
        <span
          style={{ display: mandatory ? "inline" : "none" }}
          className="mandatory"
        >
          *
        </span>
        &nbsp;&nbsp;
      </p>
    </legend>

    {tags.length > 0 &&
      tags.map((tag, index) => {
        return (
          tag !== "" && (
            <div
              key={index}
              className={darkMode ? "tagDark" : "tag" }
              style={{ marginTop: "-6px", marginBottom: "6px" }}
            >
              <span className={darkMode ? "tag-textDark" : "tag-text"}>{tag}</span>
              <button
                type="button"
                style={{color:darkMode ? "#a1a7ac" : "black"}}
                onClick={() => removeTag(index)}
                className="remove-button"
              >
                &times;
              </button>
            </div>
          )
        );
      })}


    <div className="tag-input-wrapper">
        {inputInfo!=="" ? <CustomTooltipFeildSet content={inputInfo} theme="Light">
          <>
            <div
              className={darkMode ? "tag-inputDark TSSInputTagFieldStyleDarkTheme" : "tag-input TSSInputTagFieldStyle"}
              contentEditable
              style={{
                overflowX: "auto",
                wordBreak: "break-word",
                whiteSpace: "pre-wrap", // or 'normal'
                color:darkMode ? "#a1a7ac" : "black",
                maxWidth: "100%",
                display: "block"
              }}
              ref={inputRef}
              onKeyDown={handleKeyDown}
              onInput={handleInputChange}
            />
            {isInputEmpty && (
              <span className="placeholder">{placeholder}</span>
            )}
          </>
        </CustomTooltipFeildSet> : 
        <>
            <div
              className="tag-input TSSInputTagFieldStyle"
              contentEditable
              style={{
                overflowX: "auto",
                wordBreak: "break-word",
                whiteSpace: "pre-wrap", // or 'normal'
                maxWidth: "100%",
                display: "block"
              }}
              ref={inputRef}
              onKeyDown={handleKeyDown}
              onInput={handleInputChange}
            />
            {isInputEmpty && (
              <span className="placeholder">{placeholder}</span>
            )}
          </>}
    </div>


    <CustomTooltipFeildSet content={tooltipMessage} theme="Dark">
      <TssIcon
        iconKey="tss_errorAlert"
        className="tss-danger-icon formTagInputErrorIcon"
      />
    </CustomTooltipFeildSet>
  </fieldset>
</div>

  
  );
}

export default TagInput;
