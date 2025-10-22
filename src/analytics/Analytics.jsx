import React, { useContext, useEffect, useState } from 'react';
import Layout from '../Layout/Layout';
import LeftNavbar from '../Layout/LeftNavbar';
import '../analytics/Analytics.css';
import Chart from 'chart.js/auto';
import axios from 'axios';
import { AuthContext } from '../context/MyStore';
import { API_KEY } from '../config';
import dashboard_image from '../../img/dashboard_image.png';
import AnalyticsPieChart from './AnalyticsPieChart';
import AppointmentChart from './AppointmentChart';
import { useLocation } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Container, Tabs, Tab } from '@mui/material';
import GrowthChart from './GrowthChart';
import TicketProgressChart from './TicketProgressChart';

function Analytics() {
    const location = useLocation()
    const [mockData, setMockData] = useState([
        { id: 1, labels: ["label", "label2", 4,3,1,5,9,4], values: [7, 8, 9,4,9,3,8,2] },
    ]);
    const [visibleCharts, setVisibleCharts] = useState([]);
    const { auth } = useContext(AuthContext);
    const [selectedTab, setSelectedTab] = useState(0);

    const handleTabChange = (event, newValue) => {
      setSelectedTab(newValue);
    };
    // useEffect(() => {
    //     fetchData();
    // }, []);
    const data = [
        { project_name: 'Page A', property_name: 'Page a', project: 4000, property: 2400 },
        { project_name: 'Page B', property_name: 'Page B', project: 1000, property: 1398 },
        { project_name: 'Page C', property_name: 'Page C', project: 2000, property: 9800 },
        { project_name: 'Page D', property_name: 'Page D', project: 2780, property: 3908 },
        { project_name: 'Page E', property_name: 'Page E', project: 1890, property: 4800 },
        { project_name: 'Page F', property_name: 'Page F', project: 2390, property: 3800 },
        { project_name: 'Page G', property_name: 'Page z', project: 3490, property: 4300 },
      ];
    // const fetchData = async () => {
    //     try {
    //         const response = await axios.get('/api/view-property-analytics', {
    //             baseURL: API_KEY,
    //             headers: { 'api-token': '4SITA1K6mFT5bc9xSaR1TYchQTKPkc7m7CJvsfqP2Sx1R4O88uZ8TGoq5zoF' }
    //         });
    
    //         // Assuming response.data is the object you provided
    //         const data = [{
    //             id: response.data.id,
    //             labels: response.data.labels,
    //             values: response.data.values,
    //             visible: true // Or whatever logic you want for visibility
    //         }];
    
    //         // setMockData(data);
    //         // setVisibleCharts(data);
    //     } catch (error) {
    //         console.error('Error fetching data:', error);
    //     }
    //     setVisibleCharts(mockData.map(data => ({ ...data, visible: true })));

    // };
    

    return (
        <Layout>
            <div className="wrape-2-nav-common-wp analytics-listing-search-wraper">
                <div className="container">
                    <div className="row">
                        <LeftNavbar />
                        <div className='col-10 flex-grow-1'>
                            <div className='right-analytics-section'>
                               <div className='row'>
                               <div className='col-8'>
                               <div className='property-project-chart'>
                               
                               
                               <Container>
      <Tabs value={selectedTab} onChange={handleTabChange} centered>
        <Tab label="Project " />
        <Tab label="Property " />
        
      </Tabs>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={selectedTab === 1 ? "property_name" : "project_name"} />
          <YAxis />
          <Tooltip />
          <Legend />
          {selectedTab === 0 && <Line type="monotone" dataKey="project" stroke="#8884d8" activeDot={{ r: 8 }} />}
          {selectedTab === 1 && <Line type="monotone" dataKey="property" stroke="#82ca9d" />}
          {selectedTab === 2 && (
            <>
              <Line type="monotone" dataKey="project" stroke="#8884d8" activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="property" stroke="#82ca9d" />
            </>
          )}
        </LineChart>
      </ResponsiveContainer>
    </Container>
                               </div>
                           </div>
                           <div className='col-4 chart-container'>
                               <div className='chart-container-inner-content'><AnalyticsPieChart/></div>
                           </div>
                               </div>
                               <div className='row'>
                               <div className="col-lg-8 col-md-8 mt-5">
                               <div className="growth-chart-analytics">
                                 <h3>Growth Chart</h3>
                                 <Container>
                                   <GrowthChart />
                                 </Container>
                               </div>
                             </div>
                             <div className="col-lg-4 mt-5">
                  <div className="ticket-progress-analytics-chart">
                  <h3>Tickets</h3>
                    <div className="d-flex align-center">
                      <TicketProgressChart />
                    </div>
                    <div className="total-counter-total-active-ticket-progress">
                      <p>
                        <strong>Total</strong>:475
                      </p>

                      <div className="d-flex justify-content-between">
                        <div className="total-active-ticket-progress-analytics_1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="11"
                            height="11"
                            viewBox="0 0 11 11"
                            fill="none"
                          >
                            <path
                              d="M1.375 9.625V7.33333H1.83333V9.16667H3.66667V9.625H1.375ZM1.375 3.66667V1.375H3.66667V1.83333H1.83333V3.66667H1.375ZM4.95367 8.41592C4.35081 8.30286 3.83335 8.03046 3.40129 7.59871C2.96954 7.16665 2.69714 6.64919 2.58408 6.04633H3.04242C3.146 6.52636 3.37043 6.93901 3.71571 7.28429C4.06099 7.62957 4.47349 7.854 4.95321 7.95758L4.95367 8.41592ZM2.58408 4.95367C2.69714 4.35081 2.96954 3.83289 3.40129 3.39992C3.83335 2.96725 4.35081 2.69531 4.95367 2.58408V3.04242C4.47364 3.146 4.06099 3.37043 3.71571 3.71571C3.37043 4.06099 3.146 4.47349 3.04242 4.95321L2.58408 4.95367ZM5.5 6.1875C5.30658 6.1875 5.14372 6.12119 5.01142 5.98858C4.87881 5.85628 4.8125 5.69342 4.8125 5.5C4.8125 5.30506 4.87881 5.14158 5.01142 5.00958C5.14372 4.87819 5.30658 4.8125 5.5 4.8125C5.69494 4.8125 5.85842 4.87819 5.99042 5.00958C6.12181 5.14158 6.1875 5.30506 6.1875 5.5C6.1875 5.69342 6.12181 5.85628 5.99042 5.98858C5.85842 6.12119 5.69494 6.1875 5.5 6.1875ZM6.04633 8.41592V7.95758C6.52636 7.854 6.93901 7.62957 7.28429 7.28429C7.62957 6.93901 7.854 6.52651 7.95758 6.04679H8.41592C8.30469 6.64935 8.03275 7.16665 7.60008 7.59871C7.16711 8.03046 6.64919 8.30286 6.04633 8.41592ZM7.95758 4.95367C7.854 4.47364 7.62957 4.06099 7.28429 3.71571C6.93901 3.37043 6.52651 3.146 6.04679 3.04242V2.58408C6.64935 2.69714 7.16711 2.96954 7.60008 3.40129C8.03275 3.83335 8.30469 4.35081 8.41592 4.95367H7.95758ZM7.33333 9.625V9.16667H9.16667V7.33333H9.625V9.625H7.33333ZM9.16667 3.66667V1.83333H7.33333V1.375H9.625V3.66667H9.16667Z"
                              fill="white"
                            />
                          </svg>
                        </div>
                        <h3>258 </h3>
                        <p>
                          <span>Active</span>
                        </p>
                      </div>
                      <div className="d-flex justify-content-between">
                        <div className="total-active-ticket-progress-analytics_2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="11"
                            height="11"
                            viewBox="0 0 11 11"
                            fill="none"
                          >
                            <g clip-path="url(#clip0_664_16970)">
                              <path
                                d="M5.50008 0.917969C2.97925 0.917969 0.916748 2.98047 0.916748 5.5013C0.916748 8.02214 2.97925 10.0846 5.50008 10.0846C8.02092 10.0846 10.0834 8.02214 10.0834 5.5013C10.0834 2.98047 8.02092 0.917969 5.50008 0.917969ZM4.58341 7.79297L2.29175 5.5013L2.938 4.85505L4.58341 6.49589L8.06216 3.01714L8.70842 3.66797L4.58341 7.79297Z"
                                fill="white"
                              />
                            </g>
                            <defs>
                              <clipPath id="clip0_664_16970">
                                <rect width="11" height="11" fill="white" />
                              </clipPath>
                            </defs>
                          </svg>
                        </div>
                        <h3>258 </h3>
                        <p>
                          <span>Closed</span>
                        </p>
                      </div>
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

export default Analytics;
