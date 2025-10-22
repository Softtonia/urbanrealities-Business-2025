import React, { useState } from 'react'
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

function AlertMessage() {
   const location = useLocation()
   console.log(location.pathname)
   const[load , setLoad] = useState(true)
   useEffect(()=>{
    setTimeout(() => {
        setLoad(false)
    }, 1000);
   },[])
  return (
 
    load===false && 
   ( <div className='d-flex justify-content-center mt-5' style={{height:'100vh'}}>
    <Stack sx={{ width: '50%' }} spacing={2}>
    <Alert severity="warning" >
            You are not allowed to open this route "{location.pathname}"
    </Alert>
</Stack>
</div>)
 
  )
}

export default AlertMessage
