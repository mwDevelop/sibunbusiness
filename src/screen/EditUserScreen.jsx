import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import Signup from '../components/Login/Signup';
import SignUpScreen from './SignUpScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomBtn from '../components/BottomBtn/BottomBtn';
import apis from '../api/apis';

const EditUserScreen = ({navigation}) => {
  const [userInfo, setUserInfo] = useState();
  const [editValue, setEditValue] = useState(false);
  useEffect(() => {
    apis.getUser().then(res => {
      if (res.data.result === '000') {
        setUserInfo(res.data.data);
      }
    });
  }, []);

  const onPressMember = () => {
    setEditValue(true);
  };
  return (
    <View>
      {userInfo && (
        <SignUpScreen
          navigation={navigation}
          data={userInfo}
          editValue={editValue}
          setEditValue={setEditValue}
        />
      )}
      <BottomBtn title={'수정하기'} onPress={onPressMember} bottom={60} />
    </View>
  );
};

export default EditUserScreen;
