import axios from 'axios';
import React, { useState, createContext, useEffect } from 'react';
import { API_KEY } from '../config';
import { get } from '../Api/api';

export const AuthContext = createContext();

function MyStore({ children }) {
  const [auth, setAuth] = useState({
    id: '',
    email: '',
    is_login: false,
    phone: '',
    role: '',
    token: '',
    user_name: '',
    approved: '',
    kyc: ''

  });
  const initialFormData ={
    first_name: "",
    last_name: "",
    user_name: "",
    email: "",
    phone: "",
    country_id: "",
    state_id: "",
    city_id: "",
    area_locality: "",
    colony: "",
    street_address: "",
    pin_code: "",
    about: "",
    bussiness_name: "",
    bussiness_address: "",
    bussiness_email: "",
    business_phone: "",
    business_country_id: "",
    business_state_id: "",
    business_city_id: "",
    address: "",
    business_pin_code: "",
    license_number: "",
    alternate_number: "",
    about_us: "",
    business_area_locality: "",
    business_colony: "",
    business_street_address: "",
    aadhaar_number: "",
    profile_photo: null,
    aadhaar_front: null,
    aadhaar_back: null,
    business_proof: null
  }
  const [formData, setFormData] = useState(initialFormData);

  const resetFormData = () => setFormData(initialFormData);
  console.log(auth)
  console.log(formData)
  const [mount, setMount] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    let data = localStorage.getItem("auth");
    let parseData = data ? JSON.parse(data) : null;

    if (parseData) {
      const { id, email, token, phone, is_login, role, user_name, approved, kyc } =
        parseData;

      setAuth((prev) => ({
        ...prev,
        id,
        email,
        token,
        phone,
        is_login,
        role,
        user_name,
        approved,
        isapproved: approved,
        kyc

      }));

      setFormData((prev) => ({
        ...prev,
        id,
      }));

      setMount(true);
    }

    setLoadingAuth(false);
  }, []); // ✅ runs only once on mount



  useEffect(() => {
    if (mount && auth.token && auth.id) {
      const fetchDatabyId = async () => {
        try {
          const response = await get(`/api/get-details-byuserid?id=${auth.id}`);
          console.log('===', response.data.isapproved);
          const approved = response.data.isapproved
          const kyc = response.data.kyc
          const role_name = response.data.role_name
          if (response.data) {
            setAuth(prevAuth => {
              const updatedAuth = {
                ...prevAuth,
                approved: approved,
                isapproved: approved,
                kyc: kyc,
                role:role_name
              };
              localStorage.setItem('auth', JSON.stringify(updatedAuth));
              return updatedAuth;
            });
          }

          setMount(false);
        } catch (err) {
          console.log(err);
        }
      };
      fetchDatabyId();
    }
  }, [auth.token, auth.id, mount]);

  console.log('=====>', localStorage.getItem('auth'))
  return (
    <AuthContext.Provider value={{ auth, setAuth, formData, setFormData, loadingAuth, resetFormData }}>
      {children}
    </AuthContext.Provider>
  );
}

export default MyStore;
