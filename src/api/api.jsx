import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const api = axios.create({
  // baseURL: 'http://sibun.co.kr/apip',
  baseURL: 'http://sibun.kr/apip',
});

export const instance = axios.create({
  // baseURL: 'http://sibun.co.kr/apip',
  baseURL: 'http://sibun.kr/apip',
});

instance.interceptors.request.use(async config => {
  const accessToken = await AsyncStorage.getItem('accessToken');
  const refreshToken = await AsyncStorage.getItem('refreshToken');
  config.headers.Authorization = `Bearer ${accessToken}`;
  config.headers.refreshToken = `Bearer ${refreshToken}`;
  return config;
});

instance.interceptors.response.use(
  async response => {
    const {config} = response;
    const originalRequest = config;
    const result = response?.data?.result;
    if (result === '020') {
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      return api
        .get(`/auth/refresh`, {
          headers: {Authorization: `Bearer ${refreshToken}`},
        })
        .then(async res => {
          const result = res?.data;
          if (result?.result === '000') {
            AsyncStorage.setItem('accessToken', result?.access_token);
            AsyncStorage.setItem('refreshToken', result.refresh_token);
            originalRequest.headers[
              'Authorization'
            ] = `Bearer ${result?.access_token}`;
            return axios(originalRequest);
          } else {
            AsyncStorage.setItem('refresh', res?.data?.result);
            const keys = ['accessToken', 'refreshToken', 'userInfo'];
            await AsyncStorage.multiRemove(keys);
          }
        })
        .catch(err => {
          console.log(err);
        });
    }

    return response;
  },
  async error => {
    console.log(error);
    throw error;
  },
);
