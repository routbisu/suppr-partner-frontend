import axios from 'axios';
import { apiDetails } from '../config';
import auth from '../services/authService';

const http = axios.create({
  baseURL: apiDetails.baseUrl,
  timeout: 10000
});

const getAxiosConfig = () => {
  return { headers: { Authorization: 'Bearer ' + auth.getAuthToken() } };
};

export const httpGet = async url => {
  return await http.get(url, getAxiosConfig());
};

export const httpPost = async (url, data) => {
  return await http.post(url, data, getAxiosConfig());
};

export const httpPut = async (url, data) => {
  return await http.put(url, data, getAxiosConfig());
};

export const httpPatch = async (url, data) => {
  return await http.patch(url, data, getAxiosConfig());
};

export const httpDelete = async (url, data) => {
  return await http.delete(url, getAxiosConfig());
};

export default http;
