import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { getLocalAccessToken, getLocalRefreshToken } from "./authService";
import decode from 'jwt-decode';
const axiosClient = axios.create({
  baseURL:
    process.env.ENVIRONMENT === 'PRODUCTION'
      ? process.env.REACT_APP_BASE_URL_API_PRODUCTION
      : process.env.REACT_APP_BASE_URL_API,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor
axiosClient.interceptors.request.use(function (config: AxiosRequestConfig) {
    // Do something before request is sent
    let token = localStorage.getItem("access_token");
    if(token)
    token = token.substring(1, token.length - 1);
        config.headers = {
          authorization: token ? `Bearer ${token}` :'',
        };
    
   
    return config;
  }, function (error) {
    // Do something with request error
    console.log(error)
    return  Promise.reject(error);
  });

// Add a response interceptor
axiosClient.interceptors.response.use(
  function (response: AxiosResponse) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response.data;
  },
  async function (error) {
    const originalConfig = error.config;
    if (error.response) {
      if (
        error.response.status === 403 &&
        !originalConfig._retry &&
        error.response.status === 401
      ) {
        originalConfig._retry = true;
        try {
          const rs = await refreshToken();
          const { accessToken } = rs?.data;
          localStorage.setItem('access_token', accessToken);
          axiosClient.defaults.headers.common['authorization'] = `Bearer ${accessToken}`;

          return axiosClient(originalConfig);
        } catch (_error) {
          console.log(_error);
        }
      }
      if (
        error.response.status !== 200 &&
        error.response.status !== 401 &&
        error.response.status !== 403
      ) {
        // Do something
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);
function refreshToken() {
  const token = getLocalAccessToken();
  const decoded: any = decode(token);
  const dateNow = new Date();
  if (decoded.exp < dateNow.getTime() / 1000) {
     return axiosClient.post('/auth/refreshtoken', {
       refreshToken: getLocalRefreshToken(),
     });
  } 
}
export default axiosClient;