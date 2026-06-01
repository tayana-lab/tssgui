import React from 'react';

const TssRadioButton = ({ options, onChange, columns = 7 ,uniqueId=""}) => {
  const handleChange = (value) => (event) => {
    onChange(value, event.target.checked);
  };

  const gridTemplateColumns = `repeat(${columns}, 1fr)`;

  return (
    <div style={{ display: 'grid', gridTemplateColumns, gap: '10px', marginLeft: '2%',marginTop:"4%" }}>
      {options.map((option) => (
        <div className="icheck-material-purple form-group" key={option.value} style={{ display: 'flex', alignItems: 'center' }}>
          <input
            type="radio"
            id={`radioType${uniqueId}${option.value}`}
            name="radioType"
            value={option.value}
            onChange={handleChange(option.value)}
            defaultChecked={option.defaultChecked}
            style={{ marginRight: '8px' }}
          />
          <label htmlFor={`radioType${uniqueId}${option.value}`} style={{ margin: 0 }}>
            {option.label}
          </label>
        </div>
      ))}
    </div>
  );
};

export default TssRadioButton;
