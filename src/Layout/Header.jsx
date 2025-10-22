import React, { Fragment, useEffect, useState } from "react";
import "../Layout/Header.css";
import { AuthContext } from "../context/MyStore";
import { useContext } from "react";
import { API_KEY } from "../config";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { get, post } from "../Api/api";

function Header() {
  const { auth ,setAuth } = useContext(AuthContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const[data , setData] = useState([])
  const[data1 , setData1] = useState([])
  const nav = useNavigate()
  console.log(data.length)

  console.log('>==',auth)
  // console.log(data)

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };


const handleLogout = async () => {
  if (!auth?.token) return;

  try {
    // Call backend logout API
    const response = await post(`/api/logout`);

    // Check if backend confirms logout
    console.log(response.data)
    if (response.status === 200 && !response.data.is_login) {
      // Clear localStorage
      localStorage.removeItem("auth");

      // Reset global auth state
      setAuth({
        id: "",
        email: "",
        token: "",
        phone: "",
        is_login: false,
        role: "",
        user_name: "",
        approved: "",
        isapproved: "",
      });

      // Redirect to login
      nav("/login");
    } else {
      toast.error("Logout failed. Please try again.");
    }
  } catch (err) {
    console.error("Logout API error:", err);
    toast.error("Logout failed. Please try again.");
  }
};

  

  useEffect(()=>{
  //   const instance = axios.create({
  //     baseURL:API_KEY,
  //     headers: { "api-token": auth.token },
  // });
  get('/api/get-all-join-request-listing')
  .then(response=>{
    // console.log(response.data.join_requests)
    const filterStatus = response.data.join_requests.filter((data=>data.status==="requested"))
    setData(filterStatus)
  })
  .catch(err=>{
    console.log(err)
  })
  },[auth.token,auth.id])
  useEffect(()=>{
  //   const instance = axios.create({
  //     baseURL:API_KEY,
  //     headers: { "api-token": auth.token },
  // });
  get('/api/get-all-consultancy-join-request-listing')
  .then(response=>{
    // console.log(response.data.join_requests)
    const filterStatus = response.data.join_requests.filter((data=>data.status==="requested"))
    setData1(filterStatus)
  })
  .catch(err=>{
    console.log(err)
  })
  },[auth.token,auth.id])
 
  return (
    <div className="header-wrape-1">
      <div className="container">
        <nav>
          <ul>
            <li>
              <h1>
                <a>Urbanrealities</a>
              </h1>
            </li>
          </ul>
      
          {
          
            auth.is_login ?
            <ul className="d-flex">
            <div class="dropdown">
            <button class="dropdown-button ">Notification 
            
            
              {
                data.length > 0 || data1.length>0 ?
                <>
                  <span className="notification-status "></span> 
                  <span style={{verticalAlign:'top', fontSize:'10px',margin:'0px 5px'}}>{data?.length || data1?.length}{}</span>
                </>
              :
              <span style={{verticalAlign:'top', fontSize:'10px',margin:'0px 5px'}}>0</span>
              }
              
            </button>
           

            {/* <div class="dropdown-content">
              {
                data.map((record,index)=>(
                  <Fragment key={index}>
                  <a href="#">{record.consultancy.fullname}</a>
                  </Fragment>
                ))
              }
            </div> */}
          </div>
            <span className="span-divider"></span>
            <li className="dropdown" onMouseEnter={toggleDropdown} onMouseLeave={toggleDropdown}>
              <h2 className="dropDown-Login">
                {
                  auth.is_login?
                  <a>{auth.user_name || auth.email}</a>

                  :

                  <a>Login</a>

                }
              </h2>
              {isDropdownOpen && auth.is_login ? (
                <ul className="dropdown-content-logout">
                <li className="profile_list"><Link to={`/my-account/my-profile/${auth.id} `} >My Profile</Link></li>
                <li className="profile_list"><Link to='/my-account/all-request'>Request</Link></li>
                 {
                  auth.is_login?
                  <li><button onClick={handleLogout}><span>Log out</span></button></li>
                  :
                  <li><Link to='/login'><span>Login</span></Link></li>
                 }
                </ul>
              ):
            null}
            </li>
          </ul>
          :
          null
          }
        </nav>
      </div>
    </div>
  );
}

export default Header;
