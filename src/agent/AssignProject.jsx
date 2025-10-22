import React, { Fragment, useContext, useEffect, useState } from "react";
import Layout from "../Layout/Layout";
import LeftNavbar from "../Layout/LeftNavbar";
import { Tabs, Tab, Box, Typography } from "@mui/material";
import "../agent/AssignProject.css";
import { API_KEY, API_TOKEN } from "../config";
import { AuthContext } from "../context/MyStore";
import axios from "axios";
import view from "../../img/view.png";
import edit from "../../img/edit.svg";
import { Link, useNavigate } from "react-router-dom";
import delete_img from "../../img/delete.svg";
import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
} from "@mui/material";
import AssignedProject from "./AssignedProject";
import AssignTo from "./AssignTo";
import CompanyConsultancyProject from "./CompanyConsultancyProject";
import '../agent/AllCompanyProjectListing.css'
import { toast } from "react-toastify";
import { get, post } from "../Api/api";
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function AssignProject() {
  const [projects, setProjects] = useState([]);
  const [tabIndex, setTabIndex] = useState(0);
  const { auth } = useContext(AuthContext);

  const handleTabChange = (event, newIndex) => {
    setTabIndex(newIndex);
  };
  const [itemsPerPage] = useState(10); // You can adjust the number of items per page
  const [currentPage, setCurrentPage] = useState(1);
  const [load, setLoad] = useState(false);
  const [visible, setvisible] = useState(false);
  const [status, setStatus] = useState("active");
  const [projectId, setProjectId] = useState("");
  const handleChange = (event) => {
    setStatus(event.target.value);
  };
  console.log(projects);
  const nav = useNavigate();
  const [modal, setModal] = useState(false);

  const [selectedOption, setSelectedOption] = useState(null);

  let count = (currentPage - 1) * itemsPerPage + 1;

  // code for pagination
  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = projects.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => {
    if (
      pageNumber >= 1 &&
      pageNumber <= Math.ceil(data.length / itemsPerPage)
    ) {
      setCurrentPage(pageNumber);
    }
  };

  const HandleDelete = async (id) => {
    console.log(id);
    const confirmMsg = confirm("Are you sure to delete");
    console.log(confirmMsg);
    if (confirmMsg) {
      // const instance = axios.create({
      //   baseURL: `${API_KEY}`,
      //   headers: { "api-token": auth.token },
      // });
      await post(`/api/delete-website-project-listing`, { id:id })
        .then((response) => {
          console.log(response);
          toast.success("Record Deleted Successfuly!");
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        })
        .catch((err) => {
          console.log(err);
          alert("Not Deleted");
        });
    }
  };

  const handleModal = (id) => {
    console.log(id);
    setProjectId(id);
    setvisible(true);
  };

  // submit form here
  const handleSubmit = (e) => {
    e.preventDefault();
    // const axiosInstance = axios.create({
    //   baseURL: API_KEY,
    //   headers: { "api-token": API_TOKEN },
    // });
    post("/api/update-website-project-status", {
        project_id: projectId,
        project_status: status,
      })
      .then((response) => {
        console.log(response);
        alert("Updated Sussessfuly!");
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    const fetchData = async () => {
      // const instance = axios.create({
      //   baseURL: API_KEY,
      //   headers: { "api-token": auth.token },
      // });
      try {
        const response = await get(
          `${API_KEY}/api/get-all-website-project-listing`
        );
        setProjects(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [auth.token]);

  return (
    <Layout>
      <div className="wrape-2-nav-common-wp">
        <div className="container">
          <div className="row">
            <LeftNavbar />
            <div className="col-10 flex-grow-1 ">
              <div className="container assign-project-search-wraper-right-section">
               
              <div className="d-flex justify-content-end">
              <Link to='/my-account/add-project' className="add-manage-project">Add Project</Link>
              </div>
              
                <div className='app-dv-4-lft-slider-wp' >
                <div className='row'>
                  {
                    projects.map((record,index)=>(
                      <Fragment key={index}>
                     <div className="col-6 mb-3 mt-4 ">
                        <div className="container">
                        <div className="row  border-company-project">
                        <div className='col-lg-3 p-0 col-md-3 col-sm-3 col-5 app-dv-4-lft-img'>
                        <div className='w-100 h-100'>
                          {record.custom_field_values.map((data, i) => (
                            data.field_name === "project_featured_img" &&
                            <picture key={i}>
                              <img src={data.field_value.join('')} className="img-fluid" />
                            </picture>
                          ))}
                        </div>
                      </div>
                      <div className='col-lg-5 col-md-5 col-sm-5 col-7 py-3 '>
                        {record.custom_field_values.map((data, i) => (
                          data.field_name === "projcect_onboard_price" &&
                          <Fragment key={i}>
                            <h2>₹ {data.field_value}</h2>
                            <hr />
                          </Fragment>
                        ))}
                        <p>
                          {record.custom_field_values.map((data, i) => (
                            data.field_name === "Project_unit_type" &&
                            <Fragment key={i}>
                              {data.field_value.map((flat, ind) => (
                                <Fragment key={ind}>
                                  <span className="text-black">{flat}</span><label className="span-divider-label"></label>
                                </Fragment>
                              ))}
                            </Fragment>
                          ))}
                          {record.custom_field_values.map((data, i) => (
                            data.field_name === "listing_propety_area" &&
                            data.field_value
                          ))}.
                        </p>
                        <hr />
                        {record.custom_field_values.map((data, i) => {
                          if (data.field_name === "listing_property_address") {
                            return (
                              <Fragment key={i}>
                                <p >
                                  {data.field_value}
                                  {record.custom_field_values.map((nestedData, j) => {
                                    if (nestedData.field_name === "listing_name") {
                                      return <span key={j}>{nestedData.field_value}</span>;
                                    }
                                    return null;
                                  })}
                                </p>
                                <hr />
                              </Fragment>
                            );
                          }
                          return null;
                        })}
                        {record.custom_field_values.map((data, i) => (
                          data.field_name === "listing_available_from" &&
                          <Fragment key={i}>
                            <p>Available for <strong>{data.field_value}</strong> </p>
                            <hr />
                          </Fragment>
                        ))}
                        {record.custom_field_values.map((data, i) => (
                          data.field_name === "listing_carpet_area" &&
                          <p key={i}>Carpet Area <strong>{data.field_value}</strong> </p>
                        ))}
                        <div className='app-dv-4-info-mb-btn d-flex justify-content-between'>
                          <button><span>Request Call-back</span></button>
                          <button  onClick={() => nav('/property-detail/' + record.id)}><span>Get Info</span></button>
                        </div>
                      </div>
                      <div className='col-4 d-flex align-center justify-content-center py-3 px-3 mb-none-get-info '>
                        <div className='app-dv-4-lft-btn-wp app4-col-gray-wp w-100 h-100 d-flex align-center justify-content-center'>
                          <div>
                          
                            <button onClick={() => nav('/my-account/manage-project-view-details/' + record.id)}><span>View Project</span></button>
                             <div className="text-center mt-3"> <Link to={'/my-account/edit-project/'+record.id} className="me-2"><img src={edit}/></Link>
                             <Link onClick={()=>HandleDelete(record.id)}><img src={delete_img}/></Link></div>
                          </div>
                        </div>
                      </div>
                        </div>
                        </div>
                     </div>
                      </Fragment>
                    ))
                  }
                </div>
              </div>
               {
              //   <TabPanel value={tabIndex} index={0}>
              //   <div className="container action-dropdown-manage-project-wraper d-flex justify-content-between">
              //     <div className="d-flex action-parent">
              //       <div className="dropdown-act-wraper">
              //         <select
              //           class="form-select form-select-lg "
              //           aria-label=".form-select-lg example"
              //         >
              //           <option selected>Bulk actions</option>
              //           <option value="delete">Delete</option>
              //         </select>
              //       </div>
              //       <div>
              //         <button className="apply-btn-wraper">
              //           <span>Apply</span>
              //         </button>
              //       </div>
              //     </div>

              //     <Link
              //       to="/my-account/add-project"
              //       className="apply-btn-wraper"
              //     >
              //       <span>Add Project</span>
              //     </Link>
              //   </div>

                
                
              
              
              // </TabPanel>
              // <TabPanel value={tabIndex} index={1}>
              //     <AssignedProject/>
              // </TabPanel>
              // <TabPanel value={tabIndex} index={2}>
              //   <AssignTo/>
              // </TabPanel>
               }
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default AssignProject;
