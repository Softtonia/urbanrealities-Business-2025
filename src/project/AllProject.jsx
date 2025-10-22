import React from 'react'
import { API_KEY, API_TOKEN } from '../config';
import { useState, useEffect, useContext } from "react";
import { AuthContext } from '../context/MyStore';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../Layout/Layout';
import LeftNavbar from '../Layout/LeftNavbar';
import axios from 'axios';
import '../project/AllProject.css'
import view from '../../img/view.png'
import edit from '../../img/edit.svg'
import delete_img from '../../img/delete.svg'
import { toast } from 'react-toastify';
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Button } from '@mui/material';
import { get, post } from '../Api/api';



function AllProject() {
  const [data, setData] = useState([]);
  const [itemsPerPage] = useState(10); // You can adjust the number of items per page
  const [currentPage, setCurrentPage] = useState(1);
  const [load, setLoad] = useState(false);
  const [visible, setvisible] = useState(false)
  const [status, setStatus] = useState('active');
  const [projectId, setProjectId] = useState('')
  const handleChange = (event) => {
    setStatus(event.target.value);
  };

  const { auth } = useContext(AuthContext)
  const nav = useNavigate();
  const [modal, setModal] = useState(false);

  const [selectedOption, setSelectedOption] = useState(null);

  console.log(data)

  let count = (currentPage - 1) * itemsPerPage + 1;

  // code for pagination
  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.length > 0 ? data.slice(indexOfFirstItem, indexOfLastItem) : [];

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
    console.log(id)
    const confirmMsg = confirm('Are you sure to delete')
    console.log(confirmMsg)
    if (confirmMsg) {
      // const instance = axios.create({
      //   baseURL: `${API_KEY}`,
      //   headers: {'api-token': auth.token}
      // });
      await post(`/api/delete-project-listing`, { id })
        .then(response => {
          console.log(response)
          toast.success('Record Deleted Successfuly!')
          setTimeout(() => {
            window.location.reload()
          }, 1000);
        })
        .catch(err => {
          console.log(err)
          alert(err.data.message)
        })
    }

  }

  const handleModal = (id) => {
    console.log(id)
    setProjectId(id)
    setvisible(true)
  }

  // submit form here
  const handleSubmit = (e) => {
    e.preventDefault();
    // const axiosInstance = axios.create({
    //   baseURL: API_KEY,
    //   headers: { "api-token": API_TOKEN },
    // });
    post("/api/update-website-project-status", {
      project_id: projectId,
      project_status: status
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
    let fetchData = async () => {
      // const instance = axios.create({
      //   baseURL: `${API_KEY}`,
      //   headers: { "api-token": auth.token },
      // });
      await get(`/api/get-all-project-listings-by-companyoradmin-token?user_id=${auth.id}`)
        .then((response) => {
          console.log(response)
          setData(response?.data?.data?.projects)
          setLoad(true)
        })
        .catch((err) => {
          console.log(err);
        });
    };
    fetchData();
  }, [auth.token]);
  console.log("====================>", data)
  return (
    <Layout>
      <div className="wrape-2-nav-common-wp all-project-listing-search-wraper">
        <div className="container">
          <div className="row ">
            <LeftNavbar />
            <div className='col-10 flex-grow-1  '>
              <div className="row add-property-row">
                <div className="col-lg-12 col-md-12 col-sm-12 right-purpose-col">
                  <div className="right-section-wraper">
                    <div className="container action-dropdown-wraper d-flex justify-content-between">
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


                      <Link to="/my-account/add-project" className='apply-btn-wraper'><span>Add Project</span></Link>
                    </div>

                    {
                      // table start here
                    }

                    <div className=" edit-purpose-table-wraper table-responsive ">
                      <table className="table">
                        <thead>
                          <tr>
                            <th scope="col " className="id-col">
                              <span>
                                <input type="checkbox" />
                              </span>
                              <p className="m-0 d-inline">S.No</p>
                            </th>
                            {/* <th scope="col">Uniquie ID</th> */}
                            <th scope="col">Project Name</th>
                            <th scope="col">Purpose</th>
                            <th scope="col">Status</th>
                            <th scope="col">Action</th>
                          </tr>

                        </thead>
                        <tbody>
                          {
                            load ? (
                              currentItems.map((record, i) => (
                                <tr id="col-id" key={i}>
                                  <th scope="row" className="d-flex id-col">
                                    <div style={{ width: "72px" }} className="d-flex">
                                      <span>
                                        <input type="checkbox" />
                                      </span>
                                      <p className="m-0">{count++}</p>
                                    </div>
                                  </th>
                                  {/* <td>
                                    <div style={{ width: "150px" }} className="d-flex">
                                      {record.project_unique_id}
                                    </div>
                                  </td> */}
                                  <td>
                                    <div style={{ width: "150px" }} className="d-flex">
                                      {record.name}
                                    </div>
                                  </td>
                                  <td>
                                    <div style={{ width: "150px" }} className="d-flex">
                                      {record.purpose_name}
                                    </div>
                                  </td>
                                  <td>
                                    <div style={{ width: "150px" }} className="d-flex">
                                      <button className={
                                        record.project_status === "1"
                                          ? "active_view"
                                          :
                                          "deactivate_view bg-danger"
                                      } onClick={() => handleModal(record.id)}>{record.project_status === "1" ? 'Active' : "InActive"}</button>
                                    </div>
                                  </td>


                                  {
                                    //     <td>
                                    //     <div style={{ width: "174px" }} className="d-flex">
                                    //     <button
                                    //       onClick={() => {
                                    //         setModal(true);
                                    //         setFormData((prev) => ({
                                    //           ...prev,
                                    //           project_id: record.id,
                                    //         }));
                                    //       }}
                                    //       className={
                                    //         record.status === "approved"
                                    //           ? "bg-green"
                                    //           : record.status === "reject"
                                    //           ? "bg-reject"
                                    //           : record.status === "pending"
                                    //           ? "bg-pending"
                                    //           : ""
                                    //       }
                                    //     >
                                    //       <span>{record.status}</span>
                                    //     </button>
                                    //   </div>
                                    //     </td>
                                  }

                                  <td>
                                    <div
                                      className="edit-del-btn-wraper"

                                    >
                                      {
                                        <>
                                          {
                                            //   <button >
                                            //   <img src={view} onClick={()=>HandleView(record.fullnamename,record.id)}/>
                                            // </button>
                                          }
                                          <button onClick={() => nav('/my-account/edit-project/' + record.id)} >
                                            <img src={edit} />
                                          </button>
                                          <button onClick={() => HandleDelete(record.id)} >
                                            <img src={delete_img} />
                                          </button>
                                        </>

                                      }
                                    </div>
                                  </td>
                                </tr>
                              ))
                            )
                              :
                              null


                          }
                        </tbody>
                      </table>

                    </div>
                    <div className="pagination d-flex justify-content-end">
                      <ul className="pagination-list d-flex">
                        <li
                          className={`pagination-item ${currentPage === 1 ? "disabled" : ""
                            }`}
                        >
                          <button
                            onClick={() => paginate(currentPage - 1)}
                            className="pagination-link pagination-btn"
                            disabled={currentPage === 1}
                          >
                            &lt;
                          </button>
                        </li>
                        {Array.from({
                          length: Math.ceil(data.length / itemsPerPage),
                        }).map((_, index) => (
                          <li key={index}>
                            <button
                              onClick={() => paginate(index + 1)}
                              className={`pagination-link pagination-btn pagination-item ${currentPage === index + 1
                                ? "active-pagination-btn"
                                : ""
                                }`}
                            >
                              {index + 1}
                            </button>
                          </li>
                        ))}
                        <li
                          className={`pagination-item ${currentPage === Math.ceil(data.length / itemsPerPage)
                            ? "disabled"
                            : ""
                            }`}
                        >
                          <button
                            onClick={() => paginate(currentPage + 1)}
                            className="pagination-link pagination-btn"
                            disabled={
                              currentPage ===
                              Math.ceil(data.length / itemsPerPage)
                            }
                          >
                            &gt;
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      {
        // popup modal start here..
        <div className={`status-modal ${visible ? ' ' : 'd-none'}`}>
          <div className='status-modal-form-wraper' style={{ position: 'relative' }}>
            <p className='text-center'>Update status</p>
            <button onClick={() => setvisible(false)} className='close-popup-status-modal'>X</button>
            <form onSubmit={handleSubmit}>
              <FormControl component="fieldset">
                <RadioGroup
                  aria-label="status"
                  name="status"
                  value={status}
                  onChange={handleChange}
                >
                  <FormControlLabel value="active" control={<Radio />} label="Active" />
                  <FormControlLabel value="inactive" control={<Radio />} label="Inactive" />
                </RadioGroup>
                <Button className='my-3 submit-status-active-inactive-wraper' type="submit" variant="contained" color="primary">
                  Submit
                </Button>
              </FormControl>

            </form>
          </div>
        </div>
      }

    </Layout>
  )
}

export default AllProject
