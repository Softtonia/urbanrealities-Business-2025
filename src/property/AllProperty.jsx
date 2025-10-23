import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/MyStore';
import Layout from '../Layout/Layout';
import LeftNavbar from '../Layout/LeftNavbar';
import { toast } from 'react-toastify';
import { get, post } from '../Api/api';
import edit from '../../img/edit.svg';
import delete_img from '../../img/delete.svg';
import './AllProperty.css';

const AllProperty = () => {
  const [data, setData] = useState([]);
  const [itemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [load, setLoad] = useState(false);
  const [visible, setVisible] = useState(false);
  const [status, setStatus] = useState('active');
  const [projectId, setProjectId] = useState('');
  const [selectedIds, setSelectedIds] = useState([]); // ✅ For bulk delete tracking

  const { auth } = useContext(AuthContext);
  const nav = useNavigate();

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  let count = (currentPage - 1) * itemsPerPage + 1;

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= Math.ceil(data.length / itemsPerPage)) {
      setCurrentPage(pageNumber);
    }
  };

  // ✅ Handle individual checkbox select/deselect
  const handleCheckboxChange = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // ✅ Handle "Select All" checkbox
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(currentItems.map((item) => item.id));
    } else {
      setSelectedIds([]);
    }
  };

  // ✅ Bulk delete function
const [bulkAction, setBulkAction] = useState('');

