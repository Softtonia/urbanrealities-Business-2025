import React, { useContext, useEffect, useState } from "react";
import Layout from "../Layout/Layout";
import LeftNavbar from "../Layout/LeftNavbar";
import "../my-profile/MyProfile.css";
import Select from "react-select";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/MyStore";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import { get, post } from "../Api/api";
import customStyles from "../CustomStyle";
import BreadCrum2 from "../Layout/BreadCrum2";

function MyProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [businessCountries, setBusinessCountries] = useState([]);
  const [businessStates, setBusinessStates] = useState([]);
  const [businessCities, setBusinessCities] = useState([]);

  const [formData, setFormData] = useState({
    // Personal fields
    user_name: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    alternate_number: '',
    license_number: '',
    about_us: '',
    street_address: '',
    country_id: '',
    state_id: '',
    city_id: '',
    profile_photo: '',
    pin_code: '',
    rera_number: '',
    unique_id: '',
    // Business fields
    bussiness_name: '',
    bussiness_email: '',
    business_phone: '',
    bussiness_address: '',
    business_country_id: '',
    business_state_id: '',
    business_city_id: '',
    business_country: '',
    business_state: '',
    business_city: '',
    business_area_locality: '',
    business_colony: '',
    business_street_address: '',
    business_pin_code: '',
    aadhaar_number: '',
    aadhaar_front: '',
    aadhaar_back: '',
    business_proof: ''
  });

  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const safeValue = (val) => {
    return !val || val === 'null' || val === 'undefined' || val === 'N/A' ? '' : val;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result);
    reader.readAsDataURL(file);
    setImageFile(file);
  };

  const handleDrop = (e) => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); };
  const handleDragOver = (e) => { e.preventDefault(); };
  const handleFileChange = (e) => { handleFile(e.target.files[0]); setFormData({ ...formData, profile_photo: e.target.files[0] }); };

  // Fetch profile details
  useEffect(() => {
    get(`/api/get-details-byuserid?id=${id}`)
      .then(res => {
        setFormData(prev => ({ ...prev, ...res.data }));
        setImage(res.data.profile_photo || null);
      })
      .catch(err => console.log(err));
  }, [id]);

  // Fetch countries for personal
  useEffect(() => {
    get("/api/countries")
      .then(res => setCountries(res.data.map(c => ({ value: c.id, label: c.name }))))
      .catch(err => console.error(err));
  }, []);

  // Fetch states for personal
  useEffect(() => {
    if (!formData.country_id) return setStates([]);
    get(`/api/states/${formData.country_id}`)
      .then(res => setStates(res.data.map(s => ({ value: s.id, label: s.name }))))
      .catch(err => console.error(err));
  }, [formData.country_id]);

  // Fetch cities for personal
  useEffect(() => {
    if (!formData.state_id) return setCities([]);
    get(`/api/cities/${formData.state_id}`)
      .then(res => setCities(res.data.map(c => ({ value: c.id, label: c.name }))))
      .catch(err => console.error(err));
  }, [formData.state_id]);

  // Fetch countries for business
  useEffect(() => {
    get("/api/countries")
      .then(res => setBusinessCountries(res.data.map(c => ({ value: c.id, label: c.name }))))
      .catch(err => console.error(err));
  }, []);

  // Fetch states for business
  useEffect(() => {
    if (!formData.business_country_id) return setBusinessStates([]);
    get(`/api/states/${formData.business_country_id}`)
      .then(res => setBusinessStates(res.data.map(s => ({ value: s.id, label: s.name }))))
      .catch(err => console.error(err));
  }, [formData.business_country_id]);

  // Fetch cities for business
  useEffect(() => {
    if (!formData.business_state_id) return setBusinessCities([]);
    get(`/api/cities/${formData.business_state_id}`)
      .then(res => setBusinessCities(res.data.map(c => ({ value: c.id, label: c.name }))))
      .catch(err => console.error(err));
  }, [formData.business_state_id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = new FormData();
    Object.keys(formData).forEach(key => form.append(key, formData[key] || ''));
    post('/api/update-current-user-by-token', form)
      .then(res => { toast.success(res.data.message); navigate(`/my-account/my-profile/${id}`); })
      .catch(err => console.log(err));
  };

  return (
    <Layout>
      <div className="my-b-profile-wrape-2 mt-110">
        <div className="container">
          <div className="row my-profile-wrape-2-row">
            <div className="col-2 my-profile-wrape-2-col-2 header-col-2">
              <LeftNavbar />
            </div>
            <div className="col-10 my-profile-wrape-2-col-10 right-flex-grow">
                    <BreadCrum2/>
              <div className="my-profile-form-wraper">
                <div className="my-profile-form-content">
                  <div className="row">
                    <div className="col-8 m-auto">
                      <form onSubmit={handleSubmit}>
                        <div className="row">
                          <div className="col-12">
                            <div
                              className="logo-for-update-profile"
                              onDrop={handleDrop}
                              onDragOver={handleDragOver}
                            >
                              <input type="file" name="profileImage" onChange={handleFileChange} style={{ display: 'none' }} id="fileUpload" />
                              <label htmlFor="fileUpload" className="upload-label">
                                {image ? (
                                  <img src={image} alt="Profile" className="profile-image w-100 h-100" />
                                ) : (
                                  <div className="drag-drop-placeholder">
                                    <FontAwesomeIcon icon={faUpload} size="2x" />
                                  </div>
                                )}
                              </label>
                            </div>
                          </div>

                        <h3 className="section-title">Personal Details</h3>
                          {/* Personal Inputs */}
                          <div className="col-6">
                            <label>UserName</label>
                            <input type="text" name="user_name" value={safeValue(formData.user_name)} onChange={handleChange} />
                          </div>
                          <div className="col-6">
                            <label>First Name</label>
                            <input type="text" name="first_name" value={safeValue(formData.first_name)} onChange={handleChange} />
                          </div>
                          <div className="col-6">
                            <label>Last Name</label>
                            <input type="text" name="last_name" value={safeValue(formData.last_name)} onChange={handleChange} />
                          </div>
                          <div className="col-6">
                            <label>Email</label>
                            <input type="text" name="email" value={safeValue(formData.email)} onChange={handleChange} readOnly/>
                          </div>
                          <div className="col-6">
                            <label>Phone Number</label>
                            <input type="text" name="phone" value={safeValue(formData.phone)} onChange={handleChange}  />
                          </div>
                          <div className="col-6">
                            <label>Alternate Number</label>
                            <input type="text" name="alternate_number" value={safeValue(formData.alternate_number)} onChange={handleChange} />
                          </div>
                          <div className="col-6">
                            <label>RERA Number</label>
                            <input type="text" name="license_number" value={safeValue(formData.license_number)} onChange={handleChange} />
                          </div>
                          <div className="col-6">
                            <label>Country</label>
                            <Select
                              isClearable
                              styles={customStyles}
                              options={countries}
                              value={countries.find(c => c.value == formData.country_id) || null}
                              onChange={option => setFormData(prev => ({ ...prev, country_id: option?.value }))}
                            />
                          </div>
                          <div className="col-6">
                            <label>State</label>
                            <Select
                              isClearable
                              styles={customStyles}

                              options={states}
                              value={states.find(s => s.value == formData.state_id) || null}
                              onChange={option => setFormData(prev => ({ ...prev, state_id: option?.value }))}
                            />
                          </div>
                          <div className="col-6">
                            <label>City</label>
                            <Select
                              styles={customStyles}

                              isClearable
                              options={cities}
                              value={cities.find(c => c.value == formData.city_id) || null}
                              onChange={option => setFormData(prev => ({ ...prev, city_id: option?.value }))}
                            />
                          </div>
                          <div className="col-12">
                            <label>street Address</label>
                            <input type="text" name="street_address" value={safeValue(formData.street_address)} onChange={handleChange} />
                          </div>
                          <div className="col-12">
                            <label htmlFor="aboutMe">About Me</label>
                            <textarea
                              id="aboutMe"
                              className="form-control"
                              rows="5"
                              name="about_us"
                              value={safeValue(formData.about_us)}
                              onChange={handleChange}
                            ></textarea>
                          </div>

                          {/* Business Section */}
                          <h3 className="section-title mt-4">Business Details</h3>
                          <div className="col-6">
                            <label>Business Name</label>
                            <input type="text" name="bussiness_name" value={safeValue(formData.bussiness_name)} onChange={handleChange} />
                          </div>
                          <div className="col-6">
                            <label>Business Email</label>
                            <input type="text" name="bussiness_email" value={safeValue(formData.bussiness_email)} onChange={handleChange} />
                          </div>
                          <div className="col-6">
                            <label>Business Phone</label>
                            <input type="text" name="business_phone" value={safeValue(formData.business_phone)} onChange={handleChange} />
                          </div>
                          <div className="col-6">
                            <label>Business Country</label>
                            <Select
                              isClearable
                              styles={customStyles}
                              options={businessCountries}
                              value={businessCountries.find(c => c.value == formData.business_country_id) || null}
                              onChange={option => setFormData(prev => ({ ...prev, business_country_id: option?.value }))}
                            />
                          </div>
                          <div className="col-6">
                            <label>Business State</label>
                            <Select
                              isClearable
                              styles={customStyles}
                              options={businessStates}
                              value={businessStates.find(s => s.value == formData.business_state_id) || null}
                              onChange={option => setFormData(prev => ({ ...prev, business_state_id: option?.value }))}
                            />
                          </div>
                          <div className="col-6">
                            <label>Business City</label>
                            <Select
                              isClearable
                              styles={customStyles}
                              options={businessCities}
                              value={businessCities.find(c => c.value == formData.business_city_id) || null}
                              onChange={option => setFormData(prev => ({ ...prev, business_city_id: option?.value }))}
                            />
                          </div>
                          <div className="col-6">
                            <label>Business Area / Locality</label>
                            <input type="text" name="business_area_locality" value={safeValue(formData.business_area_locality)} onChange={handleChange} />
                          </div>
                          <div className="col-6">
                            <label>Business Colony</label>
                            <input type="text" name="business_colony" value={safeValue(formData.business_colony)} onChange={handleChange} />
                          </div>

                          <div className="col-6">
                            <label>Pin Code</label>
                            <input type="text" name="business_pin_code" value={safeValue(formData.business_pin_code)} onChange={handleChange} />
                          </div>
                          {/* <div className="col-12">
                            <label>Business Address</label>
                            <input type="text" name="bussiness_address" value={safeValue(formData.bussiness_address)} onChange={handleChange} />
                          </div> */}
                          <div className="col-12">
                            <label>Street Address</label>
                            <input type="text" name="business_street_address" value={safeValue(formData.business_street_address)} onChange={handleChange} />
                          </div>
                          {/* Other fields */}


                          <div className="col-12 text-center py-4">
                            <button type="submit" className="update-my-profile-btn-wraper"><span>Update Profile</span></button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default MyProfile;
