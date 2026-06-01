import React from 'react';
import '@modules/common/default/scss/TssCommonCss.scss';

const TssCircularProgressBar = ({ size = 40, strokeWidth = 5, progress = 0, color = "#4caf50", bgColor = "#e6e6e6" }) => {
  const center = size / 2;
  const radius = center - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg width={size} height={size} className="tss-circular-progress-bar">
      {/* Background circle */}
      <circle
        cx={center}
        cy={center}
        r={radius}
        stroke={bgColor}
        strokeWidth={strokeWidth}
        fill="none"
      />
      {/* Progress circle */}
      <circle
        cx={center}
        cy={center}
        r={radius}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${center} ${center})`}
      />
      {/* Text */}
      <text
        x="50%"
        y="50%"
        dominantBaseline="central"
        textAnchor="middle"
        fontSize="0.7em"
	fontWeight="bold"   
        fill={color}
      >
        {`${Math.round(progress)}%`}
      </text>
    </svg>
  );
};

export default TssCircularProgressBar;

