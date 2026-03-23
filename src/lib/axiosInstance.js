import axios from "axios"; 

const axiosInstance = axios.create({
    // Use NEXT_PUBLIC_API_BASE from environment if provided, fallback to localhost
    baseURL: process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000/api', 
    timeout: 3636,
    headers: {
        "Content-Type": "application/json"
    }
});

    axiosInstance.interceptors.request.use(  
        (config) =>
        {
            const token = localStorage.getItem("token");

            if (token){
                config.headers.Authorization = `Bearer ${token}`;

            }
            return config;
        },
    
        (error) => {
            return Promise.reject(error);
        }
    );
        axiosInstance.interceptors.response.use(
            (response) => response,

            (error) => {
                const errorData ={
                    Message: error.response?.data?.Message || "server error",
                    status: error.response?.status  ||500,
                    data: error.response?.data || null
                };
                return Promise.reject(errorData);
            }
         );

         export  default axiosInstance;