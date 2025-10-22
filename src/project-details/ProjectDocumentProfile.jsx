import React, { Fragment, useContext, useEffect, useState } from "react";
import Profile_image from "../../img/d-right.png";
import { useParams } from "react-router-dom";
import { API_KEY } from "../config";
import axios from "axios";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { AuthContext } from "../context/MyStore";
import { get } from "../Api/api";

function ProjectDocumentProfile() {
    const{id} = useParams()
    const[load , setLoad] = useState(false)
    const[data , setData] = useState([])
    const{auth} = useContext(AuthContext)

    console.log(id)

    useEffect(()=>{
      // const instance = axios.create({
      //     baseURL: API_KEY,
      //     headers: {'api-token': auth.token}
      //   });
        get(`/api/get-data-website-project/${id}` )
    .then(response=>{
      // setFormData({
      //   ...formData,
      //  repeater_fields:response.data[0].custom_field_values
      // })
      console.log(response)
      setData(response.data)
      setLoad(false)
      
    })
    .catch(err=>{
      console.log(err)
      setLoad(true)
    })
  },[auth.token])
  return (
    load ? 
    <div className="w-100 h-100 d-flex justify-content-center align-center">
    <Box sx={{ display: 'flex' }}>
        <CircularProgress />
     </Box>
    </div>
    :
    data.map((record,index)=>(
        <Fragment key={index}>
        <div className="document-profile-wraper ">
        <div
          className="d-block m-auto mt-4"
          style={{ width: "90px", height: "90px", borderRadius:"50%", overflow:"hidden" }}
        >
        {
          record.custom_field_values.map((data, i) => (
            <Fragment key={i}>
              {data.field_name === "project_brand_logo" && (
                <picture>
                  <img src={Array.isArray(data.field_value) ? `${API_KEY}/uploads/media/`+data.field_value.join('') : data.field_value} alt="brand logo" className="img-fluid w-100 h-100" />
                </picture>
              )}
            </Fragment>
          ))
        }
        </div>
        <p className="text-center mt-3">
       
        
          <strong>{record.fullname}</strong>
        </p>
        <div className="document-inner-contact-info-wp">
          <h3>Age: 76</h3>
          <h3>Phone Number: {record.phone}</h3>
          <h3>Email: {record.email}</h3>
          <h3>State: {record.state}</h3>
          <h3>Country: {record.country} </h3>
          <h3>City: {record.city} </h3>
          <h3>Pin code: {record.pin_code} </h3>
          <h3>License number: {record.license_number} </h3>
        </div>
          </div>
         
        </Fragment>
    ))
  );
}

export default ProjectDocumentProfile;
