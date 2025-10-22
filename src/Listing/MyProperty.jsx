import React from 'react'
import Layout from '../Layout/Layout'
import '../Listing/MyProperty.css'
import slider_img from '../../img/app-slider.png'
import LeftNavbar from '../Layout/LeftNavbar'

function MyProperty() {
  return (
    <Layout>
      
      <div className="my-b-property-wrape-2 mt-20 ">
        <div className="container">
          <div className="row my-account-wrape-2-row">
            <div className="col-2 my-account-wrape-2-col-2 header-col-2">
                <LeftNavbar/>
            </div>
            <div className="col-10 my-account-wrape-2-col-10 right-flex-grow">
              
              <div className="row g-5 mt-1">
                <div className="col-6 mt-20">
                  <div
                    className="row my-account-rt-col-wp-2"
                    style={{ backgroundColor: "white" }}
                  >
                    <div className="col-5 p-0 pe-2" style={{position:'relative'}}>
                      <picture>
                        <img src={slider_img} className="img-fluid h-100" />
                      </picture>
                      <button className="my-account-status-btn-wp"><span>Verified</span></button>
                    </div>
                    <div className="col-7 my-acc-wp-2-slider">
                      <div>
                        <p className="text-right">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="17"
                            height="19"
                            viewBox="0 0 17 19"
                            fill="none"
                          >
                            <path
                              d="M9 1.5C9 1.36739 8.94732 1.24021 8.85355 1.14645C8.75979 1.05268 8.63261 1 8.5 1C8.36739 1 8.24021 1.05268 8.14645 1.14645C8.05268 1.24021 8 1.36739 8 1.5V3.03C5.75 3.28 4 5.18 4 7.5V13.41L2.41 15H14.59L13 13.41V7.5C13 5.18 11.25 3.28 9 3.03V1.5ZM8.5 0C8.89782 0 9.27936 0.158035 9.56066 0.43934C9.84196 0.720644 10 1.10218 10 1.5V2.21C12.31 2.86 14 5 14 7.5V13L17 16H0L3 13V7.5C3 5 4.69 2.86 7 2.21V1.5C7 1.10218 7.15804 0.720644 7.43934 0.43934C7.72064 0.158035 8.10218 0 8.5 0ZM8.5 19C7.92367 19.0001 7.36501 18.8011 6.91855 18.4367C6.47209 18.0722 6.16527 17.5647 6.05 17H7.09C7.19284 17.2918 7.3837 17.5445 7.63625 17.7233C7.88879 17.9021 8.19059 17.9981 8.5 17.9981C8.80941 17.9981 9.11121 17.9021 9.36375 17.7233C9.6163 17.5445 9.80716 17.2918 9.91 17H10.95C10.8347 17.5647 10.5279 18.0722 10.0815 18.4367C9.63499 18.8011 9.07633 19.0001 8.5 19Z"
                              fill="black"
                            />
                          </svg>
                        </p>
                        <h2>₹ 3 Crore</h2>
                        <hr />
                        <p>3BHK Builder Floor 1700sqft.</p>
                        <hr />
                        <p>
                          Ernakulam, Kerala <span>Ganesh Property</span>
                        </p>
                        <hr />
                        <p>Available for Family</p>
                        <hr />
                        <p>Carpet Area 1720 sqft </p>
                      </div>
                      <ul className="m-0 myy-account-manager-wp">
                        <li className="my-account-view-link-wp-2">
                          <a>View Insight</a>
                        </li>
                        <li className="my-account-manage-wp-2">
                          <a>Manage Property</a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="col-6 mt-20">
                  <div
                    className="row my-account-rt-col-wp-2"
                    style={{ backgroundColor: "white" }}
                  >
                    <div className="col-5 p-0 pe-2" style={{position:'relative'}}>
                      <picture>
                        <img src={slider_img} className="img-fluid h-100" />
                      </picture>
                      <button className="my-account-status-btn-wp"><span>Verified</span></button>
                    </div>
                    <div className="col-7 my-acc-wp-2-slider">
                      <div>
                        <p className="text-right">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="17"
                            height="19"
                            viewBox="0 0 17 19"
                            fill="none"
                          >
                            <path
                              d="M9 1.5C9 1.36739 8.94732 1.24021 8.85355 1.14645C8.75979 1.05268 8.63261 1 8.5 1C8.36739 1 8.24021 1.05268 8.14645 1.14645C8.05268 1.24021 8 1.36739 8 1.5V3.03C5.75 3.28 4 5.18 4 7.5V13.41L2.41 15H14.59L13 13.41V7.5C13 5.18 11.25 3.28 9 3.03V1.5ZM8.5 0C8.89782 0 9.27936 0.158035 9.56066 0.43934C9.84196 0.720644 10 1.10218 10 1.5V2.21C12.31 2.86 14 5 14 7.5V13L17 16H0L3 13V7.5C3 5 4.69 2.86 7 2.21V1.5C7 1.10218 7.15804 0.720644 7.43934 0.43934C7.72064 0.158035 8.10218 0 8.5 0ZM8.5 19C7.92367 19.0001 7.36501 18.8011 6.91855 18.4367C6.47209 18.0722 6.16527 17.5647 6.05 17H7.09C7.19284 17.2918 7.3837 17.5445 7.63625 17.7233C7.88879 17.9021 8.19059 17.9981 8.5 17.9981C8.80941 17.9981 9.11121 17.9021 9.36375 17.7233C9.6163 17.5445 9.80716 17.2918 9.91 17H10.95C10.8347 17.5647 10.5279 18.0722 10.0815 18.4367C9.63499 18.8011 9.07633 19.0001 8.5 19Z"
                              fill="black"
                            />
                          </svg>
                        </p>
                        <h2>₹ 3 Crore</h2>
                        <hr />
                        <p>3BHK Builder Floor 1700sqft.</p>
                        <hr />
                        <p>
                          Ernakulam, Kerala <span>Ganesh Property</span>
                        </p>
                        <hr />
                        <p>Available for Family</p>
                        <hr />
                        <p>Carpet Area 1720 sqft </p>
                      </div>
                      <ul className="m-0 myy-account-manager-wp">
                        <li className="my-account-view-link-wp-2">
                          <a>View Insight</a>
                        </li>
                        <li className="my-account-manage-wp-2">
                          <a>Manage Property</a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default MyProperty
