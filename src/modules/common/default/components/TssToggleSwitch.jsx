import React, { useState, useEffect } from 'react';

const ToggleSwitch = ({ label, options, onChange, defaultValue = "0" }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isOn, setIsOn] = useState(defaultValue == "1");

  useEffect(() => {
    //console.log("::::::::::isOn:::::::"+isOn)
    setIsOn(defaultValue == "1");
  }, [defaultValue]);

  const handleToggle = () => {
    const newValue = !isOn;
    setIsOn(newValue);
    onChange(newValue ? "1" : "0");
  };

  const currentLabel = isOn
    ? options.find(option => option.value == "1").label
    : options.find(option => option.value == "0").label;

  return (
    <div className="toggle-switch">
      <span className="label-text">{label}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;&nbsp;</span>
      <label className="switch">
        <input
          type="checkbox"
          checked={isOn}
          onChange={handleToggle}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          onFocus={() => setShowTooltip(true)}
          onBlur={() => setShowTooltip(false)}
        />
        <span className="slider"></span>
        {showTooltip && (
          <p className="tss-toggle-tooltipLight">
            {currentLabel}
          </p>
        )}
      </label>
    </div>
  );
};

export default ToggleSwitch;
