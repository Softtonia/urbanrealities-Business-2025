import React, { useContext, useEffect, useState } from "react";
import Layout from "../Layout/Layout";
import LeftNavbar from "../Layout/LeftNavbar";
import "../my-profile/MyProfile.css";
import axios from "axios";
import Select from "react-select";
import { useParams } from "react-router-dom";
import { API_KEY } from "../config";
import { AuthContext } from "../context/MyStore";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import { get, post } from "../Api/api";

function MyProfile() {
  const { id } = useParams();
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [formData, setFormData] = useState({
    about_us: '',
    address: '',
    alternate_number: '',
    business_phone: '',
    bussiness_address: '',
    bussiness_email: '',
    bussiness_name: '',
    city: '',
    country: '',
    email: '',
    first_name: '',
    user_name: '',
    last_name: '',
    id: '',
    license_number: '',
    phone: '',
    // pin_code: '',
    rera_number: '',
    state: '',
    city_id: '',
    country_id: '',
    state_id: '',
    // unique_id: '',
    profile_photo: '',
    pin_code: '123211'
  });
  console.log(formData)
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null); // New state for the image file
  const { auth } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFile = (file) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
    setImageFile(file); // Store the file in state
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    handleFile(file);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    handleFile(file);
    setFormData({
      ...formData,
      profile_photo: file
    })
  };

  useEffect(() => {
    get(`/api/get-details-byuserid?id=${id}`)
      .then(response => {
        const { about_us, city_id, country_id, state_id, user_name, address, alternate_number, business_phone, bussiness_address, bussiness_email, bussiness_name, city, country, email, first_name, last_name, license_number, phone, pin_code, rera_number, state, unique_id, profile_photo } = response.data;
        setFormData({
          about_us, user_name, city_id, country_id, state_id, address, alternate_number, business_phone, bussiness_address, bussiness_email, bussiness_name, city, country, email, first_name, last_name, id, license_number, phone, pin_code: '123456', rera_number, state, unique_id, profile_photo, isapproved: auth.approved
        });
        setImage(profile_photo); // Set the image from the backend
      })
      .catch(err => {
        console.log(err);
      });
  }, [id]);


  // Fetch countries on mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await get("/api/countries");
        setCountries(res.data.map(c => ({ value: c.id, label: c.name })));
      } catch (err) {
        console.error("Failed to fetch countries:", err);
      }
    };
    fetchCountries();
  }, []);

  // Fetch states whenever country changes
  useEffect(() => {
    if (!formData.country_id) {
      setStates([]);
      setCities([]);
      return;
    }

    const fetchStates = async () => {
      try {
        const res = await get(`/api/states/${formData.country_id}`);
        setStates(res.data.map(s => ({ value: s.id, label: s.name })));
      } catch (err) {
        console.error("Failed to fetch states:", err);
      }
    };
    fetchStates();
    setCities([]); // reset cities
  }, [formData.country_id]);

  // Fetch cities whenever state changes
  useEffect(() => {
    if (!formData.state_id) {
      setCities([]);
      return;
    }

    const fetchCities = async () => {
      try {
        const res = await get(`/api/cities/${formData.state_id}`);
        setCities(res.data.map(c => ({ value: c.id, label: c.name })));
      } catch (err) {
        console.error("Failed to fetch cities:", err);
      }
    };
    fetchCities();
  }, [formData.state_id]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create a new FormData object
    const formData2 = new FormData();

    // Append all key-value pairs from the formData state to the FormData object
    for (const key in formData) {
      formData2.append(key, formData[key]);
    }


    // const instance = axios.create({
    //   baseURL: `${API_KEY}`,
    //   headers: { "api-token": auth.token },
    // });

    post('/api/update-current-user-by-token', formData2)
      .then(response => {
        console.log(response)
        toast.success(response.data.message);
      })
      .catch(err => {
        console.log(err);
      });
  };
  const safeValue = (val) => {
    return val === 'null' || val === 'undefined' || val === 'N/A' ? '' : val;
  };
  

  console.log('data', formData)
  return (
    <Layout>
      <div className="my-b-profile-wrape-2 mt-110">
        <div className="container">
          <div className="row my-profile-wrape-2-row">
            <div className="col-2 my-profile-wrape-2-col-2 header-col-2">
              <LeftNavbar />
            </div>
            <div className="col-10 my-profile-wrape-2-col-10 right-flex-grow">
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
                                    {
                                      // <p>Drag & Drop or Click to Upload</p>
                                    }
                                  </div>
                                )}
                              </label>
                            </div>
                          </div>
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
                            <input type="text" name="email" value={safeValue(formData.email)} onChange={handleChange} />
                          </div>
                          <div className="col-6">
                            <label>Phone Number</label>
                            <input type="text" name="phone" value={safeValue(formData.phone)} onChange={handleChange} />
                          </div>
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
                            <label>Alternate Number</label>
                            <input type="text" name="alternate_number" value={safeValue(formData.alternate_number)} onChange={handleChange} />
                          </div>
                          <div className="col-6">
                            <label>License Number</label>
                            <input type="text" name="license_number" value={safeValue(formData.license_number)} onChange={handleChange} />
                          </div>
                          <div className="col-6">
                            <label>Country</label>
                            <Select
                              isClearable={true}
                              options={countries}
                              value={countries.find(c => c.value == formData.country_id) || null}
                              onChange={option => setFormData(prev => ({ ...prev, country_id: option?.value }))}
                            />
                          </div>

                          <div className="col-6">
                            <label>State</label>
                            <Select
                              isClearable={true}
                              options={states}
                              value={states.find(s => s.value === formData.state_id) || null}
                              onChange={option => setFormData(prev => ({ ...prev, state_id: option?.value }))}
                            // isDisabled={!formData.country_id}
                            />
                          </div>

                          <div className="col-6">
                            <label>City</label>
                            <Select
                              isClearable={true}
                              options={cities}
                              value={cities.find(c => c.value === formData.city_id) || null}
                              onChange={option => setFormData(prev => ({ ...prev, city_id: option?.value }))}
                            // isDisabled={!formData.state_id}
                            />
                          </div>
                          <div className="col-12">
                            <label>Address</label>
                            <input type="text" name="address" value={formData.address} onChange={handleChange} />
                          </div>
                          <div className="col-12">
                            <label htmlFor="aboutMe">About Me</label>
                            <textarea
                              id="aboutMe"
                              className="form-control"
                              rows="5"
                              name="about_us"
                              style={{ height: '122px' }}
                              value={formData.about_us} onChange={handleChange}
                            ></textarea>
                          </div>
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
