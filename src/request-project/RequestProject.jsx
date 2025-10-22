import React, { useContext, useEffect, useState } from "react";
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
import AssignToAgent from "./AssignToAgent";
import AssignedAgentProject from "./AssignedAgentProject";
import { get, post } from "../Api/api";
// import AssignTo from "./AssignTo";

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

function RequestProject() {
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


  // code for pagination
  // Calculate pagination


  // Change page
 

  const HandleDelete = async (id) => {
    console.log(id);
    const confirmMsg = confirm("Are you sure to delete");
    console.log(confirmMsg);
    if (confirmMsg) {
      // const instance = axios.create({
      //   baseURL: `${API_KEY}`,
      //   headers: { "api-token": auth.token },
      // });
      await post(`/api/delete-website-project-listing`, { id })
        .then((response) => {
          console.log(response);
          toast.success("Record Deleted Successfuly!");
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        })
        .catch((err) => {
          console.log(err);
          alert(err.data.message);
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
          `/api/fetch-total-project-of-consultancy`
        );
        console.log(response)
        setProjects(response.data.data);
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
                <Tabs
                  value={tabIndex}
                  onChange={handleTabChange}
                  aria-label="assign project tabs"
                >
                  <Tab
                    label="All Project"
                    id="tab-0"
                    aria-controls="tabpanel-0"
                  />
                  <Tab
                    label="Assign to agent "
                    id="tab-1"
                    aria-controls="tabpanel-1"
                  />
                  <Tab
                    label="Assign To"
                    id="tab-2"
                    aria-controls="tabpanel-2"
                  />
                </Tabs>
                <TabPanel value={tabIndex} index={0}>
                  <div className="container action-dropdown-manage-project-wraper d-flex justify-content-between">
                    <div className="d-flex action-parent">
                      <div className="dropdown-act-wraper">
                        <select
                          class="form-select form-select-lg "
                          aria-label=".form-select-lg example"
                        >
                          <option selected>Bulk actions</option>
                          <option value="delete">Delete</option>
                        </select>
                      </div>
                      <div>
                        <button className="apply-btn-wraper">
                          <span>Apply</span>
                        </button>
                      </div>
                    </div>

                   
                  </div>

                  <div className="table-responsive assign-project-table-wraper">
                    <table className="table">
                      <thead>
                        <tr>
                        <th scope="col">S.no</th>
                          <th scope="col">Unique Id</th>
                          <th scope="col">Project Name</th>
                          <th scope="col">Property Type</th>
                          <th scope="col">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {projects.projects?.map((project,index) => (
                          <tr key={project.id} id="col-id">
                          <td scope="row" className="d-flex id-col">
                          <div style={{ width: '72px' }} className="d-flex">
                            <span>
                              <input type="checkbox" />
                            </span>
                            <p className="ms-3">{index + 1}</p>
                          </div>
                        </td>
                            <td>{project.project_unique_id}</td>
                            <td>{project.name}</td>
                            <td>{project.property_type_id_name}</td>
                           
                            <td>
                              <button
                                onClick={() =>
                                  nav(
                                    "/my-account/project-details/" + project.id
                                  )
                                }
                                className="view-assign-project-wraper"
                              >
                                <img src={view} />
                              </button>
                             {
                            //   <button
                            //   onClick={() =>
                            //     nav("/my-account/project-details/" + project.id)
                            //   }
                            //   className="view-assign-project-wraper"
                            // >
                            //   <img src={edit} />
                            // </button>
                            // <button
                            //   onClick={() => HandleDelete(project.id)}
                            //   className="view-assign-project-wraper"
                            // >
                            //   <img src={delete_img} />
                            // </button>
                             }
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                   
                  </div>
                </TabPanel>
                <TabPanel value={tabIndex} index={1}>
                    {
                     <AssignedAgentProject/>
                    }
                </TabPanel>
                <TabPanel value={tabIndex} index={2}>
                 {
                    <AssignToAgent/>  
                 }
                </TabPanel>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default RequestProject;
