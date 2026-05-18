import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
});

// Attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-refresh token on 401
API.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refresh = localStorage.getItem('refresh_token');
      if (refresh) {
        try {
          const { data } = await axios.post(
            `${process.env.REACT_APP_API_URL || 'http://localhost:8000/api'}/auth/refresh/`,
            { refresh }
          );
          localStorage.setItem('access_token', data.access);
          original.headers.Authorization = `Bearer ${data.access}`;
          return API(original);
        } catch {
          localStorage.clear();
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const registerUser = (data) => API.post('/auth/register/', data);
export const loginUser = (data) =>
  axios.post(`${process.env.REACT_APP_API_URL || 'http://localhost:8000/api'}/auth/login/`, data);

// User endpoints
export const getMe = () => API.get('/users/me/');
export const updateMe = (data) => API.put('/users/me/', data);

// Post endpoints
export const getPosts = (params) => API.get('/posts/', { params });
export const getPost = (id) => API.get(`/posts/${id}/`);
export const createPost = (data) => API.post('/posts/', data);
export const updatePost = (id, data) => API.put(`/posts/${id}/`, data);
export const deletePost = (id) => API.delete(`/posts/${id}/`);

// Comment endpoints
export const getComments = (postId) => API.get('/comments/', { params: { post: postId } });
export const createComment = (data) => API.post('/comments/', data);
export const updateComment = (id, data) => API.put(`/comments/${id}/`, data);
export const deleteComment = (id) => API.delete(`/comments/${id}/`);

export default API;
