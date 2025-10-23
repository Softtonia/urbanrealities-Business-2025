import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import React, { useContext, useEffect } from "react";
import MyAccount from "./dashboard/MyAccount";
import BusinessDashboard from "./dashboard/BusinessDashboard";
import BusinessInformation from "./business-form/BusinessInformation";
import Personalinformation from "./business-form/Personalinformation";
import CompanyDetail from "./business-form/CompanyDetail";
import MyProperty from "./Listing/MyProperty";
import { AuthContext } from "./context/MyStore";
import Message from "./message/Message";
import Login from "./auth/Login";
import Ticket from "./ticket/Ticket";
import MyProfile from "./my-profile/MyProfile";
import DocumentDashboard from "./document/DocumentDashboard";
import AllAgent from "./agent/AllAgent";
import AddAgent from "./agent/AddAgent";
import { ToastContainer } from "react-toastify";
import AllRequest from "./request/AllRequest";
import PendingMessage from "./message/PendingMessage";
import AllConsultancy from "./consultancy/AllConsultancy";
import AddConsultancy from "./consultancy/AddConsultancy";
import AllCompanyRequest from "./request/AllCompanyRequest";
import AgentProfile from "./agent/AgentProfile";
import AlertMessage from "./message/AlertMessage";
import NotFound from "./not-found/NotFound";
import AddProject from "./project/AddProject";
import AllProject from "./project/AllProject";
import Company from "./company/Company";
import EditProject from "./project/EditProject";
import AllProperty from "./property/AllProperty";
import AddProperty from "./property/AddProperty";
import EditProperty from "./property/EditProperty";
import Analytics from "./analytics/Analytics";
import AssignProject from "./agent/AssignProject";
import ProjectDetails from "./project-details/ProjectDetails";
import ConsultancyProject from "./consultancy-project/ConsultancyProject";
import RequestProject from "./request-project/RequestProject";
import ManageProjectViewDetail from "./manage-project-view-details/ManageProjectViewDetail";
import AgentConsultancy from "./agent-consultancy/AgentConsultancy";
import AgentConsultancyProject from "./agent-consultancy/AgentConsultancyProject";
import { API_KEY, X_APP_TYPE, X_CLIENT_ID, X_CLIENT_SECRET } from "./config";
import DeveloperList from './developer/DeveloperList';
import AddDeveloper from "./developer/AddDeveloper";
import EditDeveloper from "./developer/EditDeveloper";
import Profile from "./my-profile/Profile";
import LeadList from "./lead/LeadList";



// ✅ Auto-login handler
function AutoLoginHandler() {
  const { setAuth } = useContext(AuthContext);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("authtoken");
    const id = params.get("id");

    const verifyAndLogin = async () => {
      if (token && id) {
        try {
          const response = await fetch(
            `${API_KEY}/api/get-details-byuserid?id=${id}`,
            {
              headers: {
                "X-Client-ID": X_CLIENT_ID,
                "X-Client-Secret": X_CLIENT_SECRET,
                'X-App-Type': X_APP_TYPE,
                Authorization: `Bearer ${token}`, // ✅ send token in headers
              },
            }
          );

          const data = await response.json();
          console.log('==>', data)

          if (response.ok && data) {
            // ✅ construct auth object from response
            const newAuth = {
              id: data.id || id,
              email: data.email || "",
              token,
              phone: data.phone || "",
              is_login: true,
              role: data.role_name,
              user_name: data.user_name || "",
              approved: data.isapproved || "0",
              isapproved: data.isapproved || "0",
              kyc: data.kyc
            };

            localStorage.setItem("auth", JSON.stringify(newAuth));
            setAuth(newAuth);

            // 🚀 Clean URL
            window.history.replaceState({}, "", window.location.pathname);
          } else {
            console.warn("Invalid token or id");
            localStorage.removeItem("auth");
            setAuth({
              id: "",
              email: "",
              token: "",
              phone: "",
              is_login: false,
              role: "",
              user_name: "",
              approved: "",
              isapproved: '',
              kyc: ''
            });
          }
        } catch (err) {
          console.error("Verification failed:", err);
          localStorage.removeItem("auth");
        }
      }
    };

    verifyAndLogin();
  }, [location.search, setAuth]);

  return null;
}


