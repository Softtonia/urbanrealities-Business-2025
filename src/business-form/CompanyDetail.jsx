import React, { useContext, useEffect, useState } from "react";
import Layout from "../Layout/Layout";
import "../business-form/CompanyDetail.css";
import { useNavigate } from "react-router-dom";
import LeftNavbar from "../Layout/LeftNavbar";
import { AuthContext } from "../context/MyStore";
import { get, post } from "../Api/api";
import customStyles from "../CustomStyle";
import Select from "react-select";
import { toast } from "react-toastify";

function CompanyDetail() {
  const nav = useNavigate();
  const { formData, setFormData, resetFormData } = useContext(AuthContext);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  console.log(countries)
  // useEffect(() => {
  //   // On reload, if there is no essential form data, reset and redirect
  //   if (!formData.first_name && !formData.last_name && !formData.user_name) {
  //     resetFormData();
  //     nav("/");
  //   }
  // }, [formData, resetFormData, nav]);

  const handleDiscard = () => {
    resetFormData();     // clear all form data
    nav("/");            // redirect to home
  };

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
      if (name === "business_pin_code") {
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null && formData[key] !== undefined) {
        payload.append(key, formData[key]);
      }
    });

    await post("/api/user-complete-kyc", payload)
      .then((response) => {
        toast.success("Date inserted successfully");
        nav("/9d9b678aa2c1cd3d89e3506b1de4fc14");
      })
      .catch((err) => {
        console.log(err);
      });
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
    if (!formData.business_country_id) {
      setStates([]);
      setCities([]);
      return;
    }

    const fetchStates = async () => {
      try {
        const res = await get(`/api/states/${formData.business_country_id}`);
        setStates(res.data.map(s => ({ value: s.id, label: s.name })));
      } catch (err) {
        console.error("Failed to fetch states:", err);
      }
    };
    fetchStates();
    setCities([]); // reset cities
  }, [formData.business_country_id]);

  // Fetch cities whenever state changes
  useEffect(() => {
    if (!formData.business_state_id) {
      setCities([]);
      return;
    }

    const fetchCities = async () => {
      try {
        const res = await get(`/api/cities/${formData.business_state_id}`);
        setCities(res.data.map(c => ({ value: c.id, label: c.name })));
      } catch (err) {
        console.error("Failed to fetch cities:", err);
      }
    };
    fetchCities();
  }, [formData.business_state_id]);


  return (
    <Layout>
      <div className="business-info-wrape-2">
        <div className="container">
          <div className="row">
            <LeftNavbar />
            <div className="col-10 right-flex-grow">
              <div className="business-info-right-section">
                <div className="business-info-active-wraper">
                  <h1>
                    <span></span>Basic Information
                  </h1>
                  <h1>
                    <span></span>Personal Details
                  </h1>
                  <h1 className="active-heading">
                    <span></span>Company Details
                  </h1>
                </div>
                <hr className="m-0" />

                <div className="row">
                  <div className="col-8 m-auto business-info-form-wraper">
                    <h2>3. &nbsp; Company Details</h2>
                    <form className="business-info-form" onSubmit={(e) => e.preventDefault()}>
                      <div className="row company-detail-form-wraper ">
                        <div className="col-6 business-info-col">
                          <label>Company Name</label>
                          <input
                            type="text"
                            name="bussiness_name"
                            value={formData.bussiness_name || ""}
                            onChange={handleChange}
                            placeholder="Enter agency name"
                          />
                        </div>

                        <div className="col-6 business-info-col">
                          <label>Email</label>
                          <input
                            type="text"
                            name="bussiness_email"
                            value={formData.bussiness_email || ""}
                            onChange={handleChange}
                            placeholder="Enter email"
                          />
                        </div>
                        <div className="col-6 business-info-col">
                          <label>Phone</label>
                          <input
                            type="text"
                            name="business_phone"
                            value={formData.business_phone || ""}
                            onChange={handleChange}
                            placeholder="Enter phone"
                          />
                        </div>
                        <div className="col-6 business-info-col">
                          <label>Alternate Phone</label>
                          <input
                            type="text"
                            name="alternate_number"
                            value={formData.alternate_number || ""}
                            onChange={handleChange}
                            placeholder="Enter alternate phone"
                          />
                        </div>
                        <div className="col-6 personal-info-col">
                          <label>Country</label>
                          <Select
                            isClearable={true}
                            styles={customStyles}
                            options={countries}
                            value={countries.find(c => c.value == formData.business_country_id) || null}
                            onChange={option => setFormData(prev => ({ ...prev, business_country_id: option?.value }))}
                          />
                        </div>

                        <div className="col-6 personal-info-col">
                          <label>State</label>
                          <Select
                            isClearable={true}
                            styles={customStyles}
                            options={states}
                            value={states.find(s => s.value === formData.business_state_id) || null}
                            onChange={option => setFormData(prev => ({ ...prev, business_state_id: option?.value }))}
                          // isDisabled={!formData.country_id}
                          />
                        </div>

                        <div className="col-6 personal-info-col">
                          <label>City</label>
                          <Select
                            isClearable={true}
                            styles={customStyles}
                            options={cities}
                            value={cities.find(c => c.value === formData.business_city_id) || null}
                            onChange={option => setFormData(prev => ({ ...prev, business_city_id: option?.value }))}
                          // isDisabled={!formData.state_id}
                          />
                        </div>
                        {/* <div className="col-6 business-info-col">
                          <label>Company Address</label>
                          <input
                            type="text"
                            name="bussiness_address"
                            value={formData.bussiness_address || ""}
                            onChange={handleChange}
                            placeholder="Enter agency address"
                          />
                        </div> */}
                        <div className="col-6 personal-info-col">
                          <label>Area / Locality</label>
                          <input
                            type="text"
                            name="bussiness_area_locality"
                            value={formData.bussiness_area_locality || ""}
                            onChange={handleChange}
                            placeholder="Enter area/locality"
                          />
                        </div>

                        <div className="col-6 personal-info-col">
                          <label>Colony</label>
                          <input
                            type="text"
                            name="bussiness_colony"
                            value={formData.bussiness_colony || ""}
                            onChange={handleChange}
                            placeholder="Enter colony"
                          />
                        </div>
                        <div className="col-6 personal-info-col">
                          <label>Pin Code</label>
                          <input
                            type="text"
                            name="bussiness_pin_code"
                            value={formData.bussiness_pin_code || ""}
                            onChange={handleChange}
                            placeholder="Enter pin code"
                          />
                        </div>

                        <div className="col-6 personal-info-col">
                          <label>Street Address</label>
                          <input
                            type="text"
                            name="bussiness_street_address"
                            value={formData.bussiness_street_address || ""}
                            onChange={handleChange}
                            placeholder="Enter street address"
                          />
                        </div>

                        <div className="col-6 business-info-col">
                          <label>License Number</label>
                          <input
                            type="text"
                            name="license_number"
                            value={formData.license_number || ""}
                            onChange={handleChange}
                            placeholder="Enter license number"
                          />
                        </div>

                        <div className="col-6 business-info-col">
                          <label>Aadhaar Number<span className="required">*</span></label>
                          <input
                            required
                            type="text"
                            name="aadhaar_number"
                            value={formData.aadhaar_number || ""}
                            onChange={handleChange}
                            placeholder="Enter Aadhaar number"
                          />
                          {errors.aadhaar_number && <p className="error-text">{errors.aadhaar_number}</p>}

                        </div>

                        {/* File uploads */}

                        <div className="col-6 business-info-col">
                          <label>Aadhaar Front<span className="required">*</span></label>
                          <input
                            required
                            type="file"
                            name="aadhaar_front"
                            onChange={handleFileChange}
                          />
                          {errors.aadhaar_front && <p className="error-text">{errors.aadhaar_front}</p>}

                        </div>
                        <div className="col-6 business-info-col">
                          <label>Aadhaar Back<span className="required">*</span></label>
                          <input
                            required
                            type="file"
                            name="aadhaar_back"
                            onChange={handleFileChange}
                          />
                          {errors.aadhaar_back && <p className="error-text">{errors.aadhaar_back}</p>}

                        </div>
                        <div className="col-6 business-info-col">
                          <label>Business Proof<span className="required">*</span></label>
                          <input
                            required
                            type="file"
                            name="business_proof"
                            onChange={handleFileChange}
                          />
                          {errors.business_proof && <p className="error-text">{errors.business_proof}</p>}

                        </div>

                        <div className="col-12 business-info-col business-info-form-btn">
                          <button className="business-info-discard-btn" onClick={handleDiscard}>
                            <span>Discard</span>
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              const validationErrors = validateStep("company"); // current step
                              if (Object.keys(validationErrors).length > 0) {
                                setErrors(validationErrors);
                              } else {
                                setErrors({});
                                handleSubmit(e)
                              }
                            }}>
                            <span>Next</span>
                          </button>
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
    </Layout>
  );
}

export default CompanyDetail;
