import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { API_KEY } from '../config';
import { AuthContext } from '../context/MyStore';
import { toast } from 'react-toastify';

function SearchAgent() {
    const { auth } = useContext(AuthContext);
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [load, setLoad] = useState(false);
    const [requestStatus, setRequestStatus] = useState(JSON.parse(localStorage.getItem('requestStatus')) || {});

    const updateLocalStorage = (data) => {
        localStorage.setItem('requestStatus', JSON.stringify(data));
    };

    const handleSubmit = (id) => {
        const instance = axios.create({
            baseURL: `${API_KEY}`,
            headers: { "api-token": auth.token },
        });
    
        if (requestStatus[id]) {
            // If request status is true (i.e., request already sent), cancel the request
            instance.post('/api/send-request-by-consultancy-to-agent', { agent_id: id })
                .then(response => {
                    toast.success(response.data.message); // Show success message for canceling request
                    const updatedStatus = { ...requestStatus, [id]: false };
                    setRequestStatus(updatedStatus);
                    updateLocalStorage(updatedStatus);
                })
                .catch(err => {
                    console.log(err);
                });
        } else {
            // If request status is false (i.e., no request sent), send the request
            instance.post('/api/send-request-by-consultancy-to-agent', { agent_id: id })
                .then(response => {
                    toast.success(response.data.message); // Show success message for sending request
                    const updatedStatus = { ...requestStatus, [id]: true };
                    setRequestStatus(updatedStatus);
                    updateLocalStorage(updatedStatus);
                })
                .catch(err => {
                    console.log(err);
                });
        }
    };
    
    useEffect(() => {
        const fetchData = async () => {
            const instance = axios.create({
                baseURL: `${API_KEY}/api`,
                headers: { "api-token": auth.token },
            });
            try {
                const response = await instance.get(`/get-consultancy-agent-listing`);
                setData(response.data);
                setLoad(true); // Set load to true when data is fetched
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, [auth.token]);

    const handleChange = (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filtered = data.filter(item => item.unique_id.toLowerCase().includes(searchTerm));
        setFilteredData(filtered);

        // Check if input value is empty, reset filteredData if it is
        if (searchTerm === "") {
            setFilteredData([]);
        }
    };

    return (
        <div className='agent-search-bar'>
            <input className='' type='text' placeholder='Find agent by id' onChange={handleChange} />
            {load && filteredData.length > 0 && (
                <div className='agent-search-data'>
                    {filteredData.map(agent => (
                        <div key={agent.unique_id} className='d-flex align-center justify-content-between my-3 mx-3'>
                            <p className='m-0'>{agent.unique_id}</p>
                            <div>
                                {requestStatus[agent.id] ? (
                                    <button onClick={() => handleSubmit(agent.id)} className='send-request-agent-btn' ><span> Cancel -</span></button>
                                ) : (
                                    <button onClick={() => handleSubmit(agent.id)} className='send-request-agent-btn'><span> Send Request +</span></button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default SearchAgent;
