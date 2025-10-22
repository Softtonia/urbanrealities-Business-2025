import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { API_KEY } from '../config';
import { AuthContext } from '../context/MyStore';
import AssignAgentProjectModal from './AssignAgentProjectModal';
import { get } from '../Api/api';

function AssignToAgent() {
  const [data, setData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const { auth } = useContext(AuthContext);
 console.log(data)
  useEffect(() => {
    let fetchData = async () => {
      // const instance = axios.create({
      //   baseURL: `${API_KEY}/api`,
      //   headers: { 'api-token': auth.token },
      // });
      await get(`/get-company-consultancy-listing`)
        .then((response) => {
          setData(response.data);
          console.log(response.data);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    fetchData();
  }, [auth.token]);

  const handleOpenModal = (project) => {
    setSelectedProject(project);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedProject(null);
  };

  return (
    <>
      <div className="container action-dropdown-manage-project-wraper d-flex justify-content-between">
        <div className="d-flex action-parent">
          <div className="dropdown-act-wraper">
            <select className="form-select form-select-lg" aria-label=".form-select-lg example">
              <option selected>Bulk actions</option>
              <option value="delete">Delete</option>
            </select>
          </div>
          <div>
            <button className="apply-btn-wraper">
              <span>Apply</span>
            </button>
          </div>
        </div>
      </div>

      <div className="table-responsive assign-project-table-wraper">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">S.no</th>
              <th scope="col">Name</th>
              <th scope="col">Email</th>
              <th scope="col">Phone</th>
              <th scope="col">Status</th>
              {
                <th scope="col">Action</th>
              }
            </tr>
          </thead>
          <tbody>
            {data.map((project, index) => (
              <tr key={project.id} id="col-id">
                <td scope="row" className="d-flex id-col">
                  <div style={{ width: '72px' }} className="d-flex">
                    <span>
                      <input type="checkbox" />
                    </span>
                    <p className="ms-3">{index + 1}</p>
                  </div>
                </td>
                <td>{project.fullname}</td>
                <td>{project.email}</td>
                <td>{project.phone}</td>
                <td>
                  <div style={{ width: '150px' }} className="d-flex">
                    <button
                      className={project.isapproved === 'approved' ? 'active_view' : 'deactivate_view bg-danger'}
                      onClick={() => handleOpenModal(project)}
                    >
                      {project.isapproved}
                    </button>
                  </div>
                </td>
                <td>
                  <button className="assign-to-button" onClick={() => handleOpenModal(project)}>Assign Project</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedProject && (
        <AssignAgentProjectModal
          open={modalOpen}
          handleClose={handleCloseModal}
          data={data}
        />
      )}
    </>
  );
}

export default AssignToAgent;
