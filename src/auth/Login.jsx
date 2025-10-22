import React, { useContext, useState } from 'react'
import '../auth/Login.css'
import Layout from '../Layout/Layout'
import { Link } from 'react-router-dom'
import shape from '../../img/Shape.svg'
import { API_KEY, WEBSITE_WEB_URL } from '../config'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/MyStore'
import { toast } from 'react-toastify'
import { get, post } from '../Api/api'

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [showUnauthorizedModal, setShowUnauthorizedModal] = useState(false) // 🚀 state for modal
  const nav = useNavigate()
  const { auth, setAuth } = useContext(AuthContext)

  const HandleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const HandleSubmit = async (e) => {
    e.preventDefault();

    if (formData.email === "") {
      toast.error("Email is required");
      return;
    }
    if (formData.password === "") {
      toast.error("Password is required");
      return;
    }

    try {
      // Step 1: Login API
      const response = await post(`${API_KEY}/api/login`, formData);

      if (response.status === 200) {
        const { user_id, token, role } = response.data;

        // 🚦 Step 2: Check role before fetching details
        if (role === "owner") {
          setShowUnauthorizedModal(true); // open popup modal
          return;
        }

        // ✅ Step 3: Fetch user details if authorized
        const response2 = await get(
          `${API_KEY}/api/get-details-byuserid?id=${user_id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const data = response2.data;

        if (data) {
          const newAuth = {
            id: data.id || user_id,
            email: data.email || "",
            token,
            phone: data.phone || "",
            is_login: true,
            role: data.role_name,
            user_name: data.user_name,
            approved: data.isapproved,
            isapproved: data.isapproved,
            kyc: data.kyc
          };

          setAuth(newAuth);
          localStorage.setItem("auth", JSON.stringify(newAuth));

          nav("/");
        } else {
          toast.error("Failed to fetch user details");
        }
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <Layout>
      <div className="col-lg-12 bg-white login mt-100">
        <div className="row">
          <div className="col-lg-4 col-md-6 col-sm-12 background-login">
            <div className="section">
              <h1>Welcome to UrbanRealities!</h1>
              <h1>To access your account:</h1>
              <h2>Login with email & password</h2>
              <ul className="info-login-wraper">
                <li>Enter your registered email address or phone number in the designated field.</li>
                <li>Input your password in the password field.</li>
                <li>Click the "Login" button to access your account.</li>
              </ul>
              <h2>Login with google account</h2>
              <ul className="info-login-wraper">
                <li>Choose your Google account and grant the necessary permissions.</li>
                <li className="pb-4">You will be seamlessly logged into your UrbanRealities account.</li>
              </ul>
            </div>
          </div>
          <div className='col-lg-8 login-col'>
            <div className='row'>
              <div className="col-lg-5 m-auto col-md-6 col-sm-12 form-wraper">
                <div className="sign-up-wrapper">
                  <span className="gradient-text-mb-wrape">Urbanrealities</span>
                  <h1 className="mt-3">Login your account</h1>
                  <p>Continue your journey with UrbanRealities</p>
                </div>
                <form className="form" onSubmit={HandleSubmit}>

                  <label htmlFor="email"><h1>Email/Phone Number</h1>
                    <input id="email" type="text" name="email" value={formData.email} onChange={HandleChange} placeholder="Enter Email" />
                  </label>

                  <label htmlFor="password"><h1>Password</h1>
                    <input id="password" type="password" name="password" value={formData.password} onChange={HandleChange} placeholder="Password" />
                  </label>
                  <button className="login-btn">
                    <span>Login</span>
                  </button>

                </form>
                <div className="info-wraper">
                  <Link ><h2>Don't have an account?</h2></Link>
                  <a
                    href={`${WEBSITE_WEB_URL}/auth/login/register`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <h2 className="sign-up">Sign Up</h2>
                  </a>

                </div>
                <div className="info-wraper">
                  <Link ><h2>Troubleshoot?</h2></Link>
                  <a
                    href={`${WEBSITE_WEB_URL}/auth/forgot-password`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <h2 className="sign-up"> Forgot Password</h2>
                  </a>
                </div>
                <div className="shape-wraper">
                  <img src={shape} alt="shape" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='login-botton-section'>
        <h2><a>Urbanrealities</a></h2>
        <p>Find your dream house</p>
      </div>

      {/* 🚀 Unauthorized Modal */}
      {showUnauthorizedModal && (
        <div className="unauth-modal-backdrop">
          <div className="unauth-modal">
            <h2>Unauthorized Access</h2>
            <p>
              You are not authorized to access this domain.<br />
              Please login here:
            </p>
            <a
              href="https://owner.urbanrealities.com"
              target="_blank"
              rel="noopener noreferrer"
              className="unauth-btn-link"
            >
              Go to Owner Portal
            </a>
            <button
              onClick={() => setShowUnauthorizedModal(false)}
              className="unauth-btn-close"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </Layout>
  )
}

export default Login
