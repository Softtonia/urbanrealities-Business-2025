import React, { useState, useEffect, useContext } from "react";
import { API_KEY, API_TOKEN } from "../config";
import { AuthContext } from "../context/MyStore";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../Layout/Layout";
import LeftNavbar from "../Layout/LeftNavbar";
import axios from "axios";
import "../project/AllProject.css";
import view from "../../img/view.png";
import edit from "../../img/edit.svg";
import delete_img from "../../img/delete.svg";
import { toast } from "react-toastify";
import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
} from "@mui/material";
import { get, post } from "../Api/api";

function AllProject() {
  const [data, setData] = useState([]);
  const [load, setLoad] = useState(false);
  const [visible, setVisible] = useState(false);
  const [status, setStatus] = useState("active");
  const [projectId, setProjectId] = useState("");
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [bulkAction, setBulkAction] = useState("");
  const [pagination, setPagination] = useState({
    total: 0,
    per_page: 10,
    current_page: 1,
    last_page: 1,
  });

  const { auth } = useContext(AuthContext);
  const nav = useNavigate();

  const handleChange = (event) => setStatus(event.target.value);

  // =========================
  // 📌 FETCH DATA (Server-side Pagination)
  // =========================
  const fetchData = async (page = 1) => {
    setLoad(false);
    try {
      const res = await get(
        `/api/get-all-project-listings-by-companyoradmin-token?user_id=${auth.id}&page=${page}`
      );
      setData(res?.data?.data?.projects || []);
      setPagination(res?.data?.data?.pagination);
      setLoad(true);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (auth.id) fetchData(pagination.current_page);
  }, [auth.id]);

  // =========================
  // 📌 DELETE SINGLE PROJECT
  // =========================
  const HandleDelete = async (id) => {
    const confirmMsg = confirm("Are you sure to delete this project?");
    if (!confirmMsg) return;

    try {
      await post(`/api/delete-project-listing`, { id });
      toast.success("Record deleted successfully!");
      fetchData(pagination.current_page);
    } catch (err) {
      toast.error("Error deleting project!");
    }
  };

  // =========================
  // 📌 BULK DELETE
  // =========================
  const handleBulkDelete = async () => {
    if (selectedProjects.length === 0) {
      toast.warning("Please select at least one project!");
      return;
    }

    const confirmMsg = confirm(
      `Are you sure to delete ${selectedProjects.length} project(s)?`
    );
    if (!confirmMsg) return;

    try {
      const ids = selectedProjects.join(',');

      await post(`/api/project-bulk-delete`, { id: ids });
      toast.success("Selected projects deleted successfully!");
      setSelectedProjects([]);
      fetchData(pagination.current_page);
    } catch (err) {
      toast.error("Error deleting selected projects!");
    }
  };

  // =========================
  // 📌 STATUS MODAL
  // =========================
  const handleModal = (id, status) => {
    setStatus(status)
    setProjectId(id);
    setVisible(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await post("/api/update-project-temporary-status", {
        project_id: projectId,
        temporary_status: status,
      });
      toast.success("Updated successfully!");
      setVisible(false);
      fetchData(pagination.current_page);
    } catch (err) {
      toast.error("Error updating status!");
    }
  };

  // =========================
  // 📌 HANDLE SELECTION
  // =========================
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedProjects(data.map((item) => item.id));
    } else {
      setSelectedProjects([]);
    }
  };

  const handleSelectOne = (id) => {
    setSelectedProjects((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  // =========================
  // 📌 PAGINATION HANDLER
  // =========================
  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= pagination.last_page) {
      setPagination((prev) => ({ ...prev, current_page: pageNumber }));
      fetchData(pageNumber);
    }
  };

  return (
    <Layout>
      <div className="wrape-2-nav-common-wp all-project-listing-search-wraper">
        <div className="container">
          <div className="row ">
            <LeftNavbar />
            <div className="col-10 flex-grow-1">
              <div className="row add-property-row">
                <div className="col-lg-12 right-purpose-col">
                  <div className="right-section-wraper">
                    {/* Header actions */}
                    <div className="container action-dropdown-wraper d-flex justify-content-between">
                      <div className="d-flex action-parent">
                        <div className="dropdown-act-wraper">
                          <select
                            className="form-select form-select-lg"
                            aria-label=".form-select-lg example"
                            onChange={(e) => setBulkAction(e.target.value)}
                            value={bulkAction}
                          >
                            <option value="">Bulk actions</option>
                            <option value="delete">Delete</option>
                          </select>
                        </div>
                        <div>
                          <button
                            className="apply-btn-wraper"
                            onClick={() => {
                              if (bulkAction === "delete") handleBulkDelete();
                            }}
                          >
                            <span>Apply</span>
                          </button>
                        </div>
                      </div>

                      <Link
                        to="/my-account/add-project"
                        className="apply-btn-wraper"
                      >
                        <span>Add Project</span>
                      </Link>
                    </div>

                    {/* Table */}
                    <div className="edit-purpose-table-wraper table-responsive">
                      <table className="table">
                        <thead>
                          <tr>
                            <th scope="col" className="id-col">
                              <span>
                                <input
                                  type="checkbox"
                                  onChange={handleSelectAll}
                                  checked={
                                    selectedProjects.length === data.length &&
                                    data.length > 0
                                  }
                                />
                              </span>
                              <p className="m-0 d-inline">S.No</p>
                            </th>
                            <th scope="col">Project Name</th>
                            <th scope="col">Purpose</th>
                            <th scope="col">Status</th>
                            <th scope="col">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {load &&
                            data.map((record, i) => (
                              <tr key={record.id}>
                                <th scope="row" className="d-flex id-col">
                                  <div
                                    style={{ width: "72px" }}
                                    className="d-flex"
                                  >
                                    <span>
                                      <input
                                        type="checkbox"
                                        checked={selectedProjects.includes(
                                          record.id
                                        )}
                                        onChange={() =>
                                          handleSelectOne(record.id)
                                        }
                                      />
                                    </span>
                                    <p className="m-0">
                                      {(pagination.current_page - 1) *
                                        pagination.per_page +
                                        (i + 1)}
                                    </p>
                                  </div>
                                </th>
                                <td>
                                  <div
                                    style={{ width: "150px" }}
                                    className="d-flex"
                                  >
                                    {record.name}
                                  </div>
                                </td>
                                <td>
                                  <div
                                    style={{ width: "150px" }}
                                    className="d-flex"
                                  >
                                    {record.purpose_name}
                                  </div>
                                </td>
                                <td>
                                  <div
                                    style={{ width: "150px" }}
                                    className="d-flex"
                                  >
                                    <button
                                      className={
                                        record.temporary_status === "active"
                                          ? "active_view"
                                          : "deactivate_view bg-danger"
                                      }
                                      onClick={() => handleModal(record.id, record.temporary_status)}
                                    >
                                      {record.temporary_status === "active"
                                        ? "Active"
                                        : "Inactive"}
                                    </button>
                                  </div>
                                </td>
                                <td>
                                  <div className="edit-del-btn-wraper">
                                    <button
                                      onClick={() =>
                                        nav(
                                          "/my-account/edit-project/" +
                                          record.id
                                        )
                                      }
                                    >
                                      <img src={edit} alt="edit" />
                                    </button>
                                    <button
                                      onClick={() => HandleDelete(record.id)}
                                    >
                                      <img src={delete_img} alt="delete" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination */}
                    <div className="pagination d-flex justify-content-end">
                      <ul className="pagination-list d-flex">
                        <li
                          className={`pagination-item ${pagination.current_page === 1 ? "disabled" : ""
                            }`}
                        >
                          <button
                            onClick={() => paginate(pagination.current_page - 1)}
                            className="pagination-link pagination-btn"
                            disabled={pagination.current_page === 1}
                          >
                            &lt;
                          </button>
                        </li>
                        {Array.from({
                          length: pagination.last_page,
                        }).map((_, index) => (
                          <li key={index}>
                            <button
                              onClick={() => paginate(index + 1)}
                              className={`pagination-link pagination-btn pagination-item ${pagination.current_page === index + 1
                                  ? "active-pagination-btn"
                                  : ""
                                }`}
                            >
                              {index + 1}
                            </button>
                          </li>
                        ))}
                        <li
                          className={`pagination-item ${pagination.current_page === pagination.last_page
                              ? "disabled"
                              : ""
                            }`}
                        >
                          <button
                            onClick={() => paginate(pagination.current_page + 1)}
                            className="pagination-link pagination-btn"
                            disabled={
                              pagination.current_page === pagination.last_page
                            }
                          >
                            &gt;
                          </button>
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

      {/* Popup modal */}
      <div className={`status-modal ${visible ? "" : "d-none"}`}>
        <div
          className="status-modal-form-wraper"
          style={{ position: "relative" }}
        >
          <p className="text-center">Update status</p>
          <button
            onClick={() => setVisible(false)}
            className="close-popup-status-modal"
          >
            X
          </button>
          <form onSubmit={handleSubmit}>
            <FormControl component="fieldset">
              <RadioGroup
                aria-label="status"
                name="status"
                value={status}
                onChange={handleChange}
              >
                <FormControlLabel
                  value="active"
                  control={<Radio />}
                  label="Active"
                />
                <FormControlLabel
                  value="deactive"
                  control={<Radio />}
                  label="Inactive"
                />
              </RadioGroup>
              <Button
                className="my-3 submit-status-active-inactive-wraper"
                type="submit"
                variant="contained"
                color="primary"
              >
                Submit
              </Button>
            </FormControl>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export default AllProject;
