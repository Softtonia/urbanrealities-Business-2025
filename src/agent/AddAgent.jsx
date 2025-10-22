import React, { useContext, useState } from "react";
import LeftNavbar from "../Layout/LeftNavbar";
import Layout from "../Layout/Layout";
import "../agent/AddAgent.css";
import axios from "axios";
import { toast } from "react-toastify";
import { API_KEY } from "../config";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import AlertMessage from "../message/AlertMessage";
import { AuthContext } from "../context/MyStore";
import { post } from "../Api/api";

function AddAgent() {
  const [profileStatus, setProfileStatus] = useState([]);
  const [purpose, setPurpose] = useState([]);
  const [property, setProperty] = useState([]);
  const [property_type, setPropertyType] = useState([]);
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phone: "",
    alternate_number: "",
    address: "",
    country: "",
    state: "",
    city: "",
    pin_code: "",
    rera_number: "",
    role_id: 3,
    password: "",
    purpose_id:'',
    property_id:'',
    property_type_id:''
  });
  const { auth } = useContext(AuthContext);


  const nav = useNavigate();

  console.log(formData);
 console.log(purpose)
  const HandleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const HandleSelectChange = (e) => {
    const{name,value} = e.target
    if(name==="purpose_id" || name==="property_id" || name==="property_type_id"){
        setFormData({
            ...formData,
            [name]:[value]
        })
    }
  }

  const HandleSubmit = (e) => {
    e.preventDefault();
    // const instance = axios.create({
    //   baseURL: `${API_KEY}/api`,
    //   headers: {
    //     "api-token":
    //       "mVlqVqOHKkewAME276NMYWP6DXwyanjypFVcY090vezpHfPmWPircYO1G1I2",
    //   },
    // });
    post("/create-agent", formData)
      .then((response) => {
        console.log(response);
        toast.success("Date inserted successfuly");
        nav("/agent");
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something wrong");
      });
  };

  useEffect(() => {
    let fetchPurpose = () => {
      axios
        .get(`${API_KEY}/api/condition-listing?model=purpose`)
        .then((response) => {
          const data = response.data.data.map((rec, i) => ({
            value: rec.id,
            label: rec.name,
          }));
          setPurpose(data);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    fetchPurpose();
  }, []);
  useEffect(() => {
    let fetchProperty = () => {
      axios
        .get(`${API_KEY}/api/condition-listing?model=property`)
        .then((response) => {
          const data = response.data.data.map((rec, i) => ({
            value: rec.id,
            label: rec.name,
          }));
          setProperty(data);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    fetchProperty();
  }, []);
  useEffect(() => {
    let fetchPropertytype = () => {
      axios
        .get(`${API_KEY}/api/condition-listing?model=property_type`)
        .then((response) => {
          const data = response.data.data.map((rec, i) => ({
            value: rec.id,
            label: rec.name,
          }));
          setPropertyType(data);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    fetchPropertytype();
  }, []);

  useEffect(() => {
    let fetchStatus = () => {
      axios
        .get(`${API_KEY}/api/get-user-status`)
        .then((response) => {
          const { data } = response.data;
          setProfileStatus(data);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    fetchStatus();
  }, []);
  return (
    auth.role==="company" ?
      <Layout>
        <div className="wrape-2-nav-common-wp add-agent-listing-search-wraper">
          <div className="container">
            <div className="row ">
              <LeftNavbar />
              <div className="col-10 flex-grow-1  ">
                <div className="container add-agent-right-section">
                  <form
                    className="add-form-listing-wraper"
                    onSubmit={HandleSubmit}
                    method="post"
                  >
                    <div className="row">
                      <div className="col-lg-4 col-md-4 col-sm-12 add-agent-form-col">
                        <label>Full Name</label>
                        <div className="custom-select">
                          <input
                            type="text"
                            name="fullname"
                            value={formData.fullname}
                            onChange={HandleChange}
                          />
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-4 col-sm-12 add-agent-form-col">
                        <label>Email</label>
                        <div className="custom-select">
                          <input
                            type="text"
                            name="email"
                            value={formData.email}
                            onChange={HandleChange}
                          />
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-4 col-sm-12 add-agent-form-col">
                        <label>Password</label>
                        <div className="custom-select">
                          <input
                            type="number"
                            name="password"
                            value={formData.password}
                            onChange={HandleChange}
                          />
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-4 col-sm-12 add-agent-form-col">
                        <label>Phone Number </label>
                        <div className="custom-select">
                          <input
                            type="number"
                            name="phone"
                            value={formData.phone}
                            onChange={HandleChange}
                          />
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-4 col-sm-12 add-agent-form-col">
                        <label>Alternate Number </label>
                        <div className="custom-select">
                          <input
                            type="number"
                            name="alternate_number"
                            value={formData.alternate_number}
                            onChange={HandleChange}
                          />
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-4 col-sm-12 add-agent-form-col">
                        <label>Address</label>
                        <div className="custom-select">
                          <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={HandleChange}
                          />
                        </div>
                      </div>
                    
                      <div className="col-lg-4 col-md-4 col-sm-12 add-agent-form-col">
                        <label>Country</label>
                        <div className="custom-select">
                          <input
                            type="text"
                            name="country"
                            value={formData.country}
                            onChange={HandleChange}
                          />
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-4 col-sm-12 add-agent-form-col">
                        <label>State</label>
                        <div className="custom-select">
                          <input
                            type="text"
                            name="state"
                            value={formData.state}
                            onChange={HandleChange}
                          />
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-4 col-sm-12 add-agent-form-col">
                        <label>City</label>
                        <div className="custom-select">
                          <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={HandleChange}
                          />
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-4 col-sm-12 add-agent-form-col">
                        <label>Pincode</label>
                        <div className="custom-select">
                          <input
                            type="number"
                            name="pin_code"
                            value={formData.pin_code}
                            onChange={HandleChange}
                          />
                        </div>
                      </div>
                    
                      
                    </div>

                    <button className="submit-button">
                      <span>Submit</span>
                    </button>
                    <button className="cancel-button">
                      <span>Cancel</span>
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout> 
    :
    auth.is_login === false ?
    nav('/login')
    :
    <AlertMessage/>
  );
}

export default AddAgent;
