import React, { useContext } from 'react'
import Layout from '../Layout/Layout'
import LeftNavbar from '../Layout/LeftNavbar'
import '../ticket/Ticket.css'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_KEY, API_TOKEN } from '../config'
import axios from 'axios'
import view from '../../img/view.png'
import edit_img from '../../img/edit.svg'
import delete_img from '../../img/delete.svg'
import '../agent/AllAgent.css'
import { AuthContext } from '../context/MyStore'
import SearchAgent from './SearchAgent'
import AlertMessage from '../message/AlertMessage'
import test_img from '../../img/dashboard_image.png'
import AssignProjectToAgentModal from '../consultancy/AssignProjectToAgentModal'
import { get, post } from '../Api/api'


function AllAgent() {
  const [data, setData] = useState([]);
  const [itemsPerPage] = useState(10); // You can adjust the number of items per page
  const [currentPage, setCurrentPage] = useState(1);
  const [load, setLoad] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  // const{setUserName , setId} = useContext(MyContext)
  const nav = useNavigate();
  const { auth } = useContext(AuthContext)
  console.log(auth)
  console.log(auth.token)
  console.log(data)

  let count = (currentPage - 1) * itemsPerPage + 1;

  // code for pagination
  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => {
    if (
      pageNumber >= 1 &&
      pageNumber <= Math.ceil(data.length / itemsPerPage)
    ) {
      setCurrentPage(pageNumber);
    }
  };

  const HandleEdit = (name, id) => {
    setId(prev => ({
      ...prev,
      id: id
    }))
    setUserName(prev => ({
      ...prev,
      name: name
    }))
    nav('/edit-user')
  }

  const HandleView = (id, role, role_id) => {
    // console.log( id)
    nav('/my-account/profile-data/' + id + "/" + role + "/" + role_id)
  }
  const handleDel = (id) => {
    console.log(id);
    // const instance = axios.create({
    //   baseURL: API_KEY,
    //   headers: { "api-token": API_TOKEN },
    // });
    post("/api/delete-user", { id })
      .then((response) => {
        console.log(response.data.message);
        alert("Deleted successfuly!");
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleOpenModal = (project) => {
    setSelectedProject(project);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedProject(null);
  };


  useEffect(() => {
    let fetchData = async () => {
      // const instance = axios.create({
      //   baseURL: `${API_KEY}/api`,
      //   headers: { "api-token": auth.token },
      // });
      await get(`/get-consultancy-agent-listing`)
        .then((response) => {
          setData(response.data)
          console.log(response.data)
          setLoad(true)
        })
        .catch((err) => {
          console.log(err);
        });
    };
    fetchData();
  }, [auth.token]);

  return (
    // auth.role==="consultancy" ?
    auth.role === "company" ?
      <Layout>
        <div className="wrape-2-nav-common-wp all-agent-listing-search-wraper">
          <div className="container">
            <div className="row ">
              <LeftNavbar />
              <div className='col-10 flex-grow-1  '>
                <div className='container all-agent-listing-search-wraper-right-section'>
                  <div className='d-flex justify-content-between'>
                    <button onClick={() => nav('/my-account/add-agent')} className='add-agent-btn'><span>Add Agent</span></button>

                    <SearchAgent />

                  </div>
                  <div className='row'>
                    {
                      [1,2,3,4].map((record, index) => (
                        <div className='col-4 mt-3 ' key={index}>
                          <div className='all-consultancy-card-wraper'>
                            <div className='all-consultancy-card-profile'>
                              <div className='all-consultancy-card-logo'>
                                <img className='w-100 h-100' src={test_img} />
                              </div>
                              <div className='all-consultancy-card-developer'>
                                <h3>{record.fullname}</h3>
                                <p> <span>Business name &nbsp;: &nbsp;</span>{record.bussiness_name}</p>
                                <p> <span>Consultancy id  &nbsp;: &nbsp;</span> {record.unique_id}</p>
                                <p><span>Rera no &nbsp;: &nbsp;</span>{record.license_number}</p>
                                <div className='all-consultancy-card-description'>
                                  <p>
                                    <strong className='text-black'>Address</strong>  &nbsp;: &nbsp; {record.bussiness_address} ,{record.city} , {record.state} ,  (pin-code :{record.pin_code}) , {record.country}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <ul className='all-consultancy-card-list-group'>
                              <li>
                                <span className='all-consultancy-card-tittle '>Email &nbsp;:</span>
                                <span className='all-consultancy-card-value'>{record.email}</span>
                              </li>
                              <li>
                                <span className='all-consultancy-card-tittle'>Phone &nbsp;:</span>
                                <span className='all-consultancy-card-value'>{record.phone}</span>
                              </li>

                            </ul>
                            <div className='all-consultancy-card-btn-wraper'>
                              <button onClick={() => nav('/my-account/profile-data/' + record.api_token + '/' + `role=${auth.role}` + '/' + auth.id)} className='all-consultancy-card-view'>view</button>
                              <button onClick={() => handleOpenModal(record.id)} className='all-consultancy-card-assign'>Assign Project</button>
                            </div>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {selectedProject && (
          <AssignProjectToAgentModal
            open={modalOpen}
            handleClose={handleCloseModal}
            data={data}
            id={selectedProject}
          />
        )}
      </Layout>
      :
      <AlertMessage />

  )
}

export default AllAgent
