/* axios start */
import axios from 'axios'
import qs from 'qs'
const $axios = axios;
$axios.defaults.baseURL = 'http://localhost:8081/api';
$axios.defaults.withCredentials = true;
$axios.defaults.timeout = 60000;

$axios.interceptors.request.use( config => {
  return config;
}, err => {
  return Promise.reject(err);
});

// http response 服务器响应拦截器，这里拦截错误，并重新跳入登页重新获取token
$axios.interceptors.response.use( response => {
  return response; 
}, err => {
  return Promise.reject(err);
}); 

export default $axios;