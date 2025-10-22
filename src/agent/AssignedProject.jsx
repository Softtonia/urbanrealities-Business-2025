import React, { useState , useEffect, useContext} from 'react'
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/MyStore';
import axios from 'axios';
import { API_KEY } from '../config';
import view from '../../img/view.png'
import edit from '../../img/edit.svg'
import delete_img from '../../img/delete.svg'
import { get } from '../Api/api';


function AssignedProject() {
    const [projects, setProjects] = useState([]);
    const{auth} = useContext(AuthContext)
 console.log(projects)
    useEffect(() => {
      let fetchData = async () => {
        // const instance = axios.create({
        //   baseURL: `${API_KEY}`,
        //   headers: { "api-token": auth.token },
        // });
        await get(`${API_KEY}/api/fetch-assigned-project-of-company`)
          .then((response) => {
            console.log(response.data.data)
            setProjects(response.data.data)
           
          })
          .catch((err) => {
            console.log(err);
          });
      };
      fetchData();
    }, [auth.token]);

  return (
    <>
    {
    //     <div className="container action-dropdown-manage-project-wraper d-flex justify-content-between">
    // <div className="d-flex action-parent">
    //   <div className="dropdown-act-wraper">
    //     <select
    //       class="form-select form-select-lg "
    //       aria-label=".form-select-lg example"
    //     >
    //       <option selected>Bulk actions</option>
    //       <option value="delete">Delete</option>
    //     </select>
    //   </div>
    //   <div>
    //     <button className="apply-btn-wraper">
    //       <span>Apply</span>
    //     </button>
    //   </div>
    // </div>

    // <Link
    //   to="/my-account/add-project"
    //   className="apply-btn-wraper"
    // >
    //   <span>Add Project</span>
    // </Link>
    //     </div>
    }

  <div className="table-responsive assign-project-table-wraper">
    <table className="table">
      <thead>
        <tr>
        <th scope="col">S.no</th>

         <th scope="col">Unique Id</th>
          <th scope="col">Name</th>
          <th scope="col">Email</th>
          <th scope="col">Assigned Project</th>
          {
            // <th scope="col">Status</th>

          }
          {
            // <th scope="col">Action</th>
          }
        </tr>
      </thead>
      <tbody>
        {projects?.consultancies?.map((project,index) => (
          <tr key={index} id="col-id">
          <td scope="row" className="d-flex id-col">
          <div style={{ width: '40px' }} className="d-flex">
            <span>
              <input type="checkbox" />
            </span>
            <p className='ms-2'>{index+1}</p>
          </div>
        </td>
            <td>{project.consultancy?.unique_id}</td>
            <td>{project.consultancy?.fullname}</td>
            <td>{project?.consultancy?.email}</td>
            <td><div style={{width:"150px"}}>
            {project.assigned_projects_count}
            </div></td>
            
          {
          //   <td>
          //   <button
          //     onClick={() =>
          //       nav(
          //         "/my-account/project-details/" + project.id
          //       )
          //     }
          //     className="view-assign-project-wraper"
          //   >
          //     <img src={view} />
          //   </button>
          //   <button
          //     onClick={() =>
          //       nav("/my-account/edit-project/" + project.id)
          //     }
          //     className="view-assign-project-wraper"
          //   >
          //     <img src={edit} />
          //   </button>
          //   <button
          //     onClick={() => HandleDelete(project.id)}
          //     className="view-assign-project-wraper"
          //   >
          //     <img src={delete_img} />
          //   </button>
          // </td>
          }
          </tr>
        ))}
      </tbody>
    </table>

  
  </div>
    </>
  )
}

export default AssignedProject