function App() {
  const { auth, loadingAuth } = useContext(AuthContext);
  const { is_login, approved, kyc } = auth;

  const user = JSON.parse(localStorage.getItem("auth"));
  console.log('===', user)
  const privateRoute = (user?.is_login && user.approved === '2' || is_login)
  console.log('==', loadingAuth)
  return (
    <div className="App">
      <Router>
        <AutoLoginHandler />
        {!loadingAuth &&
          <Routes>
            {/* Common routes */}
            <Route path="/my-account/agent-profile/:id" element={<MyAccount />} />
            <Route
              path="/personal-information"
              element={<Personalinformation />}
            />
            <Route path="/company-detail" element={<CompanyDetail />} />
            <Route
              path="/my-account/my-property"
              element={privateRoute ? <MyProperty /> : <Navigate to="/login" />}
            />
            <Route
              path="/my-account/analytics"
              element={privateRoute ? <Analytics /> : <Navigate to="/login" />}
            />
            <Route
              path="/9d9b678aa2c1cd3d89e3506b1de4fc14"
              element={<Message />}
            />
            <Route
              path="/login"
              element={
                auth?.is_login
                  ? <Navigate to="/" replace /> // ✅ Redirect logged-in users away from login
                  : <Login />
              }
            />
            <Route
              path="/my-account/ticket"
              element={privateRoute ? <Ticket /> : <Navigate to="/login" />}
            />
            {
              <Route
                path="/my-account/edit-profile/:id"
                element={privateRoute ? <MyProfile /> : <Navigate to="/login" />}
              />
            }
            {
              <Route
                path="/my-account/my-profile/:id"
                element={privateRoute ? <Profile /> : <Navigate to="/login" />}
              />
            }
            <Route
              path="/my-account/lead"
              element={privateRoute ? <LeadList /> : <Navigate to="/login" />}
            />
            <Route
              path="/my-account/agent"
              element={privateRoute ? <AllAgent /> : <Navigate to="/login" />}
            />
            <Route
              path="/my-account/document"
              element={privateRoute ? <DocumentDashboard /> : <Navigate to="/login" />}
            />
            <Route
              path="/my-account/project-details/:id"
              element={privateRoute ? <ProjectDetails /> : <Navigate to="/login" />}
            />
            <Route
              path="/my-account/add-project"
              element={privateRoute ? <AddProject /> : <Navigate to="/login" />}
            />
            <Route
              path="/my-account/all-project"
              element={privateRoute ? <AllProject /> : <Navigate to="/login" />}
            />
            <Route
              path="/my-account/all-listing"
              element={privateRoute ? <AllProperty /> : <Navigate to="/login" />}
            />
            <Route
              path="/my-account/add-listing"
              element={privateRoute ? <AddProperty /> : <Navigate to="/login" />}
            />
            <Route
              path="/my-account/edit-project/:id"
              element={privateRoute ? <EditProject /> : <Navigate to="/login" />}
            />
            <Route
              path="/my-account/all-developer"
              element={privateRoute ? <DeveloperList /> : <Navigate to="/login" />}
            />
            <Route
              path="/my-account/add-developer"
              element={privateRoute ? <AddDeveloper /> : <Navigate to="/login" />}
            />
            <Route
              path="/my-account/edit-developer/:id"
              element={privateRoute ? <EditDeveloper /> : <Navigate to="/login" />}
            />
            <Route
              path="/my-account/edit-listing/:id"
              element={privateRoute ? <EditProperty /> : <Navigate to="/login" />}
            />
            <Route
              path="/my-account/company"
              element={privateRoute ? <Company /> : <Navigate to="/login" />}
            />
            <Route
              path="/my-account/add-agent"
              element={privateRoute ? <AddAgent /> : <Navigate to="/login" />}
            />
            <Route
              path="/my-account/agent-consultancy"
              element={privateRoute ? <AgentConsultancy /> : <Navigate to="/login" />}
            />
            <Route
              path="/my-account/agent-projects"
              element={privateRoute ? <AgentConsultancyProject /> : <Navigate to="/login" />}
            />
            <Route
              path="/my-account/all-request"
              element={
                auth.role === "consultancy" ? (
                  <AllCompanyRequest />
                ) : (
                  <AllRequest />
                )
              }
            />
            <Route
              path="/my-account/all-consultancy"
              element={<AllConsultancy />}
            />
            <Route path="/add-consultancy" element={<AddConsultancy />} />
            <Route
              path="/my-account/profile-data/:id/:role/:login_id"
              element={<AgentProfile />}
            />
            <Route
              path="/my-account/manage-project"
              element={<AssignProject />}
            />
            <Route
              path="/my-account/consultancy-project"
              element={<ConsultancyProject />}
            />
            <Route
              path="/my-account/manage-project-consultancy"
              element={<RequestProject />}
            />
            <Route
              path="/my-account/manage-project-view-details/:id"
              element={<ManageProjectViewDetail />}
            />

            <Route path="*" element={<NotFound />} />
            {/* Routes based on authentication status */}
            <Route
              path="/"
              element={
                is_login
                  ? String(kyc) === "0"
                    ? <BusinessInformation />
                    : String(kyc) === "1"
                      ? <PendingMessage />
                      : String(kyc) === "2"
                      && <BusinessDashboard />
                  : <Navigate to="/login" />
              }
            />


          </Routes>}
      </Router>
    </div>
  );
}

export default App;
