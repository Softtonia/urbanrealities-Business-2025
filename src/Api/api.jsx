import axiosInstance from './axios'

export const get = (url, config = {}) => axiosInstance.get(url, config);
export const post = (url, data, config = {}) => axiosInstance.post(url, data, config);
export const put = (url, data, config = {}) => axiosInstance.put(url, data, config);
export const del = (url, config = {}) => axiosInstance.delete(url, config);
