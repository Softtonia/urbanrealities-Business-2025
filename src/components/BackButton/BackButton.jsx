import React from 'react';
import { useNavigate } from 'react-router-dom';
import './BackButton.css';

const BackButton = ({ className = '', style = {} }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <button 
      onClick={handleBack} 
      className={`back-button ${className}`}
      style={style}
    >
      <img src="/arrow.png" alt="arrow" className='h-4 w-4' style={{height:'20px', width:'20px'}}/>
    </button>
  );
};

export default BackButton;
