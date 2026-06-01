import React from 'react';

const TssCheckbox = ({ options, onCheckboxChange, columns = 5 ,uniqueId=""}) => {
  const handleChange = (index) => (event) => {
    onCheckboxChange(index, event.target.checked);
  };

  const gridTemplateColumns = `repeat(${columns}, 1fr)`;


  return (
    <div style={{ display: 'grid', gridTemplateColumns, gap: '10px', marginLeft: '2%' }}>
      {options.map((option, index) => (
        <div className="icheck-material-purple form-group"  key={index} >
          <input
            type="checkbox"
            id={`materialCheckBox${index}${uniqueId}`}
            name={`materialCheckBox${index}`}
            value={option.value}
            checked={option.defaultChecked}
            onChange={handleChange(index)}
          />
          <label style={{width:"200%"}} htmlFor={`materialCheckBox${index}${uniqueId}`}>{option.label}</label>
        </div>
      ))}
    </div>
  );
};

export default TssCheckbox;
