import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/MyStore'
import { useNavigate, useParams } from 'react-router-dom'
import { API_KEY , API_TOKEN} from '../config'
import axios from 'axios'
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { get } from '../Api/api'

function MyAccount() {
    const {auth , setAuth} = useContext(AuthContext)
    const[count , setCount] = useState(5)
    console.log(count)
    const{id} = useParams()
    console.log(id)
    console.log(auth)
    const nav = useNavigate()

    useEffect(()=>{
        get(`${API_KEY}/api/get-data-by-token?id=${id}`)
        .then(response=>{
            console.log(response.status)
            const{id,email,user_name,is_login,isapproved,phone,role,token}=response.data
            if(response.status===200){
                setAuth(prev=>({
                    ...prev,
                    id,
                    email,
                    user_name,
                    is_login,
                    isapproved,
                    phone,
                    role,
                    token,
                    approved:isapproved
                }))
                localStorage.setItem('auth',JSON.stringify({
                    id,
                    email,
                    user_name,
                    is_login,
                    isapproved,
                    phone,
                    role,
                    token ,
                    approved:isapproved
                }))
                
            }
        })
        .catch(err=>{
            console.log(err)
        })
    },[])
    useEffect(() => {
        let intervalId;
    
        if (count > 0) {
            intervalId = setInterval(() => {
                setCount(prevCount => prevCount - 1);
            }, 1000);
        } else {
            nav('/');   
        }
    
        return () => clearInterval(intervalId);
    }, [count, nav]);
    
  return (
    <div className='container my-account-loader d-flex justify-content-center align-center' >
    <div><h3>redirect to you in <span >{count}</span> seconds</h3>
    <Box sx={{ display: 'flex' , justifyContent:'center' }}>
    <CircularProgress />
  </Box>
    </div>
    </div>
  )
}

export default MyAccount
