import React, { Fragment, useContext, useEffect, useState } from "react";
import Profile_image from "../../img/d-right.png";
import { useParams } from "react-router-dom";
import { API_KEY } from "../config";
import axios from "axios";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { AuthContext } from "../context/MyStore";
import { get } from "../Api/api";


function ProjectAboutDetails() {
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
      
    })
    .catch(err=>{
      console.log(err)
      setLoad(true)
    })
  },[auth.token])
  return (
              data.map((record,index)=>(
                <div className="profiles-data-profile-right-section" key={index}>
                 <div className="d-flex justify-content-between">
                    <h2>{record.name}</h2>
                    <p className="text-orange">{record.project_unique_id}</p>
                 </div>
                <hr className="m-0" />
                <p>
                  <strong>Bio:-</strong> Cumsan at ultricies a, laoreet eu
                  tellus. Etiam porttitor, sem non feugiat pharetra, libero
                  risus dictum lacus, eget sollicitudin est enim id libero.
                  Nullam eget dolor accumsan, semper odio quis, iaculis leo.
                  Vivamus vitae congue est. Pellentesque habitant morbi
                  tristique senectus et netus et malesuada fames ac turpis
                  egestas. Nam diam mi, congue vel suscipit a, convallis
                  vitae metus. Duis condimentum lacus ve
                </p>
                <div className="row">
                  <div className="col-lg-4 col-md-6 col-sm-12 profiles-data-right-col-4 d-flex justify-content-between">
                    <h4>
                      <span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="17"
                          viewBox="0 0 16 17"
                          fill="none"
                        >
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M7.73547 0.570228C7.81603 0.524206 7.90722 0.5 8 0.5C8.09279 0.5 8.18397 0.524206 8.26453 0.570228L15.7312 4.83689C15.8128 4.88352 15.8807 4.9509 15.9279 5.03219C15.9751 5.11349 16 5.20582 16 5.29983V6.06783C16 8.42086 15.2335 10.7099 13.8164 12.5883C12.3992 14.4668 10.4087 15.8324 8.14613 16.4785C8.05061 16.5057 7.94939 16.5057 7.85387 16.4785C5.59145 15.8321 3.60114 14.4664 2.18408 12.588C0.767015 10.7096 0.000320368 8.42078 0 6.06783L0 5.29983C3.03222e-05 5.20582 0.024908 5.11349 0.0721125 5.03219C0.119317 4.9509 0.187171 4.88352 0.2688 4.83689L7.73547 0.570228ZM7.54347 11.9249L12.1493 6.16596L11.3173 5.50036L7.38987 10.4081L4.608 8.09023L3.92533 8.90943L7.54347 11.9249Z"
                            fill="#FB6A18"
                          />
                        </svg>
                      </span>
                      Property{" "}
                    </h4>
                    <h5>{record.property_id_name}</h5>
                  </div>
                  <div className="col-lg-4 col-md-6 col-sm-12 profiles-data-right-col-4 d-flex justify-content-between">
                    <h4>
                      <span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="17"
                          viewBox="0 0 16 17"
                          fill="none"
                        >
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M7.73547 0.570228C7.81603 0.524206 7.90722 0.5 8 0.5C8.09279 0.5 8.18397 0.524206 8.26453 0.570228L15.7312 4.83689C15.8128 4.88352 15.8807 4.9509 15.9279 5.03219C15.9751 5.11349 16 5.20582 16 5.29983V6.06783C16 8.42086 15.2335 10.7099 13.8164 12.5883C12.3992 14.4668 10.4087 15.8324 8.14613 16.4785C8.05061 16.5057 7.94939 16.5057 7.85387 16.4785C5.59145 15.8321 3.60114 14.4664 2.18408 12.588C0.767015 10.7096 0.000320368 8.42078 0 6.06783L0 5.29983C3.03222e-05 5.20582 0.024908 5.11349 0.0721125 5.03219C0.119317 4.9509 0.187171 4.88352 0.2688 4.83689L7.73547 0.570228ZM7.54347 11.9249L12.1493 6.16596L11.3173 5.50036L7.38987 10.4081L4.608 8.09023L3.92533 8.90943L7.54347 11.9249Z"
                            fill="#FB6A18"
                          />
                        </svg>
                      </span>
                       Type{" "}
                    </h4>
                    <h5>{record.property_type_id_name}</h5>
                  </div>
                  <div className="col-lg-4 col-md-6 col-sm-12 profiles-data-right-col-4 d-flex justify-content-between">
                    <h4>
                      <span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="17"
                          viewBox="0 0 16 17"
                          fill="none"
                        >
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M7.73547 0.570228C7.81603 0.524206 7.90722 0.5 8 0.5C8.09279 0.5 8.18397 0.524206 8.26453 0.570228L15.7312 4.83689C15.8128 4.88352 15.8807 4.9509 15.9279 5.03219C15.9751 5.11349 16 5.20582 16 5.29983V6.06783C16 8.42086 15.2335 10.7099 13.8164 12.5883C12.3992 14.4668 10.4087 15.8324 8.14613 16.4785C8.05061 16.5057 7.94939 16.5057 7.85387 16.4785C5.59145 15.8321 3.60114 14.4664 2.18408 12.588C0.767015 10.7096 0.000320368 8.42078 0 6.06783L0 5.29983C3.03222e-05 5.20582 0.024908 5.11349 0.0721125 5.03219C0.119317 4.9509 0.187171 4.88352 0.2688 4.83689L7.73547 0.570228ZM7.54347 11.9249L12.1493 6.16596L11.3173 5.50036L7.38987 10.4081L4.608 8.09023L3.92533 8.90943L7.54347 11.9249Z"
                            fill="#FB6A18"
                          />
                        </svg>
                      </span>
                       Status{" "}
                    </h4>
                    <h5>{record.property_status_id_name}</h5>
                  </div>
                  <div className="col-lg-4 col-md-6 col-sm-12 px-sm-3  profiles-data-right-col-4 d-flex justify-content-between">
                     <div>
                     <h4>
                     <span>
                       <svg
                         xmlns="http://www.w3.org/2000/svg"
                         width="16"
                         height="17"
                         viewBox="0 0 16 17"
                         fill="none"
                       >
                         <path
                           fill-rule="evenodd"
                           clip-rule="evenodd"
                           d="M7.73547 0.570228C7.81603 0.524206 7.90722 0.5 8 0.5C8.09279 0.5 8.18397 0.524206 8.26453 0.570228L15.7312 4.83689C15.8128 4.88352 15.8807 4.9509 15.9279 5.03219C15.9751 5.11349 16 5.20582 16 5.29983V6.06783C16 8.42086 15.2335 10.7099 13.8164 12.5883C12.3992 14.4668 10.4087 15.8324 8.14613 16.4785C8.05061 16.5057 7.94939 16.5057 7.85387 16.4785C5.59145 15.8321 3.60114 14.4664 2.18408 12.588C0.767015 10.7096 0.000320368 8.42078 0 6.06783L0 5.29983C3.03222e-05 5.20582 0.024908 5.11349 0.0721125 5.03219C0.119317 4.9509 0.187171 4.88352 0.2688 4.83689L7.73547 0.570228ZM7.54347 11.9249L12.1493 6.16596L11.3173 5.50036L7.38987 10.4081L4.608 8.09023L3.92533 8.90943L7.54347 11.9249Z"
                           fill="#FB6A18"
                         />
                       </svg>
                     </span>
                     Location{" "}
                   </h4>
                     </div>
                    <h5>{record.location_name}</h5>
                  </div>
                </div>
              </div>
              ))
  )
}

export default ProjectAboutDetails
