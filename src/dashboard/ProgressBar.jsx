import React, { useEffect, useState } from 'react';

const ProgressBar = ({ percentage }) => {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const progress = percentage;
    const circumference = 2 * Math.PI * 30; // Adjusted radius for 70px width

    const offsetValue = circumference - (progress / 100) * circumference;
    setOffset(offsetValue);
  }, [percentage]);

  return (
    <svg className='circular-progress22' width='70' height='70'> {/* Updated width and height */}
      <circle
        className='circular-progress-bg'
        cx='35' // Adjusted center X coordinate
        cy='35' // Adjusted center Y coordinate
        r='30' // Adjusted radius
        fill='transparent'
        stroke='#eee'
        strokeWidth='5' // Reduced stroke width for better appearance
      />
      <circle
        className='circular-progress-fill'
        cx='35' // Adjusted center X coordinate
        cy='35' // Adjusted center Y coordinate
        r='30' // Adjusted radius
        fill='transparent'
        stroke='#4caf50'
        strokeWidth='5' // Reduced stroke width for better appearance
        strokeDasharray='188' // Adjusted strokeDasharray based on the new circumference
        strokeDashoffset={offset}
        transition='stroke-dashoffset 0.5s'
      />
      <text x='35' y='40' className='circular-progress-text' textAnchor="middle">
        {percentage}% {/* Display the percentage inside the circle */}
      </text>
    </svg>
  );
};

export default ProgressBar;
