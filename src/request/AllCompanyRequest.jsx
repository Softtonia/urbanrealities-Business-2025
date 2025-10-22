import React, { useContext } from 'react'
import Layout from '../Layout/Layout'
import LeftNavbar from '../Layout/LeftNavbar'
import '../ticket/Ticket.css'
import { useState , useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import { API_KEY } from '../config'
import axios from 'axios'
import '../request/AllRequest.css'
import '../agent/AllAgent.css'
import { AuthContext } from '../context/MyStore'
import { toast } from 'react-toastify'
import { get, post } from '../Api/api'
function AllCompanyRequest() {
    const [data, setData] = useState([]);
    const [itemsPerPage] = useState(10); // You can adjust the number of items per page
    const [currentPage, setCurrentPage] = useState(1);
    const [load, setLoad] = useState(false);
    const[message,setMessage] = useState('')
    // const{setUserName , setId} = useContext(MyContext)
    const nav = useNavigate();
    const{auth} = useContext(AuthContext)
   console.log(auth)
   console.log(auth.token)
    console.log( data)
  console.log(message)
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
  
   
    console.log(currentItems)

    const handleAccept = (id) => {
        console.log(id)
        // const instance = axios.create({
        //     baseURL: API_KEY,
        //     headers: { "api-token": auth.token },
        //   });

          post('/api/accept-decline-company-request-by-consultancy',{
            company_id:id,
            status:'accepted'
          })
          .then(response=>{
            console.log(response)
            toast.success(response.data.message)
            setMessage(response.data.message)
          })
          .catch(err=>{
            console.log(err)
          })
    }
    const handleReject = (id,index) => {
        console.log(id)

       
        
        // const instance = axios.create({
        //     baseURL: API_KEY,
        //     headers: { "api-token": auth.token },
        //   });
    
          post('/api/accept-decline-company-request-by-consultancy',{
            consultancy_id:id,
            status:'rejected'
          })
          .then(response=>{
            console.log(response)
            toast.success(response.data.message)
            setMessage(response.data.message)
            
            console.log(data)
            // setTimeout(() => {
            //     window.location.reload()
            // }, 1000);
          })
          .catch(err=>{
            console.log(err)
          })
    }
    const handleLeave = (id,index) => {
      console.log(id)
      
      
      // const instance = axios.create({
      //     baseURL: API_KEY,
      //     headers: { "api-token": auth.token },
      //   });
  
        post('/api/leave-the-comapny-by-consultancy',{
          company_id:id,
        })
        .then(response=>{
          console.log(response)
          toast.success(response.data.message)

          console.log(data)
          setMessage(response.data.message)

          // setTimeout(() => {
          //     window.location.reload()
          // }, 1000);
        })
        .catch(err=>{
          console.log(err)
        })
  }

    useEffect(() => {
        // const instance = axios.create({
        //   baseURL: API_KEY,
        //   headers: { "api-token": auth.token },
        // });
        get('/api/get-all-consultancy-join-request-listing')
          .then(response => {
          
            const filterStatus = response.data.join_requests.filter((data=>data.status==="requested"))
            console.log(filterStatus)
            
            setData(filterStatus );
            setLoad(true)
          })
          .catch(err => {
            console.log(err);
          });
      }, [auth.token,message]);
      
  return (
    <Layout>
    <div className="wrape-2-nav-common-wp all-agent-listing-search-wraper">
      <div className="container">
        <div className="row ">
          <LeftNavbar />
          <div className='col-10 flex-grow-1  '>
            <div className='container all-agent-listing-search-wraper-right-section'>
            
            <div className=" edit-purpose-table-wraper table-responsive  ">
            <table className="table">
              <thead>
            
                <tr>
                  <th scope="col " className="id-col">
                    <span>
                      <input type="checkbox" />
                    </span>
                    <p className="m-0 d-inline">S.No</p>
                  </th>
                  <th scope="col">Full-Name</th>
                  <th scope="col">Email</th>
                  <th scope="col">Phone Number </th>
                  <th scope="col">Action</th>
                </tr>
                
              </thead>
              <tbody>
               {
                 load ? (
                  currentItems.map((record , i)=>(
                      <tr id="col-id" key={i}>
                      <th scope="row" className="d-flex id-col">
                        <div style={{ width: "72px" }} className="d-flex">
                          <span>
                            <input type="checkbox" />
                          </span>
                          <p className="m-0">{count++}</p>
                        </div>
                      </th>
                     
                      <td>
                        <div style={{ width: "250px" }} className="d-flex">
                          {record.company?.fullname}
                        </div>
                      </td>
                      <td>
                        <div style={{ width: "300px" }} className="d-flex">
                          {record.company?.email}
                        </div>
                      </td>
                      <td>
                        <div style={{ width: "155px" }} className="d-flex">
                          {record.company?.phone}
                        </div>
                      </td>
                      <td>
                        <div
                          
                          style={{ width: "174px" }}
                        >
                         {
                          record.status==="requested"?
                          <>
                          <button onClick={()=>handleAccept(record.company.id)} className='accept-request-button' >
                          <span>Accept</span>
                       </button>
                       <button onClick={()=>handleReject(record.company.id,i)} className='reject-request-button bg-danger'>
                          <span>Reject</span>
                       </button>
                          </>
                          :
                          record.status==="leaved"?
                          <>
                          <button  className='reject-request-button bg-danger'>
                          <span>Leaved</span>
                       </button>
                          </>
                          :
                          <button onClick={()=>handleLeave(record.company?.id,i)} className='reject-request-button bg-danger'>
                          <span>Leave</span>
                       </button>
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
                className={`pagination-item ${
                  currentPage === 1 ? "disabled" : ""
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
                    className={`pagination-link pagination-btn pagination-item ${
                      currentPage === index + 1
                        ? "active-pagination-btn"
                        : ""
                    }`}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}
              <li
                className={`pagination-item ${
                  currentPage === Math.ceil(data.length / itemsPerPage)
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
     </Layout>
  )
}

export default AllCompanyRequest
