import React, { useState, useEffect, useContext } from "react";
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
  const [visibleCharts, setVisibleCharts] = useState([]);
    const[mockData , setMockData] = useState( [
      // { id: 1, labels: ["label", "label2", 4,3,1,5,9,4], values: [7, 8, 9,4,9,3,8,2] },
      // { id: 2, labels: [2 , 3 , 2], values: [1, 2, 1] },
      
    ])
    const{auth} = useContext(AuthContext)
    console.log(mockData)
  
    useEffect(() => {
      fetchData();
    }, []);
  
    const fetchData = async () => {
      try {
        // Mock data for demonstration
        const response = await get('/api/view-property-analytics', {
          baseURL: API_KEY,
          headers: { 'api-token': auth.token }
        });
        const mockdata = [response.data]
        console.log(mockdata)
       setMockData(mockdata)
        setVisibleCharts(mockdata.map(data => ({ ...data, visible: false })));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    const toggleVisibility = (id) => {
      setVisibleCharts(prevState =>
        prevState.map(chart => chart.id === id ? { ...chart, visible: !chart.visible } : chart)
      );
    };
  
    useEffect(() => {
      visibleCharts.forEach(chart => {
        if (chart.visible) {
          const ctx = document.getElementById(`myChart${chart.id}`);
          if (ctx) {
            // Destroy the existing chart if it exists
            const existingChart = Chart.getChart(ctx);
            if (existingChart) {
              existingChart.destroy();
            }
            // Create new chart with updated data
            new Chart(ctx, {
              type: "line",
              data: {
                labels: chart.labels, // Dynamic labels
                datasets: [{
                  label: 'Example Dataset',
                  data: chart.values, // Dynamic data
                  backgroundColor: 'rgba(0, 0, 255, 0.5)',
                  borderColor: 'rgba(0, 0, 255, 1)',
                  borderWidth: 1
                }]
              },
              options: {
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
              }
            });
          }
        }
      });
    }, [visibleCharts]);
  
  

  return (
    <Layout>
    <div className="wrape-2-nav-common-wp">
      <div className="container">
        <div className="row">
          <LeftNavbar />
          <div className="col-10 right-flex-grow business-dashboard-right-section">
            <div className="row">
              <div className="col-lg-8 col-md-8 col-sm-12 col-12">
                {visibleCharts.map(chart => (
                  <div key={chart.id} className="business-dashboard-wrape-2">
                    <div className="business-dashboard-content-wrape">
                      <div className="row">
                        <div className="col-lg-6 col-md-12">
                          <div className="row">
                            <div className="col-6 py-3">
                              <img src={dashboard_image} className="img-fluid w-100 left-img" alt="Dashboard" />
                            </div>
                            <div className="col-6 dashboard-left-col py-3 ">
                              <h2>#47852569</h2>
                              <h3>Ganesh Property pvt ltd.<br />Ernakulam, Kerala </h3>
                              <p><span>₹ 3 Crore</span></p>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-6 col-sm-6 col-7 py-3 ">
                          <div className="row h-100 py-3">
                            <div className="col-5 " style={{ position: 'relative' }}>
                              <ProgressBar percentage='50' />
                            </div>
                            <div className="col-7 dashboard-right-content">
                              <div className="d-flex"> <h2>741 </h2><p>Impression</p></div>
                              <div className="d-flex"> <h2>741 </h2><p>Impression</p></div>
                              <div className="d-flex"> <h2>741 </h2><p>Impression</p></div>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-6 col-sm-6 col-5 business-dashboard-insight-view-btn">
                          <div>
                            <button onClick={() => toggleVisibility(chart.id)}>
                              <span>{chart.visible ? "Close Insight" : "Insight View"}</span>
                            </button>
                          </div>
                        </div>
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
                      <div className={`business-dashboard-graph ${chart.visible ? 'd-block' : 'd-none'}`}>
                      <canvas id={`myChart${chart.id}`} width="400" style={{ height: '200px', maxHeight: '200px' }}></canvas>
                    </div>
                    
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
