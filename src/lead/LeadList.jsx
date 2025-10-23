import React, { useState, useEffect, useContext } from 'react';
import { API_KEY } from '../config';
import { AuthContext } from '../context/MyStore';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../Layout/Layout';
import LeftNavbar from '../Layout/LeftNavbar';
import { toast } from 'react-toastify';
import { FormControl, RadioGroup, FormControlLabel, Radio, Button } from '@mui/material';
import { del, get, post } from '../Api/api';
import view from '../../img/view.png';
import edit from '../../img/edit.svg';
import delete_img from '../../img/delete.svg';
import './LeadList.css';

const LeadList = () => {
    const [data, setData] = useState([]);
    const [itemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [load, setLoad] = useState(false);
    const [visible, setVisible] = useState(false);
    const [status, setStatus] = useState('active');
    const [projectId, setProjectId] = useState('');
    const [selectedIds, setSelectedIds] = useState([]);
    const [bulkAction, setBulkAction] = useState('');

    const { auth } = useContext(AuthContext);
    const nav = useNavigate();

    const handleChange = (event) => setStatus(event.target.value);

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data.length > 0 ? data.slice(indexOfFirstItem, indexOfLastItem) : [];
    let count = (currentPage - 1) * itemsPerPage + 1;

    const paginate = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= Math.ceil(data.length / itemsPerPage)) {
            setCurrentPage(pageNumber);
        }
    };

    // Bulk delete handlers
    const handleSelect = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const handleSelectAll = () => {
        if (selectedIds.length === currentItems.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(currentItems.map((item) => item.id));
        }
    };

    // const handleBulkDelete = async () => {
    //     if (bulkAction !== "delete") {
    //         toast.warning("Please select a bulk action first.");
    //         return;
    //     }
    //     if (selectedIds.length === 0) {
    //         toast.warning("Please select at least one developer to delete.");
    //         return;
    //     }
    //     const confirmMsg = window.confirm(
    //         `Are you sure you want to delete ${selectedIds.length} developer(s)?`
    //     );
    //     if (!confirmMsg) return;

    //     try {
    //         await post(`/api/developer-bulk-delete`, { id: selectedIds.join(",") });
    //         toast.success("Selected developers deleted successfully!");
    //         setData((prev) => prev.filter((item) => !selectedIds.includes(item.id)));
    //         setSelectedIds([]);
    //         setBulkAction("");
    //     } catch (err) {
    //         console.error(err);
    //         toast.error("Error deleting selected developers.");
    //     }
    // };

    const handleDelete = async (id) => {
        const confirmMsg = window.confirm('Are you sure to delete?');
        if (!confirmMsg) return;

        try {
            await del(`/api/leads/${id}`);
            toast.success("Record deleted successfully!");
            setData((prev) => prev.filter((item) => item.id !== id));
        } catch (err) {
            console.error(err);
            toast.error("Error deleting record.");
        }
    };

    const handleModal = (id) => {
        setProjectId(id);
        setVisible(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await post("/api/update-website-project-status", {
                project_id: projectId,
                project_status: status
            });
            toast.success("Status updated successfully!");
            setVisible(false);
            setData((prev) =>
                prev.map((item) =>
                    item.id === projectId ? { ...item, project_status: status === "active" ? "1" : "0" } : item
                )
            );
        } catch (err) {
            console.error(err);
            toast.error("Error updating status.");
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await get(`/api/get-assign-lead-to-user?user_id=${auth.id}`);
                if (false) {
                    setData([]);
                } else {
                    setData(response?.data?.data);
                }
                setLoad(true);
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, [auth.token]);

    console.log("data",data)

    return (
        <Layout>
            <div className="wrape-2-nav-common-wp all-project-listing-search-wraper">
                <div className="container">
                    <div className="row">
                        <LeftNavbar />
                        <div className="col-10 flex-grow-1">
                            <div className="row add-property-row">
                                <div className="col-lg-12 right-purpose-col">
                                    <div className="right-section-wraper">
                                        {/* Bulk actions & Add Developer */}
                                        <div className="container action-dropdown-wraper d-flex justify-content-between mb-3">
                                            <div className="d-flex action-parent">
                                                <div className="dropdown-act-wraper">
                                                    <select
                                                        className="form-select form-select-lg"
                                                        // value={bulkAction}
                                                        // onChange={(e) => setBulkAction(e.target.value)}
                                                    >
                                                        <option value="">Bulk actions</option>
                                                        <option value="delete">Delete</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <button className="apply-btn-wraper" 
                                                    // onClick={handleBulkDelete}
                                                    >
                                                        <span>Apply</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Table */}
                                        <div className="edit-purpose-table-wraper table-responsive">
                                            <table className="table">
                                                <thead>
                                                    <tr>
                                                        <th className="id-col">
                                                            <span>
                                                                <input
                                                                    type="checkbox"
                                                                    checked={selectedIds.length === currentItems.length && currentItems.length > 0}
                                                                    onChange={handleSelectAll}
                                                                />
                                                            </span>
                                                            <p className="m-0 d-inline">S.No</p>
                                                        </th>
                                                        <th>Email</th>
                                                        <th>Message</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {load && currentItems.map((record, i) => (
                                                        <tr key={record.id}>
                                                            <th className="d-flex id-col">
                                                                <span>
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={selectedIds.includes(record.id)}
                                                                        onChange={() => handleSelect(record.id)}
                                                                    />
                                                                </span>
                                                                <p className="m-0">{count++}</p>
                                                            </th>
                                                            <td>{record.email}</td>
                                                            <td>{record.message}</td>
                                                           
                                                            <td>
                                                                <div className="edit-del-btn-wraper">
                                                                    <button onClick={() => nav('/my-account/view-lead/' + record.id)}>
                                                                        <img src={view} alt="view" />
                                                                    </button>
                                                                    <button onClick={() => handleDelete(record.id)}>
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
                                                <li className={`pagination-item ${currentPage === 1 ? "disabled" : ""}`}>
                                                    <button onClick={() => paginate(currentPage - 1)} className="pagination-link pagination-btn" disabled={currentPage === 1}>&lt;</button>
                                                </li>
                                                {Array.from({ length: Math.ceil(data.length / itemsPerPage) }).map((_, index) => (
                                                    <li key={index}>
                                                        <button
                                                            onClick={() => paginate(index + 1)}
                                                            className={`pagination-link pagination-btn pagination-item ${currentPage === index + 1 ? "active-pagination-btn" : ""}`}
                                                        >
                                                            {index + 1}
                                                        </button>
                                                    </li>
                                                ))}
                                                <li className={`pagination-item ${currentPage === Math.ceil(data.length / itemsPerPage) ? "disabled" : ""}`}>
                                                    <button onClick={() => paginate(currentPage + 1)} className="pagination-link pagination-btn" disabled={currentPage === Math.ceil(data.length / itemsPerPage)}>&gt;</button>
                                                </li>
                                            </ul>
                                        </div>

                                        {/* Status Modal */}
                                        {visible && (
                                            <div className="status-modal">
                                                <div className='status-modal-form-wraper' style={{ position: 'relative' }}>
                                                    <p className='text-center'>Update status</p>
                                                    <button onClick={() => setVisible(false)} className='close-popup-status-modal'>X</button>
                                                    <form onSubmit={handleSubmit}>
                                                        <FormControl component="fieldset">
                                                            <RadioGroup aria-label="status" name="status" value={status} onChange={handleChange}>
                                                                <FormControlLabel value="active" control={<Radio />} label="Active" />
                                                                <FormControlLabel value="inactive" control={<Radio />} label="Inactive" />
                                                            </RadioGroup>
                                                            <Button type="submit" variant="contained" color="primary" className='my-3 submit-status-active-inactive-wraper'>
                                                                Submit
                                                            </Button>
                                                        </FormControl>
                                                    </form>
                                                </div>
                                            </div>
                                        )}

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};


export default LeadList
