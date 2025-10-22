import React from 'react'
// import '../business-form/Message.css'
import LeftNavbar from '../Layout/LeftNavbar'
import Layout from '../Layout/Layout'
import '../message/Message.css'

function PendingMessage() {
  return (
    <Layout>
      <div className='company-detail-wrape-2'>
        <div className='container'>
          <div className='row'>
            <LeftNavbar />


            <div className='col-10 right-flex-grow'>
              <div className='company-detail-right-section'>
                <div className='company-detail-active-wraper'>
                  <h1 ><span></span>Basic Information</h1>
                  <h1><span></span>Personal Details</h1>
                  <h1><span></span>Company Details</h1>
                </div>
                <hr className='m-0' />

                <div className='row'>
                  <div className='col-4 m-auto message-box-wraper-col'>
                    <div className='message-box-wraper py-5'>

                      <p>
                        Your account is Verifying <span className='text-warning'>KYC</span> .
                        You’ll receive an email upon approval.
                      </p>
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

export default PendingMessage
