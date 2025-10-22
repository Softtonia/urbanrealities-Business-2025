import React, { useContext, useEffect, useState } from "react";
import Layout from "../Layout/Layout";
import "../business-form/Personal.css";
import { AuthContext } from "../context/MyStore";
import { useNavigate } from "react-router-dom";
import LeftNavbar from "../Layout/LeftNavbar";
import Select from "react-select";
import { get } from "../Api/api";
import customStyles from "../CustomStyle";



function Personalinformation() {
  const { formData, setFormData, resetFormData } = useContext(AuthContext);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const nav = useNavigate();

   const handleDiscard = () => {
    resetFormData();     // clear all form data
    nav("/");            // redirect to home
  };


  useEffect(() => {
    // On reload, if there is no essential form data, reset and redirect
    if (!formData.first_name && !formData.last_name && !formData.user_name) {
      resetFormData();
      nav("/");
    }
  }, [formData, resetFormData, nav]);


  const [errors, setErrors] = useState({});

  const stepRequiredFields = {
    basic: ["first_name", "last_name", "user_name"],
    personal: ["country_id", "state_id", "city_id", "pin_code"],
    company: ["aadhaar_front", "aadhaar_back", "business_proof", "aadhaar_number"],
  };


  const validateStep = (stepKey) => {
    const requiredFields = stepRequiredFields[stepKey];
    let errors = {};

    requiredFields.forEach((field) => {
      if (!formData[field] || formData[field] === "") {
        errors[field] = `${field.replace("_", " ")} is required`;
      }
    });

    return errors;
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
  
    // Update form data
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  
    // Validation
    setErrors((prevErrors) => {
      let newErrors = { ...prevErrors };
  
      // Example: pin_code validation
      if (name === "pin_code") {
        if (value.length !== 6) {
          newErrors[name] = "Pin code should be 6 digits long";
        } else {
          delete newErrors[name]; // ✅ remove pin_code error
        }
      } else {
        // ✅ For any other field, clear its error when typing
        if (newErrors[name]) {
          delete newErrors[name];
        }
      }
  
      return newErrors;
    });
  };
  
  

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.files[0],
    }));
  };
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

  console.log(errors)

  return (
    <Layout>
      <div className="personal-info-wrape-2">
        <div className="container">
          <div className="row">
            <LeftNavbar />
            <div className="col-10 right-flex-grow">
              <div className="personal-info-right-section">
                <div className="personal-info-active-wraper">
                  <h1>
                    <span></span>Basic Information
                  </h1>
                  <h1 className="active-heading">
                    <span></span>Personal Details
                  </h1>
                  <h1>
                    <span></span>Company Details
                  </h1>
                </div>
                <hr className="m-0" />

                <div className="row">
                  <div className="col-8 m-auto personal-info-form-wraper">
                    <h2>2. &nbsp;Personal Details</h2>
                    <div className="personal-info-form">
                      <div className="row">


                      <div className="col-6 personal-info-col">
                            <label>Country<span className="required">*</span></label>
                            <Select
                              isClearable={true}
                              styles={customStyles}
                              options={countries}
                              value={countries.find(c => c.value == formData.country_id) || null}
                              onChange={(option) =>
                                handleChange({
                                  target: {
                                    name: "country_id",
                                    value: option?.value || "",
                                  },
                                })
                              }
                            />
                              {errors.country_id && <p className="error-text">{errors.country_id}</p>}
                          </div>

                          <div className="col-6 personal-info-col">
                            <label>State<span className="required">*</span></label>
                            <Select
                              isClearable={true}
                              styles={customStyles}
                              options={states}
                              value={states.find(s => s.value === formData.state_id) || null}
                              onChange={(option) =>
                                handleChange({
                                  target: {
                                    name: "state_id",
                                    value: option?.value || "",
                                  },
                                })
                              }
                            // isDisabled={!formData.country_id}
                            />
                              {errors.state_id && <p className="error-text">{errors.state_id}</p>}

                          </div>

                          <div className="col-6 personal-info-col">
                            <label>City<span className="required">*</span></label>
                            <Select
                              isClearable={true}
                              styles={customStyles}
                              options={cities}
                              value={cities.find(c => c.value === formData.city_id) || null}
                              onChange={(option) =>
                                handleChange({
                                  target: {
                                    name: "city_id",
                                    value: option?.value || "",
                                  },
                                })
                              }
                            // isDisabled={!formData.state_id}
                            />
                              {errors.city_id && <p className="error-text">{errors.city_id}</p>}

                          </div>

                        
                        <div className="col-6 personal-info-col">
                          <label>Pin Code<span className="required">*</span></label>
                          <input
                            type="text"
                            name="pin_code"
                            value={formData.pin_code || ""}
                            onChange={handleChange}
                            placeholder="Enter pin code"
                          />
                              {errors.pin_code && <p className="error-text">{errors.pin_code}</p>}

                        </div>

                        <div className="col-6 personal-info-col">
                          <label>Area / Locality</label>
                          <input
                            type="text"
                            name="area_locality"
                            value={formData.area_locality || ""}
                            onChange={handleChange}
                            placeholder="Enter area/locality"
                          />
                        </div>

                        <div className="col-6 personal-info-col">
                          <label>Colony</label>
                          <input
                            type="text"
                            name="colony"
                            value={formData.colony || ""}
                            onChange={handleChange}
                            placeholder="Enter colony"
                          />
                        </div>

                        <div className="col-6 personal-info-col">
                          <label>Street Address</label>
                          <input
                            type="text"
                            name="street_address"
                            value={formData.street_address || ""}
                            onChange={handleChange}
                            placeholder="Enter street address"
                          />
                        </div>



                        <div className="col-6 personal-info-col">
                          <label>Profile Photo</label>
                          <input
                            type="file"
                            name="profile_photo"
                            onChange={handleFileChange}
                          />
                        </div>

                        <div className="col-12 personal-info-col personal-info-form-btn">
                          <button className="personal-info-discard-btn" onClick={handleDiscard}>
                            <span>Discard</span>
                          </button>
                          <button
                           onClick={() => {
                            const validationErrors = validateStep("personal"); // current step
                            if (Object.keys(validationErrors).length > 0) {
                              setErrors(validationErrors);
                            } else {
                              setErrors({});
                              nav("/company-detail");
                            }
                          }}>
                            <span>Next</span>
                          </button>
                        </div>
                      </div>

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

export default Personalinformation;