const handleBulkDelete = async () => {
  if (bulkAction !== 'delete') {
    toast.warning('Please select an action first.');
    return;
  }

  if (selectedIds.length === 0) {
    toast.warning('Please select at least one property to delete.');
    return;
  }

  const confirmMsg = window.confirm(
    `Are you sure you want to delete ${selectedIds.length} item(s)?`
  );
  if (!confirmMsg) return;

  try {
    // Convert selectedIds array to a comma-separated string
    const ids = selectedIds.join(',');

    await post(`/api/delete-properties-listing`, { id: ids });

    toast.success('Selected properties deleted successfully!');
setData((prev) => prev.filter((item) => !selectedIds.includes(item.id)));
    setSelectedIds([]);
    setBulkAction('');
  } catch (err) {
    console.error(err);
    toast.error('Error deleting selected properties.');
  }
};

  // Single delete (existing)
  const HandleDelete = async (id) => {
    const confirmMsg = confirm('Are you sure to delete this property?');
    if (!confirmMsg) return;

    try {
      await post(`/api/delete-properties-listing`, { id });
      toast.success('Record Deleted Successfully!');
      setData((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.log(err);
      toast.error('Error deleting property.');
    }
  };

  const handleModal = (id,status) => {
    setStatus(status)
    setProjectId(id);
    setVisible(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await post("/api/update-temporary-status", {
        property_id: projectId,
        temporary_status: status,
      });
      toast.success("Updated Successfully!");
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      await get(`/api/get-all-properties-listing`)
        .then((response) => {
          setData(response?.data?.data || []);
          setLoad(true);
        })
        .catch((err) => console.log(err));
    };
    fetchData();
  }, [auth.token]);

  return (
    <Layout>
      <div className="wrape-2-nav-common-wp all-project-listing-search-wraper">
        <div className="container">
          <div className="row">
            <LeftNavbar />
            <div className="col-10 flex-grow-1">
              <div className="row add-property-row">
                <div className="col-lg-12 col-md-12 col-sm-12 right-purpose-col">
                  <div className="right-section-wraper">
                    <div className="container action-dropdown-wraper d-flex justify-content-between">
                      <div className="d-flex action-parent">
                        <div className="dropdown-act-wraper">
  <select
    className="form-select form-select-lg"
    value={bulkAction}
    onChange={(e) => setBulkAction(e.target.value)}
  >
    <option value="">Bulk Action</option>
    <option value="delete">Delete</option>
  </select>
</div>

<div>
  <button className="apply-btn-wraper" onClick={handleBulkDelete}>
    <span>Apply</span>
  </button>
</div>

                      </div>
                      <Link to="/my-account/add-listing" className="apply-btn-wraper">
                        <span>Add Property</span>
                      </Link>
                    </div>

                    {/* Table */}
                    <div className="edit-purpose-table-wraper table-responsive">
                      <table className="table">
                        <thead>
                          <tr>
                            <th>
                              <input
                                type="checkbox"
                                onChange={handleSelectAll}
                                checked={
                                  currentItems.length > 0 &&
                                  selectedIds.length === currentItems.length
                                }
                              />{" "}
                              S.No
                            </th>
                            <th>Name</th>
                            <th>Purpose</th>
                            <th>Status</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {load &&
                            currentItems.map((record, i) => (
                              <tr key={record.id}>
                                <td>
                                  <input
                                    type="checkbox"
                                    checked={selectedIds.includes(record.id)}
                                    onChange={() => handleCheckboxChange(record.id)}
                                  />{" "}
                                  {count++}
                                </td>
                                <td>{record.name}</td>
                                <td>{record.purpose_id_name}</td>
                                <td>
                                  <button
                                    className={
                                      record.temporary_status === "active"
                                        ? "active_view"
                                        : "deactivate_view bg-danger"
                                    }
                                    onClick={() => handleModal(record.id,record.temporary_status)}
                                  >
                                    {record.temporary_status === "active"
                                      ? "Active"
                                      : "Inactive"}
                                  </button>
                                </td>
                                <td>
                                  <div className="edit-del-btn-wraper">
                                    <button onClick={() => nav(`/my-account/edit-listing/${record.id}`)}>
                                      <img src={edit} alt="edit" />
                                    </button>
                                    <button onClick={() => HandleDelete(record.id)}>
                                      <img src={delete_img} alt="delete" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination */}
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

      {/* Status modal */}
      {visible && (
        <div className="status-modal">
          <div className="status-modal-form-wraper" style={{ position: "relative" }}>
            <p className="text-center">Update status</p>
            <button onClick={() => setVisible(false)} className="close-popup-status-modal">
              X
            </button>
            <form onSubmit={handleSubmit}>
              <div className="my-3">
                <label>
                  <input
                    type="radio"
                    name="status"
                    value="active"
                    checked={status === "active"}
                    onChange={(e) => setStatus(e.target.value)}
                  />
                  Active
                </label>
                <label className="ms-3">
                  <input
                    type="radio"
                    name="status"
                    value="deactive"
                    checked={status === "deactive"}
                    onChange={(e) => setStatus(e.target.value)}
                  />
                  Inactive
                </label>
              </div>
              <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
        </div>
    )}
    </Layout>
  );
};

export default AllProperty;










// import React from 'react'
// import { API_KEY , API_TOKEN } from '../config';
// import { useState , useEffect ,useContext } from "react";
// import { AuthContext } from '../context/MyStore';
// import { Link, useNavigate } from 'react-router-dom';
// import Layout from '../Layout/Layout';
// import LeftNavbar from '../Layout/LeftNavbar';
// import axios from 'axios';
// import '../property/AllProperty.css'
// import view from '../../img/view.png'
// import edit from '../../img/edit.svg'
// import delete_img from '../../img/delete.svg'
// import { toast } from 'react-toastify';
// import { Fragment } from 'react';
// import { get, post } from '../Api/api';

// function AllProperty() {
//     const [data, setData] = useState([]);
//     const [itemsPerPage] = useState(10); // You can adjust the number of items per page
//     const [currentPage, setCurrentPage] = useState(1);
//     const [load, setLoad] = useState(false);
//     const[visible , setvisible] = useState(false)
//     const [formData, setFormData] = useState({
//       project_id: "",
//       status: "",
//       status_reason: "",
//     });
//     const{auth} = useContext(AuthContext)
//     const nav = useNavigate();
//     console.log(formData)
//     const [modal, setModal] = useState(false);
  
//     const [selectedOption, setSelectedOption] = useState(null);
  
//     console.log(data)
  
//     let count = (currentPage - 1) * itemsPerPage + 1;
  
//     // code for pagination
//     // Calculate pagination
//     const indexOfLastItem = currentPage * itemsPerPage;
//     const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//     const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  
//     // Change page
//     const paginate = (pageNumber) => {
//       if (
//         pageNumber >= 1 &&
//         pageNumber <= Math.ceil(data.length / itemsPerPage)
//       ) {
//         setCurrentPage(pageNumber);
//       }
//     };

//     const HandleDelete = async(id) => {
//       console.log(id)
//       const confirmMsg = confirm('Are you sure to delete')
//       console.log(confirmMsg)
//       if(confirmMsg){
//         // const instance = axios.create({
//         //   baseURL: `${API_KEY}`,
//         //   headers: {'api-token': auth.token}
//         // });
//         await post(`/api/delete-website-project-listing`,{id})
//         .then(response=>{
//           console.log(response)
//           toast.success('Record Deleted Successfuly!')
//           setTimeout(() => {
//             window.location.reload()
//           }, 1000);
//         })
//         .catch(err=>{
//           console.log(err)
//           alert("Something wrong")
//         })
//       }
     
//      }
//   // submit form here
//      const handleSubmit = (e) => {
//       e.preventDefault();
//       // const axiosInstance = axios.create({
//       //   baseURL: API_KEY,
//       //   headers: { "api-token": API_TOKEN },
//       // });
//       post("/api/update-project-status-by-admin", formData)
//         .then((response) => {
//           console.log(response);
//           alert("Updated Sussessfuly!");
//           window.location.reload();
//         })
//         .catch((err) => {
//           console.log(err);
//         });
//     };
//     useEffect(() => {
//       let fetchData = async () => {
//         // const instance = axios.create({
//         //   baseURL: `${API_KEY}`,
//         //   headers: { "api-token": auth.token },
//         // });
//         await get(`/api/get-all-properties-listing`)
//           .then((response) => {
//             console.log(response)
//             setData(response?.data?.data.data ||[])
//             setLoad(true)
//           })
//           .catch((err) => {
//             console.log(err);
//           });
//       };
//       fetchData();
//     }, [auth.token]);
//    console.log("data===>",data)
//   return (
//     <Layout>
//     <div className="wrape-2-nav-common-wp all-property-listing-search-wraper">
//       <div className="container">
//         <div className="row ">
//           <LeftNavbar />
//           <div className='col-10 flex-grow-1  '>
//           <div className="row add-property-row">
//           <div className="col-lg-12 col-md-12 col-sm-12 right-purpose-col">
//             <div className="right-section-wraper">
//               <div className="container  action-dropdown-wraper d-flex justify-content-end">
               

//                 {
//                 //     <label className="search-content-wraper d-flex justify-content-between">
//                 //   <input type="text" placeholder="Search" />
//                 //   <button>
//                 //     <span>
//                 //     </span>
//                 //   </button>
//                 // </label>
//                 }
//                 <Link to="/my-account/add-listing" className='apply-btn-wraper'><span>Add Listing</span></Link>
//               </div>

//               {
//                 // table start here
//               }

//               <div className="my-project-view-detail-property-card">
               
//               <div className="row">
//               {data?.map((property, index) => (
//                 <div key={index} className="coverflow-item col-3 ">
//                   <div className="card-wraper">
//                     <div className="main-img-wraper">
//                       {property.custom_field_values.map((record, i) => (
//                         <Fragment key={i}>
//                           {record.field_name === "listing_featured_img" && (
//                             <img
//                               src={ 
//                                 record.field_value.join("")}
//                               className="img-fluid"
//                               alt={`Slide ${index + 1}`}
//                             />
//                           )}
//                         </Fragment>
//                       ))}
//                     </div>
//                     <div className="card-content-wraper d-flex justify-content-between">
//                       <div className="w-100">
//                         <div className="d-flex justify-content-between ">
//                           {property.custom_field_values.map((record, i) => (
//                             <Fragment key={i}>
//                               {record.field_name === "property_list_property_price" && (
//                                 <strong className="price-wraper d-flex align-center">
//                                   {" "}
//                                   {record.field_value} 
//                                 </strong>
//                               )}
//                             </Fragment>
//                           ))}
//                           <div className="rating-wraper d-flex align-center">
//                             <p>4.5</p>
//                             <span className="ms-1">
//                               {" "}
//                             {
//                               // <img src={star} />{" "}
//                             }
//                             </span>
//                           </div>
//                         </div>
//                         <hr className="m-0 gray-border" />
//                         <p className="d-flex mt-1">
//                           {property.custom_field_values.map((record, i) => (
//                             <Fragment key={i}>
//                               {record.field_name ==="property_list_flat" && (
                                 
//                                   record.field_value.join('')
                               
//                               )}
//                             </Fragment>
//                           ))}
                          
//                           <span className="span-divider"></span>
//                            {property.custom_field_values.map((record, i) => (
//                             <Fragment key={i}>
//                               {record.field_name ==="listing_propety_area" && (
                                 
//                                   record.field_value
//                               )}
//                             </Fragment>
//                           ))}
//                         </p>
//                         <hr className="m-0 gray-border" />
//                        <div className="d-flex justify-content-between align-center">
//                        {property.custom_field_values.map((record, i) => (
//                         <Fragment key={i}>
//                           {record.field_name === "listing_property_address" && (
//                             <p className="mt-1">
//                               {record.field_value}&nbsp;&nbsp;&nbsp;&nbsp;
//                             </p>
//                           )}
                      
                          
//                         </Fragment>
//                       ))}
//                       <span className="gs-property-wraper d-flex align-center order-1" >
//                       {property.project_id_name}
//                     </span>
//                        </div>
                        
                        
                        
                        
//                         <hr className="m-0 gray-border" />
//                         <p className="mt-1">
//                           Available for{" "}
                         
//                           {property.custom_field_values.map((record, i) => (
//                             <Fragment key={i}>
//                               {record.field_name === "listing_available_from" && (
                                
//                                   <strong className="price-str-wraper">{record.field_value}</strong>
                             
//                               )}
//                             </Fragment>
//                           ))}
//                         </p>
//                         <hr className="m-0 gray-border" />
//                         <p className="mt-1">
//                           Carpet Area{" "}
                         
//                           {property.custom_field_values.map((record, i) => (
//                             <Fragment key={i}>
//                               {record.field_name === "listing_carpet_area" && (
                                
//                                   <strong className="price-str-wraper">{record.field_value}</strong>
                             
//                               )}
//                             </Fragment>
//                           ))}
//                         </p>
//                       </div>
//                       <div className="details-wraper d-flex justify-centent-space-between align-center w-100">
//                         {
//                         //   <button className='m-0' >
//                         //   <Link to={"/property-detail/"+property.id} ><span>More Details</span></Link>
//                         // </button>
//                         }
//                         <div>
//                           <Link to={'/my-account/edit-listing/' + property.id} className='me-2'><img src={edit}/></Link>
//                           <Link onClick={HandleDelete}><img src={delete_img}/></Link>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//               </div>
//             </div>
//             </div>
//           </div>
//         </div>
//           </div>
//         </div>
//       </div>
//     </div>
//      </Layout>
//   )
// }

// export default AllProperty
