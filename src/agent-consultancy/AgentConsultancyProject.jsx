import React, { useContext } from 'react'
import Layout from '../Layout/Layout'
import LeftNavbar from '../Layout/LeftNavbar'
import '../ticket/Ticket.css'
import { useState , useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import { API_KEY , API_TOKEN } from '../config'
import axios from 'axios'
import view from '../../img/view.png'
import edit_img from '../../img/edit.svg'
import delete_img from '../../img/delete.svg'
import '../agent/AllAgent.css'
import { AuthContext } from '../context/MyStore'
import AlertMessage from '../message/AlertMessage'
import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import edit from '../../img/edit.svg'
import { get, post } from '../Api/api'

function AgentConsultancyProject() {
    const [data, setData] = useState([]);
    const [itemsPerPage] = useState(10); // You can adjust the number of items per page
    const [currentPage, setCurrentPage] = useState(1);
    const [load, setLoad] = useState(false);
    // const{setUserName , setId} = useContext(MyContext)
    const nav = useNavigate();
    const{auth} = useContext(AuthContext)
   console.log(auth)
   console.log(auth.token)
    console.log(data)
  
    
  
    // Change page
    const paginate = (pageNumber) => {
      if (
        pageNumber >= 1 &&
        pageNumber <= Math.ceil(data.length / itemsPerPage)
      ) {
        setCurrentPage(pageNumber);
      }
    };
  
    const HandleEdit = (name,id) => {
      setId(prev=>({
        ...prev,
        id:id
      }))
      setUserName(prev=>({
        ...prev,
        name:name
      }))
      nav('/edit-user')
    }
    
    const HandleView = (id,role,login_id) => {
      // console.log( id)
      nav('/my-account/profile-data/' + id + "/" + role + "/" + login_id )
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
  
  const handleModal = () => {

  }
    useEffect(() => {
      let fetchData = async () => {
        // const instance = axios.create({
        //   baseURL: `${API_KEY}/api`,
        //   headers: { "api-token": auth.token },
        // });
        await get(`/fetch-agent-total-assigned-project`)
          .then((response) => {
            setData(response.data.data)
            console.log(response.data.data)
            setLoad(true)
          })
          .catch((err) => {
            console.log(err);
          });
      };
      fetchData();
    }, [auth.token]);
    // fetch-total-assigned-project-to-consultancy
  return (
    auth.role==="agent" ?
    <Layout>
    <div className="wrape-2-nav-common-wp all-agent-listing-search-wraper">
      <div className="container">
        <div className="row ">
          <LeftNavbar />
          <div className='col-10 flex-grow-1  '>
            <div className='container all-agent-listing-search-wraper-right-section bg-white'>
           
            <div className='app-dv-4-lft-slider-wp' >
            <div className='row '>
              {
                data.map((record,index)=>(
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
                         {
                        //   <div className="text-center mt-3"> <Link to={'/my-account/edit-project/'+record.id} className="me-2"><img src={edit}/></Link>
                        //  <Link onClick={()=>HandleDelete(record.id)}><img src={delete_img}/></Link></div>
                         }
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
          
            </div>
          </div>
        </div>
      </div>
    </div>
     </Layout>
     :
     <AlertMessage/>

  )
}

export default AgentConsultancyProject
