import axios from 'axios'

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
    withXSRFToken: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
})

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 && typeof window !== 'undefined') {
            const authPages = ['/login', '/forgot-password', '/reset-password']
            const isAuthPage = authPages.some(p => window.location.pathname.startsWith(p))
            if (!isAuthPage) {
                window.location.href = '/login'
            }
        }
        return Promise.reject(error)
    }
)

export default api
