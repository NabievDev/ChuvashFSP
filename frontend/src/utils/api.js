import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token')
      window.location.href = '/admin/login'
    }
    return Promise.reject(error)
  }
)

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  me: () => api.get('/auth/me'),
}

export const newsAPI = {
  getAll: (params) => api.get('/news', { params }),
  getOne: (id) => api.get(`/news/${id}`),
  create: (data) => api.post('/news', data),
  update: (id, data) => api.put(`/news/${id}`, data),
  delete: (id) => api.delete(`/news/${id}`),
}

export const eventsAPI = {
  getAll: (params) => api.get('/events', { params }),
  getUpcoming: (limit = 5) => api.get('/events/upcoming', { params: { limit } }),
  getOne: (id) => api.get(`/events/${id}`),
  create: (data) => api.post('/events', data),
  update: (id, data) => api.put(`/events/${id}`, data),
  delete: (id) => api.delete(`/events/${id}`),
}

export const documentsAPI = {
  getCategories: () => api.get('/documents/categories'),
  getCategory: (id) => api.get(`/documents/categories/${id}`),
  createCategory: (data) => api.post('/documents/categories', data),
  updateCategory: (id, data) => api.put(`/documents/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/documents/categories/${id}`),
  getAll: (params) => api.get('/documents', { params }),
  upload: (formData) => api.post('/documents', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => api.delete(`/documents/${id}`),
}

export const teamAPI = {
  getAll: (params) => api.get('/team', { params }),
  getOne: (id) => api.get(`/team/${id}`),
  create: (data) => api.post('/team', data),
  update: (id, data) => api.put(`/team/${id}`, data),
  delete: (id) => api.delete(`/team/${id}`),
}

export const leadershipAPI = {
  getAll: (params) => api.get('/leadership', { params }),
  getOne: (id) => api.get(`/leadership/${id}`),
  create: (data) => api.post('/leadership', data),
  update: (id, data) => api.put(`/leadership/${id}`, data),
  delete: (id) => api.delete(`/leadership/${id}`),
}

export const contactAPI = {
  send: (data) => api.post('/contact', data),
  getAll: (params) => api.get('/contact', { params }),
  markRead: (id) => api.put(`/contact/${id}/read`),
  delete: (id) => api.delete(`/contact/${id}`),
}

export const infoAPI = {
  get: () => api.get('/info'),
}

export default api
