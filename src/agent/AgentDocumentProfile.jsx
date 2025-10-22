import React, { useEffect, useState } from "react";
import Profile_image from "../../img/d-right.png";
import { useParams } from "react-router-dom";
import { API_KEY } from "../config";
import axios from "axios";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { post } from "../Api/api";

function AgentDocumentProfile() {
    const{id,login_id} = useParams()
    const[load , setLoad] = useState(true)
    const[data , setData] = useState([])
    console.log(id)
 console.log(data)
    useEffect(()=>{
        // const instance = axios.create({
        //     baseURL: API_KEY,
        //     headers: {'api-token': id}
        //   });
          post('/api/get-agent-details', {
            login_id:login_id
          })
          .then(response=>{
            console.log(response)
            setData([response.data])
            setLoad(false)
          })
          .catch(err=>{
            console.log(err)
            setLoad(true)
          })
    },[])
  return (
    load ? 
    <div className="w-100 h-100 d-flex justify-content-center align-center">
    <Box sx={{ display: 'flex' }}>
        <CircularProgress />
     </Box>
    </div>
    :
    data.map((record,index)=>(
        <div className="document-profile-wraper " key={index}>
       <div className="document-profile-logo-wrapers">
       <div
       className="d-block m-auto mt-4"
       style={{ width: "90px", height: "90px" , borderRadius:'50%' , overflow:'hidden'}}
     >
       <picture>
         <img src={record.profile_photo} className="img-fluid w-100 h-100" />
       </picture>
     </div>
     <p className="text-center mt-3">
       <strong className="text-white">{record.fullname}</strong>
     </p>
       </div>
      <ul className="document-inner-contact-info-wp">
      <li><span className="document-inner-contact-title">Phone</span><span className="document-inner-contact-value">{record.phone}</span></li>
      <li><span className="document-inner-contact-title">Email</span><span className="document-inner-contact-value">{record.email}</span></li>
      <li><span className="document-inner-contact-title text-capatilize">State</span><span className="document-inner-contact-value text-capatilize">{record.state}</span></li>
      <li><span className="document-inner-contact-title">Country</span><span className="document-inner-contact-value text-capatilize">{record.country}</span></li>
      <li><span className="document-inner-contact-title">City</span><span className="document-inner-contact-value  text-capatilize">{record.city}</span></li>
      <li><span className="document-inner-contact-title">Pin code</span><span className="document-inner-contact-value">{record.pin_code}</span></li>
      <li><span className="document-inner-contact-title">Rera no</span><span className="document-inner-contact-value">{record.license_number}</span></li>
      <li><span className="document-inner-contact-title">Alternate no</span><span className="document-inner-contact-value">{record.alternate_number}</span></li>
      {
        // <h3>Phone Number: {record.phone}</h3>
        // <h3>Email: {record.email}</h3>
        // <h3>State: {record.state}</h3>
        // <h3>Country: {record.country} </h3>
        // <h3>City: {record.city} </h3>
        // <h3>Pin code: {record.pin_code} </h3>
        // <h3>License number: {record.license_number} </h3>
      }
      </ul>
    </div>
    ))
  );
}

export default AgentDocumentProfile;
