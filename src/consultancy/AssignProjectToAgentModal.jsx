import React, { useState, useEffect, useContext } from 'react';
import { Modal, Box, Typography, Checkbox, FormControlLabel, Button, FormGroup, CircularProgress } from '@mui/material';
import axios from 'axios';
import { AuthContext } from '../context/MyStore';
import { API_KEY } from '../config';
import { toast } from 'react-toastify';
import { get, post } from '../Api/api';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

function AssignProjectToAgentModal({ open, handleClose, data,id }) {
    console.log(id)
  const [projects, setProjects] = useState([]);
  const { auth } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    agent_id: '',
    project_id: []
  });
  const[load , setLoad] = useState(true)

  console.log(formData)
  console.log(projects)

  useEffect(() => {
    const fetchData = async () => {
      // const instance = axios.create({
      //   baseURL: API_KEY,
      //   headers: { "api-token": auth.token },
      // });
      try {
        const response = await get(`${API_KEY}/api/get-all-website-project-listing`);
        setProjects(response.data);
        setLoad(false)
      } catch (err) {
        console.error(err);
        setLoad(true)
      }
    };
    fetchData();
  }, [auth.token]);

  useEffect(() => {
    if (data && data.length > 0) {
      setFormData((prevData) => ({
        ...prevData,
        agent_id: id
      }));
    }
  }, [data]);

  const handleChange = (id) => {
    setFormData((prevData) => {
      const project_id = [...prevData.project_id];
      const index = project_id.indexOf(id);
      if (index === -1) {
        project_id.push(id);
      } else {
        project_id.splice(index, 1);
      }
      return { ...prevData, project_id };
    });
  };

  const handleSubmit = () => {
    // const instance = axios.create({
    //   baseURL: API_KEY,
    //   headers: { "api-token": auth.token },
    // });
    post('/api/assign-project-to-agent-by-consultancy', {
      agent_id: formData.agent_id,
      project_id: formData.project_id.join(',')
    })
      .then(response => {
        console.log(response);
        toast.success(response.data.message);
        handleClose(); // Close the modal on successful response
      })
      .catch(err => {
        console.log(err);
        toast.error(err.response.data.message); // Show error message if needed
      });
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={style}>
        {
          load ? 
          <Box sx={{ display: 'flex' , justifyContent:"center" }}>
          <CircularProgress />
        </Box>
          :
          <>
          <Typography id="modal-title" style={{ marginBottom: "20px" }} variant="h6" component="h2">
          Assign Project
        </Typography>
        <FormGroup>
          {projects.map((item) => (
            <FormControlLabel
              key={item.id}
              control={
                <Checkbox
                  checked={formData.project_id.includes(item.id)}
                  onChange={() => handleChange(item.id)}
                />
              }
              label={item.name}
            />
          ))}
        </FormGroup>
        <Button onClick={handleSubmit} className='mt-3' variant="contained" color="primary">
          Assign
        </Button>
          </>
        }
      </Box>
    </Modal>
  );
}

export default AssignProjectToAgentModal;
