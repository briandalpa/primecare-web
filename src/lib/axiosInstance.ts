import axios from "axios"

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
})

/**
 * Attach auth token automatically
 */
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token")

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

/**
 * Handle unauthorized
 */
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("auth_token")
      window.location.href = "/admin/login"
    }

    return Promise.reject(error)
  }
)

export default axiosInstance