import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BackButton from '../components/BackButton/BackButton';

function BreadCrum2(props) {
  const nav = useNavigate();

  return (
    <div className="add-propery-active-wraper m-0">
      <div className="listing-wraper d-flex align-center m-0">
        <BackButton />
        <p className="m-0" onClick={() => nav(props.tab)}>
          <span className="breadcrun-tab">Back</span>
        </p>
      </div>
    </div>
  );
}

export default BreadCrum2;

