import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import MyStore from './context/MyStore.jsx'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import Layout from './Layout/Layout.jsx'



ReactDOM.createRoot(document.getElementById('root')).render(
  <MyStore>
    <App />
    <ToastContainer />
  </MyStore>

)
