import React from 'react'
import Layout from '../Layout/Layout'
import LeftNavbar from '../Layout/LeftNavbar'
import '../ticket/Ticket.css'
import ProgressBar from '../dashboard/ProgressBar'
import TicketListing from './TicketListing'

function Ticket() {
  return (
    <Layout>
    <div className="wrape-2-nav-common-wp">
      <div className="container">
        <div className="row">
          <LeftNavbar />
          <div className="col-10 ticket-right-section-wraper">
            <div className='ticket-right-section'>
                <h1>Ticket System</h1>
                 <div className='ticket-circular-progress-wraper'>
                    <div className='row border-borderLine'>
                      <div className='col-2 py-4 d-flex justify-content-around'>
                        <ProgressBar percentage='30'/>
                         <div>
                         <h2>30%</h2>
                         <p className='text-gray'>Resolved</p>
                         </div>
                      </div>
                      <div className='col-2 py-4 d-flex justify-content-around'>
                      <ProgressBar percentage='15'/>
                       <div>
                       <h2>15</h2>
                       <p className='text-gray'>New</p>
                       </div>
                    </div>
                      <div className='col-2 py-4 d-flex justify-content-around'>
                      <ProgressBar percentage='85'/>
                       <div>
                       <h2>15</h2>
                       <p className='text-gray'>New</p>
                       </div>
                    </div>
                    <div className='col-3 ticket-svg-wp-col-3'>
                        <p className='strong-ticket-heading-section'><strong >Total:475</strong></p>
                        <div className='ticket-total-svg-wp'>
                            <div className='ticket-total-svg-img1 mx-2'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 11 11" fill="none">
                                     <path d="M1.375 9.625V7.33333H1.83333V9.16667H3.66667V9.625H1.375ZM1.375 3.66667V1.375H3.66667V1.83333H1.83333V3.66667H1.375ZM4.95367 8.41592C4.35081 8.30286 3.83335 8.03046 3.40129 7.59871C2.96954 7.16665 2.69714 6.64919 2.58408 6.04633H3.04242C3.146 6.52636 3.37043 6.93901 3.71571 7.28429C4.06099 7.62957 4.47349 7.854 4.95321 7.95758L4.95367 8.41592ZM2.58408 4.95367C2.69714 4.35081 2.96954 3.83289 3.40129 3.39992C3.83335 2.96725 4.35081 2.69531 4.95367 2.58408V3.04242C4.47364 3.146 4.06099 3.37043 3.71571 3.71571C3.37043 4.06099 3.146 4.47349 3.04242 4.95321L2.58408 4.95367ZM5.5 6.1875C5.30658 6.1875 5.14372 6.12119 5.01142 5.98858C4.87881 5.85628 4.8125 5.69342 4.8125 5.5C4.8125 5.30506 4.87881 5.14158 5.01142 5.00958C5.14372 4.87819 5.30658 4.8125 5.5 4.8125C5.69494 4.8125 5.85842 4.87819 5.99042 5.00958C6.12181 5.14158 6.1875 5.30506 6.1875 5.5C6.1875 5.69342 6.12181 5.85628 5.99042 5.98858C5.85842 6.12119 5.69494 6.1875 5.5 6.1875ZM6.04633 8.41592V7.95758C6.52636 7.854 6.93901 7.62957 7.28429 7.28429C7.62957 6.93901 7.854 6.52651 7.95758 6.04679H8.41592C8.30469 6.64935 8.03275 7.16665 7.60008 7.59871C7.16711 8.03046 6.64919 8.30286 6.04633 8.41592ZM7.95758 4.95367C7.854 4.47364 7.62957 4.06099 7.28429 3.71571C6.93901 3.37043 6.52651 3.146 6.04679 3.04242V2.58408C6.64935 2.69714 7.16711 2.96954 7.60008 3.40129C8.03275 3.83335 8.30469 4.35081 8.41592 4.95367H7.95758ZM7.33333 9.625V9.16667H9.16667V7.33333H9.625V9.625H7.33333ZM9.16667 3.66667V1.83333H7.33333V1.375H9.625V3.66667H9.16667Z" fill="white"/>
                                </svg>
                                
                            </div>
                            <p className='ticket-total-svg-img1-paragraph mx-2'>258</p>
                            <p className='ticket-total-svg-img1-paragraph2 mx-2'>Active</p>
                        </div>
                        <div className='ticket-total-svg-wp'>
                            <div className=' ticket-total-svg-img2 mx-2'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 11 11" fill="none">
                            <g clip-path="url(#clip0_668_11220)">
                              <path d="M5.49935 0.914062C2.97852 0.914062 0.916016 2.97656 0.916016 5.4974C0.916016 8.01823 2.97852 10.0807 5.49935 10.0807C8.02018 10.0807 10.0827 8.01823 10.0827 5.4974C10.0827 2.97656 8.02018 0.914062 5.49935 0.914062ZM4.58268 7.78906L2.29102 5.4974L2.93727 4.85115L4.58268 6.49198L8.06143 3.01323L8.70768 3.66406L4.58268 7.78906Z" fill="white"/>
                            </g>
                            <defs>
                              <clipPath id="clip0_668_11220">
                                <rect width="11" height="11" fill="white"/>
                              </clipPath>
                            </defs>
                             </svg>   
                            </div>
                            <p className='ticket-total-svg-img1-paragraph mx-2'>258</p>
                            <p className='ticket-total-svg-img1-paragraph2 mx-2'>Active</p>
                        </div>
                    </div>
                    </div>
                 </div>
                 <TicketListing/>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
  )
}

export default Ticket
