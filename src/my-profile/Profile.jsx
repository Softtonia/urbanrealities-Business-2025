import React, { useState, useEffect, useContext } from "react";
import Layout from "../Layout/Layout";
import LeftNavbar from "../Layout/LeftNavbar";
import "../document/Document.css";
import "./Profile.css";
import Profile_image from "../../img/person.png";
import ProgressBar from "../dashboard/ProgressBar";
import { useNavigate, useParams } from "react-router-dom";
import { get } from "../Api/api";
import { AuthContext } from "../context/MyStore";

const Profile = () => {
    const { id } = useParams();
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({});
    const [image, setImage] = useState(Profile_image);
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleEditProfile = () => {
        navigate(`/my-account/edit-profile/${id}`);
        setOpen(false);
    };

    useEffect(() => {
        get(`/api/get-details-byuserid?id=${id}`)
            .then((response) => {
                const data = response.data;
                setFormData(data);
                setImage(data.profile_photo || Profile_image);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [id]);
    const [expanded, setExpanded] = useState(false);
    const previewLength = 500; // Number of characters to show initially

    if (!formData.about_us) return null;

    const isLong = formData?.about_us.length > previewLength;
    const displayedText = expanded ? formData?.about_us : formData?.about_us.slice(0, previewLength) + (isLong ? "..." : "");


    return (
        <Layout>
            <div className="wrape-2-nav-common-wp">
                <div className="container">
                    <div className="row">
                        <LeftNavbar />
                        <div className="col-10 document-right-section-wraper">
                            <div className="row">
                                {/* Left Profile Section */}
                                <div className="col-lg-4 col-md-4 col-sm-12">
                                    <div className="document-profile-wraper">
                                        <div className="profile-dropdown-myprofile">
                                            <div className="three-dot" onClick={() => setOpen(!open)}>
                                                &#x22EE;
                                            </div>
                                            {open && (
                                                <div className="dropdown-popup">
                                                    <ul>
                                                        <li onClick={handleEditProfile}>Edit Profile</li>
                                                    </ul>
                                                </div>
                                            )}
                                        </div>

                                        <div className="d-block m-auto mt-4" style={{ width: "90px", height: "90px" }}>
                                            <img src={image} alt="Profile" className="img-fluid w-100 h-100" />
                                        </div>

                                        <p className="text-center mt-3" style={{ textTransform: "capitalize" }}>
                                            <strong>
                                                {formData.first_name || ""} {formData.last_name || ""}
                                            </strong>
                                            <br />
                                            ({formData.role_name})
                                        </p>

                                        <div className="document-inner-contact-info-wp">
                                            {formData.age && <h3>Age: {formData.age}</h3>}
                                            {formData.phone && <h3>Phone Number: {formData.phone}</h3>}
                                            {formData.email && <h3>Email: {formData.email}</h3>}
                                            {formData.city && <h3>City: {formData.city}</h3>}
                                            {formData.state && <h3>State: {formData.state}</h3>}
                                            {formData.country && <h3>Country: {formData.country}</h3>}
                                        </div>
                                    </div>
                                </div>

                                {/* Right About Section */}
                                <div className="col-lg-8 col-md-8 col-sm-12">
                                    <div className="document-profile-right-section">
                                        {formData.about_us && (
                                            <div className="about-us-section">
                                                <h2>About Us</h2>
                                                <hr className="m-0" />
                                                <p> <strong>Bio:-</strong>{displayedText}

                                                    {isLong && (
                                                        <span
                                                            className="about-us-toggle"
                                                            onClick={() => setExpanded(!expanded)}
                                                            style={{ color: "#FB6A18", cursor: "pointer" }}
                                                        >
                                                            {expanded ? "Less" : "More"}
                                                        </span>
                                                    )}
                                                </p>
                                            </div>
                                        )}

                                        <div className="row">
                                            <div className="col-lg-5 col-md-6 col-sm-12 document-right-col-profile d-flex justify-content-between">
                                                {formData.bussiness_name && (
                                                    <div className="col-12 document-right-col-4 d-flex justify-content-between">
                                                        <h4>Agency</h4>
                                                        <h5>{formData.bussiness_name}</h5>
                                                    </div>
                                                )}
                                                {formData.business_city && (
                                                    <div className="col-12 document-right-col-4 d-flex justify-content-between">
                                                        <h4>City</h4>
                                                        <h5>{formData.business_city}</h5>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="col-lg-5 col-md-6 col-sm-12 document-right-col-4 d-flex justify-content-between">

                                                {formData.business_state && (
                                                    <div className="col-12 document-right-col-4 d-flex justify-content-between">
                                                        <h4>State</h4>
                                                        <h5>{formData.business_state}</h5>
                                                    </div>
                                                )}
                                                {formData.business_country && (
                                                    <div className="col-12 document-right-col-4 d-flex justify-content-between">
                                                        <h4>Country</h4>
                                                        <h5>{formData.business_country}</h5>
                                                    </div>
                                                )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* <div className="document-right-section2-wraper">
                                        <div className="row">
                                            <div className="col-lg-6 col-md-6 col-sm-12">
                                                <div className="document-progress-bar">
                                                    <div>
                                                        <h2>58</h2>
                                                        <p>Properties Rent</p>
                                                    </div>
                                                    <div>
                                                        <ProgressBar percentage="30" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-lg-6 col-md-6 col-sm-12">
                                                <div className="document-progress-bar">
                                                    <div>
                                                        <h2>58</h2>
                                                        <p>Properties Rent</p>
                                                    </div>
                                                    <div>
                                                        <ProgressBar percentage="30" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        </Layout>
    );
};

export default Profile;
