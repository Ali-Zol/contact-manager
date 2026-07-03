const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000'

// Token management
export const getToken = () => localStorage.getItem('access_token')
export const setToken = (token) => localStorage.setItem('access_token', token)
export const removeToken = () => localStorage.removeItem('access_token')

// Generic request function with automatic authentication
async function request(endpoint, method = 'GET', body = null, auth = true)
{
  const headers = { 'Content-Type': 'application/json' }
  if (auth)
  {
    const token = getToken()
    if (!token)
      throw new Error('No token')
    
    headers['Authorization'] = `Bearer ${token}`
  }

  const options = { method, headers }
  
  if (body)
    options.body = JSON.stringify(body)

  const res = await fetch(`${API_BASE}${endpoint}`, options)
  
  if (!res.ok)
  {
    const error = await res.json().catch(() => ({ detail: 'Unknown error' }))
    throw new Error(error.detail || `HTTP ${res.status}`)
  }

  if (res.status === 204)
    return null
  
  return res.json()
}

// API functions for each resource
export const api = {
  // Authentication
  login: (username, password) => request('/auth/login', 'POST', { username, password }, false),
  register: (username, password) => request('/auth/register', 'POST', { username, password }, false),

  // Contacts
  getContacts: (params = {}) => {
    const query = new URLSearchParams(params).toString()
    return request(`/contacts/${query ? '?' + query : ''}`)
  },
  createContact: (data) => request('/contacts/', 'POST', data),
  updateContact: (id, data) => request(`/contacts/${id}`, 'PUT', data),
  deleteContact: (id) => request(`/contacts/${id}`, 'DELETE'),

  // Categories
  getCategories: () => request('/categories/'),
  createCategory: (name) => request('/categories/', 'POST', { name }),
  deleteCategory: (id) => request(`/categories/${id}`, 'DELETE'),
}