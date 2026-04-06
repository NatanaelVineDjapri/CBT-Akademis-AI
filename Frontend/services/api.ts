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

// Interceptor - otomatis tambah X-XSRF-TOKEN ke setiap request
api.interceptors.request.use((config) => {
    const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('XSRF-TOKEN='))
        ?.split('=')[1]

    if (token) {
        config.headers['X-XSRF-TOKEN'] = decodeURIComponent(token)
    }

    return config
})

export default api