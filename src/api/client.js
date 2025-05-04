import axios from 'axios';
import { showLoading } from '../utils/common';

const REACT_APP_BASE_URL = "http://localhost:3001";

const apiClient = axios.create({
  baseURL: REACT_APP_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
});

export const _get = async (url, config) =>{ showLoading(true); const resp = await apiClient.get(url, config); showLoading(false); return resp; }
export const _post = async (url, data, config) => { showLoading(true); const resp = await apiClient.post(url, data, config); showLoading(false); return resp; }
export const _patch = async (url, data, config) => { showLoading(true); const resp = await apiClient.patch(url, data, config); showLoading(false); return resp; }
export const _put = (url, data, config) => { showLoading(true); apiClient.put(url, data, config); showLoading(false);}
export const _delete = (url, config) => { showLoading(true); apiClient.delete(url, config); showLoading(false);}

export default apiClient;