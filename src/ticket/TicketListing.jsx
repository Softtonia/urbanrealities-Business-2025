import React, { useState } from "react";
import view from "../../img/view.png";

function TicketListing() {
  const [showModal, setShowModal] = useState(false);
  console.log(showModal);

  const handleRowClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div>
      <div className="container ticket-table-cnt">
        <table className="table">
          <thead>
            <tr>
              <th className=" align-center"><input className="me-2 " type="checkbox"/>S:no</th>
              <th>Property ID</th>
              <th>Subjects</th>
              <th>Priority Ticket</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr onClick={handleRowClick}>
              <td className="col d-flex align-center"><input type="checkbox" className="me-2"/>1</td>
              <td className="col">952874</td>
              <td className="col">Residential</td>
              <td className="col">
                <button className="closed-btn-ticket-wp">
                  <span>Closed</span>
                </button>
              </td>
              <td className="col">
                <button className="resolved-btn-ticket-wp">
                  <span>Resolved</span>
                </button>
              </td>
              <td className="col">
                <img src={view} className="me-1" alt="View" />
                <img src={view} className="me-1" alt="View" />
                <img src={view} alt="View" />
              </td>
            </tr>
            <tr onClick={handleRowClick}>
              <td className="col d-flex align-center"><input type="checkbox" className="me-2"/>1</td>
              <td className="col">952874</td>
              <td className="col">Residential</td>
              <td className="col">
                <button className="closed-btn-ticket-wp">
                  <span>Closed</span>
                </button>
              </td>
              <td className="col">
                <button className="resolved-btn-ticket-wp">
                  <span>Resolved</span>
                </button>
              </td>
              <td className="col">
                <img src={view} className="me-1" alt="View" />
                <img src={view} className="me-1" alt="View" />
                <img src={view} alt="View" />
              </td>
            </tr>
            <tr onClick={handleRowClick}>
              <td className="col d-flex align-center"><input type="checkbox" className="me-2"/>1</td>
              <td className="col">952874</td>
              <td className="col">Residential</td>
              <td className="col">
                <button className="closed-btn-ticket-wp">
                  <span>Closed</span>
                </button>
              </td>
              <td className="col">
                <button className="resolved-btn-ticket-wp">
                  <span>Resolved</span>
                </button>
              </td>
              <td className="col">
                <img src={view} className="me-1" alt="View" />
                <img src={view} className="me-1" alt="View" />
                <img src={view} alt="View" />
              </td>
            </tr>
            <tr onClick={handleRowClick}>
              <td className="col d-flex align-center"><input type="checkbox" className="me-2"/>1</td>
              <td className="col">952874</td>
              <td className="col">Residential</td>
              <td className="col">
                <button className="closed-btn-ticket-wp">
                  <span>Closed</span>
                </button>
              </td>
              <td className="col">
                <button className="resolved-btn-ticket-wp">
                  <span>Resolved</span>
                </button>
              </td>
              <td className="col">
                <img src={view} className="me-1" alt="View" />
                <img src={view} className="me-1" alt="View" />
                <img src={view} alt="View" />
              </td>
            </tr>
            <tr onClick={handleRowClick}>
              <td className="col d-flex align-center"><input type="checkbox" className="me-2"/>1</td>
              <td className="col">952874</td>
              <td className="col">Residential</td>
              <td className="col">
                <button className="closed-btn-ticket-wp">
                  <span>Closed</span>
                </button>
              </td>
              <td className="col">
                <button className="resolved-btn-ticket-wp">
                  <span>Resolved</span>
                </button>
              </td>
              <td className="col">
                <img src={view} className="me-1" alt="View" />
                <img src={view} className="me-1" alt="View" />
                <img src={view} alt="View" />
              </td>
            </tr>
            <tr onClick={handleRowClick}>
              <td className="col d-flex align-center"><input type="checkbox" className="me-2"/>1</td>
              <td className="col">952874</td>
              <td className="col">Residential</td>
              <td className="col">
                <button className="closed-btn-ticket-wp">
                  <span>Closed</span>
                </button>
              </td>
              <td className="col">
                <button className="resolved-btn-ticket-wp">
                  <span>Resolved</span>
                </button>
              </td>
              <td className="col">
                <img src={view} className="me-1" alt="View" />
                <img src={view} className="me-1" alt="View" />
                <img src={view} alt="View" />
              </td>
            </tr>
            <tr onClick={handleRowClick}>
              <td className="col d-flex align-center"><input type="checkbox" className="me-2"/>1</td>
              <td className="col">952874</td>
              <td className="col">Residential</td>
              <td className="col">
                <button className="closed-btn-ticket-wp">
                  <span>Closed</span>
                </button>
              </td>
              <td className="col">
                <button className="resolved-btn-ticket-wp">
                  <span>Resolved</span>
                </button>
              </td>
              <td className="col">
                <img src={view} className="me-1" alt="View" />
                <img src={view} className="me-1" alt="View" />
                <img src={view} alt="View" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      {/* Ticket Modal */}
      <div className={`ticket-modal ${showModal ? "slide-in" : "slide-out"}`}>
        {/* Modal content */}
        <button className="close-ticket-model" onClick={handleCloseModal}>
          X
        </button>
        <div className="row">
          <div className="col-8">
            <div className="ticket-model-paragraph-wp">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Pellentesque eu ex vestibulum, fermentum tellus{" "}
              </p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Pellentesque eu ex vestibulum, fermentum tellus{" "}
              </p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Pellentesque eu ex vestibulum, fermentum tellus{" "}
              </p>
            </div>
            <div className="ticket-model-environment-detail1">
              <div className="ticket-model-environment-detail1-content-wp">
                <h2>Environment Details</h2>
                <div className="row">
                  <div className="col-3 ticket-model-environment-detail1-content-col">
                    <p>CGS Name</p>
                  </div>
                  <div className="col-3 ticket-model-environment-detail1-content-col">
                    <p>CGS Name</p>
                  </div>
                  <div className="col-3 ticket-model-environment-detail1-content-col">
                    <p>CGS Name</p>
                  </div>
                  <div className="col-3 ticket-model-environment-detail1-content-col">
                    <p>CGS Name</p>
                  </div>
                  <div className="col-3 ticket-model-environment-detail1-content-col">
                    <p>CGS Name</p>
                  </div>
                  <div className="col-3 ticket-model-environment-detail1-content-col">
                    <p>CGS Name</p>
                  </div>
                  <div className="col-3 ticket-model-environment-detail1-content-col">
                    <p>CGS Name</p>
                  </div>
                  <div className="col-3 ticket-model-environment-detail1-content-col">
                    <p>CGS Name</p>
                  </div>
                  <div className="col-3 ticket-model-environment-detail1-content-col">
                    <p>CGS Name</p>
                  </div>
                  <div className="col-3 ticket-model-environment-detail1-content-col">
                    <p>CGS Name</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-4 ticket-model-right-col">
            <h2>Assignee Details</h2>
            <div className="ticket-model-assign-wp">
              <p>
                Assignee Name &nbsp;: <br /> <strong>Aakash Sharma</strong>
              </p>
              <p className="m-0">
                Assignee Group: &nbsp;: <br /> <strong>ATS Group</strong>
              </p>
            </div>
            <h2 className="mt-5">Caller Details</h2>
            <div className="ticket-model-assign-wp">
              <p>
                Incident ID &nbsp;: <br /> <span>#952874</span>
              </p>
              <p>
                Incident Types &nbsp;: <br />{" "}
                <strong>Configuration Security</strong>
              </p>
              <p className="m-0">
                Customer Name &nbsp;: <br /> <strong>Cloud Inc.</strong>
              </p>
            </div>
            <h2 className="mt-5">Other Information</h2>
            <div className="ticket-model-other-info-wp">
              <div className="d-flex justify-content-between mb-2">
                <p className="m-0">Impact </p>{" "}
                <div>
                  <button className="high-btn">
                    <span>High</span>
                  </button>
                </div>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <p className="m-0">Priority </p>{" "}
                <div>
                  <button className="low-btn">
                    <span>Low</span>
                  </button>
                </div>
              </div>
              <div className="d-flex justify-content-between">
                <p className="m-0">Agency </p>{" "}
                <div>
                  <button className="medium-btn">
                    <span>Medium</span>
                  </button>
                </div>
              </div>
              <div className="d-flex justify-content-between pt-3 align-center">
                <p className="m-0">Created on </p>{" "}
               
                  <p className="m-0"><strong>12 Jan, 4pm</strong></p>
              
              </div>
              <div className="d-flex justify-content-between pt-3 align-center">
                <p className="m-0">Created by </p>{" "}
               
                  <div className="d-flex align-center">
                  <p className="m-0"><strong>Akash</strong> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
                  </div>
              
              </div>
              <div className="d-flex justify-content-between pt-3 align-center">
                <p className="m-0">Last Update by </p>{" "}
               
                  <div className="d-flex align-center">
                  <p className="m-0"><strong> David</strong> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
                  </div>
              
              </div>
            </div>
            <div className="ticket-progress-buttons-wraper">
            <button className="process-btn">
                <span>In Process</span>
            </button>
            <button className="escalate-btn">
                <span>Escalate Ticket</span>
            </button>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TicketListing;
