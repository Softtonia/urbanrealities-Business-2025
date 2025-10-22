import React from 'react'
// import '../business-form/Message.css'
import LeftNavbar from '../Layout/LeftNavbar'
import Layout from '../Layout/Layout'
import '../message/Message.css'

function Message() {
  return (
    <Layout>
    <div className='company-detail-wrape-2'>
         <div className='container'>
             <div className='row'>
                 <LeftNavbar/>
                 
                   
                 <div className='col-10 right-flex-grow'>
                 <div className='company-detail-right-section'>
                   <div className='company-detail-active-wraper'>
                     <h1 ><span></span>Basic Information</h1>
                     <h1><span></span>Personal Details</h1>
                     <h1><span></span>Company Details</h1>
                   </div>
                   <hr className='m-0'/>

                   <div className='row'>
                     <div className='col-4 m-auto message-box-wraper-col'>
                      <div className='message-box-wraper'>
                      <p>
                        <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50" fill="none">
                        <g clip-path="url(#clip0_618_15831)">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M0 25C0 18.3696 2.63392 12.0107 7.32233 7.32233C12.0107 2.63392 18.3696 0 25 0C31.6304 0 37.9893 2.63392 42.6777 7.32233C47.3661 12.0107 50 18.3696 50 25C50 31.6304 47.3661 37.9893 42.6777 42.6777C37.9893 47.3661 31.6304 50 25 50C18.3696 50 12.0107 47.3661 7.32233 42.6777C2.63392 37.9893 0 31.6304 0 25ZM23.5733 35.7L37.9667 17.7067L35.3667 15.6267L23.0933 30.9633L14.4 23.72L12.2667 26.28L23.5733 35.7Z" fill="#3D8B0D"/>
                        </g>
                        <defs>
                            <clipPath id="clip0_618_15831">
                            <rect width="50" height="50" fill="white"/>
                            </clipPath>
                        </defs>
                        </svg>
                      </p>
                        <p>Your  registration is complete.
                        Your account IS pending admin approval.
                        You’ll receive an email upon approval.
                        Thank you for registering.</p>
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

export default Message
