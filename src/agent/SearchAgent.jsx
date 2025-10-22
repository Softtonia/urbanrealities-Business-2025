import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { API_KEY } from '../config';
import { AuthContext } from '../context/MyStore';
import { toast } from 'react-toastify';
import { post } from '../Api/api';

function SearchAgent() {
    const { auth } = useContext(AuthContext);
    const [filteredData, setFilteredData] = useState([]);
    const [load, setLoad] = useState(false);
    const [input, setInput] = useState('');
    const [count, setCount] = useState(0);

    const handleChange = (e) => {
        const searchTerm = e.target.value.toLowerCase();
        setInput(searchTerm);
        setCount(count + 1); // Increment count to trigger useEffect
    };
    console.log(filteredData)

    const handleSubmit = async (id, userStatus) => {
        try {
            // const instance = axios.create({
            //     baseURL: `${API_KEY}`,
            //     headers: { "api-token": auth.token },
            // });

            const response = await post('/api/send-request-by-consultancy-to-agent', { agent_id: id });
            toast.success(response.data.message);

            // Update user status locally without refetching data
            const updatedFilteredData = filteredData.map(agent => {
                if (agent.id === id) {
                    setCount(count+1)
                    return { ...agent, user_status: userStatus };
                }
                return agent;
            });
            setFilteredData(updatedFilteredData);
        } catch (error) {
            console.log(error);
            // toast.error("An error occurred. Please try again later.");
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            if (input.trim() === '') {
                setFilteredData([]); // Reset filteredData when input is empty
                setLoad(false);
                return;
            }

            try {
                // const instance = axios.create({
                //     baseURL: `${API_KEY}/api`,
                //     headers: { "api-token": auth.token },
                // });

                const response = await post(`/search-agent-by-id`);
                const filtered = response.data.data.filter(item => item.unique_id.toLowerCase().includes(input));
                setFilteredData(filtered);
                setLoad(true);
            } catch (error) {
                console.log("Error:", error);
            }
        };

        fetchData();
    }, [auth.token, input, count]);

    return (
        <div className='agent-search-bar'>
            <input className='' type='text' placeholder='Find agent by id' value={input} onChange={handleChange} />
            {load && filteredData.length > 0 && (
                <div className='agent-search-data'>
                    {filteredData.map(agent => (
                        <div key={agent.unique_id} className='d-flex align-center justify-content-between my-3 mx-3'>
                            <p className='m-0'>{agent.unique_id}</p>
                            <div>
                                <button  onClick={() => {
                                    if (agent.user_status !== "conneted") {
                                        handleSubmit(agent.id, agent.user_status);
                                    }
                                }} className={`send-request-agent-btn  ${agent.user_status==="conneted"? 'accepted' : ''}`}>
                                    <span>
                                        {agent.user_status === "requested" ? "Cancel -" :
                                            agent.user_status === "normal" ? "Send Request +" :
                                                agent.user_status === "connected" ? "Connect" : "Accepted"}
                                    </span>
                                </button>
                                
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default SearchAgent;
