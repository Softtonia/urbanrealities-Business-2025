import React, { useContext, useEffect, useState } from "react";
import Layout from "../Layout/Layout";
import "./BusinessInfo.css";
import "./Personal.css" // ✅ combine BusinessInfo.css + Personal.css
import { useNavigate } from "react-router-dom";
import LeftNavbar from "../Layout/LeftNavbar";
import { AuthContext } from "../context/MyStore";
import Select from "react-select";
import { get } from "../Api/api";
import customStyles from "../CustomStyle";

function BusinessPersonalForm() {
  const { formData, setFormData, resetFormData } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(3);
  const [errors, setErrors] = useState({});
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const nav = useNavigate();

  // required fields for each step
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
    setFormData((prev) => ({ ...prev, [name]: value }));

    setErrors((prevErrors) => {
      let newErrors = { ...prevErrors };
      if (name === "pin_code") {
        if (value.length !== 6) newErrors[name] = "Pin code should be 6 digits long";
        else delete newErrors[name];
      } else if (newErrors[name]) {
        delete newErrors[name];
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

  const handleDiscard = () => {
    resetFormData();
    nav("/");
  };

  // fetch countries
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await get("/api/countries");
        setCountries(res.data.map((c) => ({ value: c.id, label: c.name })));
      } catch (err) {
        console.error("Failed to fetch countries:", err);
      }
    };
    fetchCountries();
  }, []);

  // fetch states
  useEffect(() => {
    if (!formData.country_id) {
      setStates([]);
      setCities([]);
      return;
    }
    const fetchStates = async () => {
      try {
        const res = await get(`/api/states/${formData.country_id}`);
        setStates(res.data.map((s) => ({ value: s.id, label: s.name })));
      } catch (err) {
        console.error("Failed to fetch states:", err);
      }
    };
    fetchStates();
    setCities([]);
  }, [formData.country_id]);

  // fetch cities
  useEffect(() => {
    if (!formData.state_id) {
      setCities([]);
      return;
    }
    const fetchCities = async () => {
      try {
        const res = await get(`/api/cities/${formData.state_id}`);
        setCities(res.data.map((c) => ({ value: c.id, label: c.name })));
      } catch (err) {
        console.error("Failed to fetch cities:", err);
      }
    };
    fetchCities();
  }, [formData.state_id]);

  // auth check + loader
  useEffect(() => {
    const data = localStorage.getItem("auth");
    if (!data) {
      nav("/login");
    }

    let interval = setInterval(() => {
      setCount((prevCount) => {
        if (prevCount === 0) {
          setLoading(false);
          clearInterval(interval);
          return prevCount;
        } else {
          return prevCount - 1;
        }
      });
    }, 500);

    return () => clearInterval(interval);
  }, [nav]);

  return (
    <Layout>
      <div className="business-info-wrape-2">
        <div className="container">
          <div className="row">
            <LeftNavbar />
            {loading ? (
              <div className="col-10 spinner-col">
                <div className="spinner-border text-dark" role="status"></div>
              </div>
            ) : (
              <div className="col-10 ">
                <div className="business-info-right-section">
                  <div className="business-info-active-wraper">
                    <h1 className="active-heading">
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

                  {/* ✅ BASIC INFO */}
                  <div className="row">
                    <div className="col-8 m-auto merged-form-section business-info-form-wraper ">
                      <h2>1. &nbsp; Basic Information</h2>
                      <div className="row">
                        <div className="col-6 ">
                          <label>
                            First Name<span className="required">*</span>
                          </label>
                          <input
                            type="text"
                            name="first_name"
                            placeholder="Enter first name"
                            value={formData.first_name || ""}
                            onChange={handleChange}
                          />
                          {errors.first_name && <p className="error-text">{errors.first_name}</p>}
                        </div>
                        <div className="col-6">
                          <label>
                            Last Name<span className="required">*</span>
                          </label>
                          <input
                            type="text"
                            name="last_name"
                            placeholder="Enter last name"
                            value={formData.last_name || ""}
                            onChange={handleChange}
                          />
                          {errors.last_name && <p className="error-text">{errors.last_name}</p>}
                        </div>
                        <div className="col-6">
                          <label>
                            User Name<span className="required">*</span>
                          </label>
                          <input
                            type="text"
                            name="user_name"
                            placeholder="Enter username"
                            value={formData.user_name || ""}
                            onChange={handleChange}
                          />
                          {errors.user_name && <p className="error-text">{errors.user_name}</p>}
                        </div>
                        <div className="col-6">
                          <label>Phone Number</label>
                          <input
                            type="text"
                            name="phone"
                            placeholder="Enter phone"
                            value={formData.phone || ""}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="col-6">
                          <label>Email Address</label>
                          <input
                            type="email"
                            name="email"
                            placeholder="Enter email"
                            value={formData.email || ""}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="col-6">
                          <label>About</label>
                          <textarea
                            name="about"
                            placeholder="Write about yourself"
                            value={formData.about || ""}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ✅ PERSONAL INFO */}
                  <div className="row mt-4 personal-info-form-wraper">
                    <div className="col-8 m-auto merged-form-section">
                      <h2>2. &nbsp; Personal Details</h2>
                      <div className="row">
                        <div className="col-6">
                          <label>
                            Country<span className="required">*</span>
                          </label>
                          <Select
                            isClearable
                            styles={customStyles}
                            options={countries}
                            value={countries.find((c) => c.value == formData.country_id) || null}
                            onChange={(option) =>
                              handleChange({ target: { name: "country_id", value: option?.value || "" } })
                            }
                          />
                          {errors.country_id && <p className="error-text">{errors.country_id}</p>}
                        </div>

                        <div className="col-6">
                          <label>
                            State<span className="required">*</span>
                          </label>
                          <Select
                            isClearable
                            styles={customStyles}
                            options={states}
                            value={states.find((s) => s.value === formData.state_id) || null}
                            onChange={(option) =>
                              handleChange({ target: { name: "state_id", value: option?.value || "" } })
                            }
                          />
                          {errors.state_id && <p className="error-text">{errors.state_id}</p>}
                        </div>

                        <div className="col-6">
                          <label>
                            City<span className="required">*</span>
                          </label>
                          <Select
                            isClearable
                            styles={customStyles}
                            options={cities}
                            value={cities.find((c) => c.value === formData.city_id) || null}
                            onChange={(option) =>
                              handleChange({ target: { name: "city_id", value: option?.value || "" } })
                            }
                          />
                          {errors.city_id && <p className="error-text">{errors.city_id}</p>}
                        </div>

                        <div className="col-6 ">
                          <label>
                            Pin Code<span className="required">*</span>
                          </label>
                          <input
                            type="text"
                            name="pin_code"
                            placeholder="Enter pin code"
                            value={formData.pin_code || ""}
                            onChange={handleChange}
                          />
                          {errors.pin_code && <p className="error-text">{errors.pin_code}</p>}
                        </div>

                        <div className="col-6">
                          <label>Area / Locality</label>
                          <input
                            type="text"
                            name="area_locality"
                            placeholder="Enter area/locality"
                            value={formData.area_locality || ""}
                            onChange={handleChange}
                          />
                        </div>

                        <div className="col-6">
                          <label>Colony</label>
                          <input
                            type="text"
                            name="colony"
                            placeholder="Enter colony"
                            value={formData.colony || ""}
                            onChange={handleChange}
                          />
                        </div>

                        <div className="col-6">
                          <label>Street Address</label>
                          <input
                            type="text"
                            name="street_address"
                            placeholder="Enter street address"
                            value={formData.street_address || ""}
                            onChange={handleChange}
                          />
                        </div>

                        <div className="col-6">
                          <label>Profile Photo</label>
                          <input type="file" name="profile_photo" onChange={handleFileChange} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ✅ Actions */}
                  <div className="col-12 business-info-col business-info-form-btn text-center ">
                    <button className="business-info-discard-btn " onClick={handleDiscard}>
                      Discard
                    </button>
                    <button
                    className="business-next-btn"
                      onClick={() => {
                        const basicErrors = validateStep("basic");
                        const personalErrors = validateStep("personal");
                        const validationErrors = { ...basicErrors, ...personalErrors };

                        if (Object.keys(validationErrors).length > 0) {
                          setErrors(validationErrors);
                        } else {
                          setErrors({});
                          nav("/company-detail");
                        }
                      }}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default BusinessPersonalForm;
