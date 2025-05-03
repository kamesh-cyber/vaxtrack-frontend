import axios from 'axios';

const REACT_APP_BASE_URL = "http://localhost:3001";

const apiClient = axios.create({
  baseURL: REACT_APP_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
});

export const _get = (url, config) => apiClient.get(url, config);
export const _post = (url, data, config) => apiClient.post(url, data, config);
export const _put = (url, data, config) => apiClient.put(url, data, config);
export const _delete = (url, config) => apiClient.delete(url, config);

export default apiClient;