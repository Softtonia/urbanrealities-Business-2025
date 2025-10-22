import axios from 'axios';
import { API_KEY, X_APP_TYPE, X_CLIENT_ID, X_CLIENT_SECRET } from "../config";

const axiosInstance = axios.create({
    baseURL: API_KEY,
    headers: {
        'X-Client-ID': X_CLIENT_ID,
        'X-Client-Secret': X_CLIENT_SECRET,
        'X-App-Type': X_APP_TYPE,
        // 'Origin':"https://admin.urbanrealities.com"

    },
    withCredentials: true, // If using Laravel Sanctum or cookies
});



// for token verifying
axiosInstance.interceptors.request.use(
    (config) => {
        const sessionData = localStorage.getItem('auth');
        if (sessionData) {
            try {
                const parsed = JSON.parse(sessionData);
                console.log('==>', parsed)

                if (parsed.token) {
                    config.headers['Authorization'] = `Bearer ${parsed.token}`;
                }
            } catch (err) {
                console.error('Invalid session auth format', err);
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Clear auth if unauthorized
            localStorage.removeItem("auth");
            window.location.href = "/login"; // force logout + redirect
        }
        return Promise.reject(error);
    }
);


// for global error handling
// axiosInstance.interceptors.response.use(
//     (response) => response,
//     (error) => {
//         if (error.response?.status === 401) {
//             alert('Unauthorized. Please log in.');
//         }
//         return Promise.reject(error);
//     }
// );


export default axiosInstance;
