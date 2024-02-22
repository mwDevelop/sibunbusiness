import apis from '../api/apis';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert} from 'react-native';

export async function toekenFun() {
  const fcmToken = await messaging().getToken();
  await apis
    .postUser({pt_device_token: fcmToken})
    .then(res => console.log(res.data.result));
}

export async function loginFun(data) {
  let result = '';
  await apis.postLogin(data).then(res => {
    if (res.data.result === '000') {
      const user = res.data;
      result = user;
      AsyncStorage.setItem(
        'userInfo',
        JSON.stringify({...user.user, refresh: user.refresh_token}),
      );
      AsyncStorage.setItem('accessToken', user.access_token);
      AsyncStorage.setItem('refreshToken', user.refresh_token);
    } else {
      result = false;
    }
  });
  return result;
}
