import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TssIconConfig from '@modules/conf/TssIcon';

/**
 * TssButton — primary action button.
 * Replaces all Bootstrap .btn / tss-btn-bg class combinations.
 * All props are preserved for backward compatibility.
 */
const TssButton = ({
  id = '',
  type = 'button',
  label = '',
  title = '',
  className = '',
  onClick,
  isDisabled = false,
  btnProps,
  iconSupport = true,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (!isDisabled && onClick) onClick();
  };

  return (
    <button
      id={id}
      type={type}
      className={`tss-btn ${isDisabled ? 'tss-btn-disabled' : ''} ${className}`}
      disabled={isDisabled}
      title={title}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-disabled={isDisabled}
      {...btnProps}
    >
      {label}

      {iconSupport && TssIconConfig[label] && (
        <>
          &nbsp;&nbsp;
          <FontAwesomeIcon
            icon={TssIconConfig[label].icon}
            beat={isHovered}
            spinPulse={
              isHovered && (label === 'Reset' || label === 'Add TimeZones')
            }
          />
        </>
      )}
    </button>
  );
};

export default TssButton;
