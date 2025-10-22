import React, { useContext, useEffect, useState } from 'react';
import Layout from '../Layout/Layout';
import LeftNavbar from '../Layout/LeftNavbar';
import '../manage-project-view-details/ViewDetails.css';
import logo from '../../img/dashboard_image.png';
import Slider from "react-slick";
// import { Carousel } from 'react-bootstrap';
import axios from 'axios';
import { API_KEY } from '../config';
import { AuthContext } from '../context/MyStore';
import { useParams } from 'react-router-dom';
import { Fragment } from 'react';
import star from '../../img/view.png'
import { Link } from 'react-router-dom';
import '../manage-project-view-details/SliderCard.css'
import { get, post } from '../Api/api';

function ManageProjectViewDetail() {
  const { auth } = useContext(AuthContext);
  const[data , setData] = useState([])
  const [properties , setProperty] = useState([])
  const{id} = useParams()
 console.log(data)
  useEffect(()=>{
    // const instance = axios.create({
    //   baseURL: API_KEY,
    //   headers: { "api-token": auth.token },
    // });
    get('/api/get-data-website-project/' + id)
    .then(response=>{
      // console.log(response.data)
      setData(response.data)
    })
    .catch(err=>{
      console.log(err)
    })
  },[auth.token])
  useEffect(()=>{
    // const instance = axios.create({
    //   baseURL: API_KEY,
    //   headers: { "api-token": auth.token },
    // });
    post('/api/property-details-by-projectId' , {project_id:id} )
    .then(response=>{
      // console.log(response.data)
      setProperty(response.data)
    })
    .catch(err=>{
      console.log(err)
    })
  },[auth.token])

  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const images = [
    "https://via.placeholder.com/600x400?text=Image+1",
    "https://via.placeholder.com/600x400?text=Image+2",
    "https://via.placeholder.com/600x400?text=Image+3",
    "https://via.placeholder.com/600x400?text=Image+4",
    "https://via.placeholder.com/600x400?text=Image+5",
    "https://via.placeholder.com/600x400?text=Image+6"
  ];

  return (
    <Layout>
      <div className="my-b-profile-wrape-2 mt-110">
        <div className="container">
          <div className="row my-profile-wrape-2-row">
            <div className="col-2 my-profile-wrape-2-col-2 header-col-2">
              <LeftNavbar />
            </div>
            <div className="col-10 my-project-view-detail-wrape-2-col-10 right-flex-grow">
              <div className="my-project-view-detail-wrape-2-cnt">
                {
                  data.map((record,index)=>(
                    <div className="row" key={index}>
                  <div className="col-4">
                    <div className="my-project-view-detail-sale-counter">
                      <div className="text-center">
                        <h1>RERA No</h1>
                        
                        {
                          record?.custom_field_values.map((data,ind)=>(
                            data.field_name==="project_rera_no" && (
                              <p className="m-0">{data.field_value}</p>
                            )
                          ))
                        }
                      </div>
                    </div>
                    <div className="my-project-view-detail-profile">
                      <div className="my-project-view-detail-profile-img">
                        {
                          record?.custom_field_values.map((data,ind)=>(
                            data.field_name==="project_brand_logo" && (
                              <picture key={ind}>
                                <img src={API_KEY + "/uploads/media/" + data.field_value.join('')} className="w-100 h-100"  alt="Profile" />
                              </picture>
                            )
                          ))
                        }
                      </div>
                      <h2> <strong>Properties For : </strong>{record.property_id_name}</h2>
                      <p className="text-capatilize"> <strong>Properties Type : </strong>{record.
                        property_type_id_name}</p>
                     
                      <div>
                        <p className="my-project-view-detail-contect-wraper">+65556565655</p>
                      </div>
                    </div>
                    <div className='my-project-view-detail-property-location'>
                      <h3>Property Location</h3>
                    <div className='my-project-view-detail-property-map'>
                    <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d109066.25905193972!2d75.49101739615622!3d31.322518086143994!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391a5a5747a9eb91%3A0xc74b34c05aa5b4b8!2sJalandhar%2C%20Punjab!5e0!3m2!1sen!2sin!4v1716400018797!5m2!1sen!2sin"
                    width="600"
                    height="450"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                    </div>

                    </div>
                  </div>
                  <div className="col-8  ">
                    <div className='w-100 my-project-view-detail-bstp-slider bg-white p-4'>
                 {
                //   <Carousel className="w-100 " >
                //   {images.map((img, index) => (
                //     <Carousel.Item key={index}>
                //       <img
                //         className="d-block w-100"
                //         src={img}
                //         alt={`Slide ${index + 1}`}
                //       />
                //     </Carousel.Item>
                //   ))}
                // </Carousel>
                 }
                
                <div className='carousel-inner'>
                  
                {
                  record?.custom_field_values.map((data,ind)=>(
                    data.field_name==="project_bg_banner" && (
                      <picture className='w-100 h-100' key={ind}>
                        <img src={API_KEY + "/uploads/media/" + data.field_value.join('')} className='w-100 h-100'/>
                      </picture>
                    )
                  ))
                }
                </div>
                   
                    <button className='my-project-view-detail-type-btn'>{record.
                      property_status_id_name
                      }</button>
                   <div className='my-project-view-detail-type-cnt'>
                    <div>
                   
                    {
                      record?.custom_field_values.map((data,ind)=>(
                        data.field_name==="project_name" && (
                          
                            <h2 key={ind}>{data.field_value}</h2>
                        
                        )
                      ))
                    }
                    <p> 45 Connor St. London, 44523</p>
                    </div>
                    <div>
                    <p>Price </p>
                    {
                      record?.custom_field_values.map((data,ind)=>(
                        data.field_name==="projcect_onboard_price" && (
                            <p key={ind}><strong>{data.field_value}</strong></p>
                        )
                      ))
                    }
                    </div>
                   </div>
                    <div className='manage-view-detail-description'>
                    <h3>Description</h3>
                
                    {
                      record?.custom_field_values.map((data,ind)=>(
                        data.field_name==="project_about" && (
                          <p>{data.field_value}</p>
                        )
                      ))
                    }
                    </div>
                    </div>
                    <div className='my-project-view-detail-property-feature-wraper'>
                      <h3 >Amenities</h3>
                      <div className='row'>
                        
                        {
                          record?.custom_field_values.map((data,ind)=>(
                            data.field_name==="project_amenities" && (
                              
                                data.field_value.map((rec,i)=>(
                                  <div className='col-3 property-feature-grid-content' key={i}>
                                    <p>{rec}</p>
                                  </div>
                                ))
                              
                            )
                          ))
                        }
                       
                      </div>
                    </div>
                  </div>
                
                </div>
                  ))
                }
              </div>
              <div className="my-project-view-detail-property-card">
               
                <div clasName="row">
                {properties?.map((property, index) => (
                  <div key={index} className="coverflow-item col-3 ">
                    <div className="card-wraper">
                      <div className="main-img-wraper">
                        {property.custom_field_values.map((record, i) => (
                          <Fragment key={i}>
                            {record.field_name === "listing_featured_img" && (
                              <img
                                src={ 
                                  API_KEY+"/uploads/media/"+ record.field_value.join("")}
                                className="img-fluid"
                                alt={`Slide ${index + 1}`}
                              />
                            )}
                          </Fragment>
                        ))}
                      </div>
                      <div className="card-content-wraper d-flex justify-content-between">
                        <div className="w-100">
                          <div className="d-flex justify-content-between ">
                            {property.custom_field_values.map((record, i) => (
                              <Fragment key={i}>
                                {record.field_name === "property_list_property_price" && (
                                  <strong className="price-wraper d-flex align-center">
                                    {" "}
                                    {record.field_value} 
                                  </strong>
                                )}
                              </Fragment>
                            ))}
                            <div className="rating-wraper d-flex align-center">
                              <p>4.5</p>
                              <span className="ms-1">
                                {" "}
                              {
                                // <img src={star} />{" "}
                              }
                              </span>
                            </div>
                          </div>
                          <hr className="m-0 gray-border" />
                          <p className="d-flex mt-1">
                            {property.custom_field_values.map((record, i) => (
                              <Fragment key={i}>
                                {record.field_name ==="property_list_flat" && (
                                   
                                    record.field_value.join('')
                                 
                                )}
                              </Fragment>
                            ))}
                            
                            <span className="span-divider"></span>
                             {property.custom_field_values.map((record, i) => (
                              <Fragment key={i}>
                                {record.field_name ==="listing_propety_area" && (
                                   
                                    record.field_value
                                )}
                              </Fragment>
                            ))}
                          </p>
                          <hr className="m-0 gray-border" />
                         <div className="d-flex justify-content-between align-center">
                         {property.custom_field_values.map((record, i) => (
                          <Fragment key={i}>
                            {record.field_name === "listing_property_address" && (
                              <p className="mt-1">
                                {record.field_value}&nbsp;&nbsp;&nbsp;&nbsp;
                              </p>
                            )}
                        
                           
                          </Fragment>
                        ))}
                        <span className="gs-property-wraper d-flex align-center order-1">
                            {property.project_id_name}
                          </span>
                         </div>
                          
                          
                          
                          
                          <hr className="m-0 gray-border" />
                          <p className="mt-1">
                            Available for{" "}
                           
                            {property.custom_field_values.map((record, i) => (
                              <Fragment key={i}>
                                {record.field_name === "listing_available_from" && (
                                  
                                    <strong className="price-str-wraper">{record.field_value}</strong>
                               
                                )}
                              </Fragment>
                            ))}
                          </p>
                          <hr className="m-0 gray-border" />
                          <p className="mt-1">
                            Carpet Area{" "}
                           
                            {property.custom_field_values.map((record, i) => (
                              <Fragment key={i}>
                                {record.field_name === "listing_carpet_area" && (
                                  
                                    <strong className="price-str-wraper">{record.field_value}</strong>
                               
                                )}
                              </Fragment>
                            ))}
                          </p>
                        </div>
                        <div className="details-wraper">
                          <button >
                            <Link to={"/property-detail/"+property.id} ><span>More Details</span></Link>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default ManageProjectViewDetail;
