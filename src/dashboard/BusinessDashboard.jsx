import React, { useState, useEffect, useContext, Fragment } from "react";
import Layout from "../Layout/Layout";
import "../dashboard/BusinessDashboard.css";
import dashboard_image from '../../img/dashboard_image.png';
import person_img from '../../img/d-right.png';
import ProgressBar from "./ProgressBar";
import LeftNavbar from "../Layout/LeftNavbar";
import Chart from 'chart.js/auto';
import { AuthContext } from "../context/MyStore";
import axios from "axios";
import { API_KEY } from "../config";
import { get } from "../Api/api";

function BusinessDashboard() {
   const[data , setData] = useState([])
    const{auth} = useContext(AuthContext)
    const[load , setLoad] = useState(true)  

    useEffect(() => {
      let fetchData = async () => {
        // const instance = axios.create({
        //   baseURL: `${API_KEY}`,
        //   headers: { "api-token": auth.token },
        // });
        await get(`${API_KEY}/api/get-all-website-project-listing`)
          .then((response) => {
            console.log(response)
            setData(response.data)
            setLoad(true)
          })
          .catch((err) => {
            console.log(err);
          });
      };
      fetchData();
    }, [auth.token]);
  

  return (
    <Layout>
    <div className="wrape-2-nav-common-wp">
      <div className="container">
        <div className="row">
          <LeftNavbar />
          <div className="col-10 right-flex-grow business-dashboard-right-section">
            <div className="row">
              <div className="col-lg-8 col-md-8 col-sm-12 col-12">
                {data.map((record ,index) => (
                  <div key={index} className="business-dashboard-wrape-2">
                    <div className="business-dashboard-content-wrape">
                      <div className="row">
                        <div className="col-lg-9 col-md-12">
                          <div className="row">
                            <div className="col-lg-6 col-md-6 col-sm-6 col-12  py-3">
                            {
                              record.custom_field_values.map((data, i) => 
                                data.field_name === 'project_featured_img' ? (
                                  <img 
                                    key={i} 
                                    src={data.field_value.join('')} 
                                    className="img-fluid w-100 left-img" 
                                    alt="Dashboard" 
                                  />
                                ) : null
                              )
                            }
                            

                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-6 col-12   dashboard-left-col py-3 d-flex align-center ">
                              <div>
                                  <h2>{record.project_unique_id}</h2>
                                  <h3>Ganesh Property pvt ltd.Ernakulam, Kerala </h3>
                                  <p><span>₹ 3 Crore</span></p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-3 col-sm-2 col-5 col-md-3 view-business-dashboard-row-col col-sm-6  py-3 ">
                          <div className="row h-100 py-3 view-business-dashboard-row d-flex align-center">
                            <div className="col-12 view-business-dashboard " style={{ position: 'relative' }}>
                              {
                                // <ProgressBar percentage='50' />
                              }
                              <h3 className="text-center">Total Views</h3>
                              <p className="text-center">{record.total_view}</p>
                            </div>
                           {
                          //   <div className="col-7 dashboard-right-content">
                          //   <div className="d-flex"> <h2>741 </h2><p>Impression</p></div>
                          //   <div className="d-flex"> <h2>741 </h2><p>Impression</p></div>
                          //   <div className="d-flex"> <h2>741 </h2><p>Impression</p></div>
                          // </div>
                           }
                          </div>
                        </div>
                       {
                      //   <div className="col-lg-3 col-md-6 col-sm-6 col-5 business-dashboard-insight-view-btn">
                      //   <div>
                      //     <button >
                      //       <span>insight</span>
                      //     </button>
                      //   </div>
                      // </div>
                       }
                      </div>
                      <hr className="m-0 mb-3 mb-none" />
                      <div className="row business-created-wraper">
                        <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                          <p>Created: 24Jan,2024  &nbsp;  &nbsp; &nbsp;  12:24am</p>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                          <p>Created: 24Jan,2024  &nbsp; &nbsp; &nbsp;   12:24am</p>
                        </div>
                      </div>
                      {
                    //     <div className={`business-dashboard-graph ${chart.visible ? 'd-block' : 'd-none'}`}>
                    //   <canvas id={`myChart${chart.id}`} width="400" style={{ height: '200px', maxHeight: '200px' }}></canvas>
                    // </div>
                      }
                    
                    </div>
                  </div>
                ))}
              </div>
              <div className="col-4 mb-col-none">
              <div className="business-activity-wraper">
              <div className="business-activity-heading-wraper"><h1>Ongoing Project </h1></div>
              <div className="row business-activity-rw">
               <div className="col-4 business-activity-col-2 ">
                 <picture>
                   <img src={person_img} className="img-fluid"/>
                 </picture>
               </div>
               <div className="col-8 business-activity-col">
                 <h3 className="business-activity-h3-wraper">David</h3>
                 <h4 className="business-activity-h4-wraper">Ganesh Property / Flat</h4>
                 <button className="business-activity-btn1"><span>View Leads</span></button>
                 <button className="business-activity-btn2"><span>Upgrade </span></button>
               </div>
              </div>
              <div className="row business-activity-rw">
               <div className="col-4 business-activity-col-2 ">
                 <picture>
                   <img src={person_img} className="img-fluid"/>
                 </picture>
               </div>
               <div className="col-8 business-activity-col">
                 <h3 className="business-activity-h3-wraper">David</h3>
                 <h4 className="business-activity-h4-wraper">Ganesh Property / Flat</h4>
                 <button className="business-activity-btn1"><span>View Leads</span></button>
                 <button className="business-activity-btn2"><span>Upgrade </span></button>
               </div>
              </div>
              <div className="row business-activity-rw">
              <div className="col-4 business-activity-col-2 ">
                <picture>
                  <img src={person_img} className="img-fluid"/>
                </picture>
              </div>
              <div className="col-8 business-activity-col">
                <h3 className="business-activity-h3-wraper">David</h3>
                <h4 className="business-activity-h4-wraper">Ganesh Property / Flat</h4>
                <button className="business-activity-btn1"><span>View Leads</span></button>
                <button className="business-activity-btn2"><span>Upgrade </span></button>
              </div>
             </div>
            </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
  );
}

export default BusinessDashboard;
