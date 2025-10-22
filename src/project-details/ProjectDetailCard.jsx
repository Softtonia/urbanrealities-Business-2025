import React, { useState , useEffect, useContext } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import axios from 'axios'
import { AuthContext } from '../context/MyStore'
import { API_KEY } from '../config'
import { Alert, Box, CircularProgress, Stack } from '@mui/material'
import '../agent/CompanyConsultancy.css'
import { Fragment } from 'react'
import { post } from '../Api/api'


function ProjectDetailCard() {
    const{auth} = useContext(AuthContext)
    const[data , setData] = useState([])
    const[load , setLoad] = useState(true)
    const[visible , setVisible] = useState(false)
    const[message , setMessage] = useState('')
    const location = useLocation();
  
  
    console.log(message)
    console.log(auth)
    console.log(data)
  const{id,login_id}  = useParams()
    
    useEffect(()=>{
      console.log(auth.token)
      let fetchData = async () =>{
        // const instance = axios.create({
        //   baseURL: API_KEY,
        //   headers: {"api-token":id,}
        // });
          await post(`/api/property-details-by-projectId` , {project_id:id})
          .then(response=>{
            console.log(response.data)
            setData(response.data)
            setLoad(false)
            if (response.data.length===0) {
              setMessage("No Record")
            }
          })
          .catch(err=>{
            console.log(err)
          })
      }
      fetchData()
    },[ auth.token])
  
  
    useEffect(() => {
      window.scrollTo(0, 0);
      setVisible(true)
    }, [location]);
  return (
    <div className="col-12 company-consultancy-project">
    
    <div className="row g-5 ">
    {
      load ?
      ""
      :
      data.map((record, index) => (
        <div className="col-6 " key={record.id}> {/* Assuming record.id is a unique identifier */}
          <div className="row my-account-consultancy-rt-col-wp-2" style={{ backgroundColor: "white" }}>
            <div className="col-5 p-0 pe-2" style={{ position: 'relative' }}>
              {record.custom_field_values.map((data, i) => {
                if (data.field_name === "project_featured_img" && data.field_value.length > 0) {
                  return (
                    <picture key={i}>
                      <img src={API_KEY + "/uploads/media/"+data.field_value.join('')} className="img-fluid h-100" alt="Featured" />
                    </picture>
                  );
                }
                return null;
              })}
              <button className="company-consultancy-status-btn"><span>Verified</span></button>
            </div>
            <div className="col-7 my-consultancy-cpmpany-wp-2-slider">
              <div>
              <p style={{textAlign:"right"}} className={`me-3 ${record.status==="pending" ? 'text-warning' : record.status==="text-danger" ? "reject-text" : "text-success"}`}>{record.status}</p>
               
                {record.custom_field_values.map((data, i) => {
                  if (data.field_name === "projcect_onboard_price") {
                    return <Fragment key={i}> <h2 >₹ {parseFloat(data?.field_value).toLocaleString()}</h2><hr/> </Fragment>;
                  }
                  return null;
                })}
               
                <p>{record.property_name}</p>
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
               
                {
                    record.custom_field_values.map((data,i)=>(
                       data.field_name==="Project_unit_type"  && (
                    <>
                    <p>Unit type :
                    {
                     data.field_value.map((flat,ind)=>(
                         <span className='me-2' key={ind}>{flat}</span>
                     ))
                    }
                    </p>
                    <hr/>
                    </>
                       )
                    ))
                }

                  
                  
                  
                
                {record.custom_field_values.map((data, i) => {
                  if (data.field_name === "listing_available_from") {
                    return (
                      <Fragment key={i}>
                        <p>Available for {data.field_value} </p>
                        <hr />
                      </Fragment>
                    );
                  }
                  return null;
                })}
                {record.custom_field_values.map((data, i) => {
                  if (data.field_name === "listing_carpet_area") {
                    return <p key={i}>Carpet Area {data.field_value} </p>;
                  }
                  return null;
                })}
              </div>
              <ul className="m-0 myy-consultancy-company-manager-wp">
               
                <li className="my-company-consultancy-manage-wp-2">
                  <a href="#">Manage Property</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      ))
      
      
    }
     
    </div>
    <Stack sx={{ width: '50%' , margin:"auto" , marginTop:"60px" }} spacing={2}>

  {
    message ==="" ? 
    "" 
    :
    <Alert severity="error">{message}</Alert>
  }
</Stack>
  </div>
  )
}

export default ProjectDetailCard
