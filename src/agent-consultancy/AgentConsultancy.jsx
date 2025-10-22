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
import test_img from '../../img/dashboard_image.png'
import { get, post } from '../Api/api'


function AgentConsultancy() {
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
    
          post('/api/accept-decline-request-by-consultancy-to-agent',{
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
  
        post('/api/leave-the-consultancy',{
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
        get('/api/get-all-join-request-listing')
          .then(response => {
          console.log(response.data.join_requests)
            const filterStatus = response.data.join_requests.filter((data=>data.status==="accepted"))
            console.log(response.data.join_requests)
            
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
            <div className='container all-agent-listing-search-wraper-right-section '>
            
          {
          //   <div className=" edit-purpose-table-wraper table-responsive  ">
          //   <table className="table">
          //     <thead>
            
          //       <tr>
          //         <th scope="col " className="id-col">
          //           <span>
          //             <input type="checkbox" />
          //           </span>
          //           <p className="m-0 d-inline">S.No</p>
          //         </th>
          //         <th scope="col">Full-Name</th>
          //         <th scope="col">Email</th>
          //         <th scope="col">Phone Number </th>
          //         <th scope="col">Action</th>
          //       </tr>
                
          //     </thead>
          //     <tbody>
          //      {
          //        load ? (
          //         currentItems.map((record , i)=>(
          //             <tr id="col-id" key={i}>
          //             <th scope="row" className="d-flex id-col">
          //               <div style={{ width: "72px" }} className="d-flex">
          //                 <span>
          //                   <input type="checkbox" />
          //                 </span>
          //                 <p className="m-0">{count++}</p>
          //               </div>
          //             </th>
                     
          //             <td>
          //               <div style={{ width: "250px" }} className="d-flex">
          //                 {record.company?.fullname}
          //               </div>
          //             </td>
          //             <td>
          //               <div style={{ width: "300px" }} className="d-flex">
          //                 {record.company?.email}
          //               </div>
          //             </td>
          //             <td>
          //               <div style={{ width: "155px" }} className="d-flex">
          //                 {record.company?.phone}
          //               </div>
          //             </td>
          //             <td>
          //               <div
                          
          //                 style={{ width: "174px" }}
          //               >
          //               <button onClick={()=>nav('/my-account/profile-data/' + record.company.api_token + "/" + 'role=company' +"/" + record.company.id
          //             )} className='view-btn'><span>view</span></button>
          //                {
          //                 record.status==="requested"?
          //                 <>
          //                 <button onClick={()=>handleAccept(record.company.id)} className='accept-request-button' >
          //                 <span>Accept</span>
          //              </button>
          //              <button onClick={()=>handleReject(record.company.id,i)} className='reject-request-button bg-danger'>
          //                 <span>Reject</span>
          //              </button>
          //                 </>
          //                 :
          //                 record.status==="leaved"?
          //                 <>
          //                 <button  className='reject-request-button bg-danger'>
          //                 <span>Leaved</span>
          //              </button>
          //                 </>
          //                 :
          //                 <button onClick={()=>handleLeave(record.company?.id,i)} className='reject-request-button bg-danger'>
          //                 <span>Leave</span>
          //              </button>
          //                }
                         
                          
          //               </div>
          //             </td>
                     
  
                      
          //           </tr>
          //         ))
          //        )
          //        :
          //        null
                 
              
          //      }
          //     </tbody>
          //   </table>
  
          // </div>
          }

          <div className='row'>
          {
           data.map((record,index)=>(
             <div className='col-4 mt-3 ' key={index}>
             <div className='all-consultancy-card-wraper'>
               <div className='all-consultancy-card-profile'>
                 <div className='all-consultancy-card-logo' style={{overflow:'hidden'}}>
                 <img className='w-100 h-100' src={API_KEY + "/" + record.consultancy.profile_photo}/>
                 </div>
                 <div className='all-consultancy-card-developer'>
                   <p><span>Name &nbsp;:&nbsp;</span>{record.consultancy?.fullname}</p>
                   {

                    <p> <span>Business name :</span>{record.consultancy?.business_name}</p>

                   }
                   <p> <span>consultancy id &nbsp;:&nbsp;</span> {record.consultancy?.unique_id}</p>
                 {
                  // <p><span>Rera no:</span>{record.license_number}</p>
                //   <div className='all-consultancy-card-description'>
                //   <p>
                //   <strong className='text-black'>Address</strong> : {record.bussiness_address} ,{record.city} , {record.state} ,  (pin-code :{record.pin_code}) , {record.country}
                //   </p>
                // </div>
                 }
                 </div>
               </div>

               <ul className='all-consultancy-card-list-group'>
                <li>
                 <span className='all-consultancy-card-tittle '>Email &nbsp;:</span>
                 <span className='all-consultancy-card-value'>{record.consultancy?.email}</span>
                </li>
                <li>
                 <span className='all-consultancy-card-tittle'>Phone &nbsp;:</span>
                 <span className='all-consultancy-card-value'>{record.consultancy?.phone}</span>
                </li>
               
               </ul>
                <div className='all-consultancy-card-btn-wraper'>
                <button onClick={()=>nav('/my-account/profile-data/' + record.consultancy.api_token + "/" + 'role=consultancy' +"/" + record.consultancy.id
              )}  className='all-consultancy-card-view'>view</button>
                {
                  record.status==="requested"?
                  <>
                  <button onClick={()=>handleAccept(record.consultancy.id)} className='accept-request-button' >
                  <span>Accept</span>
               </button>
               <button onClick={()=>handleReject(record.consultancy.id,i)} className='reject-request-button bg-danger'>
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
                  <button onClick={()=>handleLeave(record.consultancy?.id,i)} className='reject-request-button bg-danger'>
                  <span>Leave</span>
               </button>
                 }
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
     </Layout>
  )
}

export default AgentConsultancy
