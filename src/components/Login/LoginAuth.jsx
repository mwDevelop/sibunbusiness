import React, {useEffect, useState} from 'react';
import {View, TouchableOpacity, Alert} from 'react-native';

import {Title, LoginInput} from '../../styles/styledComponent';
import styled from 'styled-components/native';
import apis from '../../api/apis';

import {useRecoilState, useRecoilValue} from 'recoil';
import {userState, loginState, tokenState} from '../../recoil/atom';
import {loginFun, toekenFun} from '../../utils/toekenFun';

const LoginAuth = ({run, setIdx, navigation, setData, setRun}) => {
  const [phone, setPhone] = useState();
  const [auth, setAuth] = useState();
  const [, setUser] = useRecoilState(userState);
  const [, setLogin] = useRecoilState(loginState);
  const messagingtoken = useRecoilValue(tokenState);

  useEffect(() => {
    if (run === 1) {
      onPressCheck();
    }
  }, [run]);

  const onPressSend = async phone => {
    const data = {
      receiver_cellphone: `${phone}`,
    };

    if (!phone || phone?.length < 11) {
      Alert.alert('핸드폰 번호를 입력해주세요.');
    } else {
      apis.postSendsms(data).then(res => {
        Alert.alert('인증번호가 발송되었습니다.');
      });
    }
  };

  async function saveLogin() {
    const data = {pt_cellphone: phone};
    const login = await loginFun(data);
    if (login) {
      setLogin(true);
      setUser(login?.user);

      if (messagingtoken) {
        toekenFun();
      }
      Alert.alert('인증완료되었습니다.');
      setTimeout(() => {
        navigation.navigate('StorelistScreen');
      }, 2000);
    } else {
      Alert.alert('회원가입을 해주세요.');
      setIdx(2);
      setData(phone);
      setRun(null);
    }
  }

  const onPressCheck = async () => {
    if (auth !== null) {
      const authdata = {
        receiver_cellphone: phone,
        auth_code: auth,
      };
      await apis.postAuthCheck(authdata).then(res => {
        if (res.data.result === '000') {
          saveLogin();
        } else {
          Alert.alert('인증번호가 잘못되었습니다.');
          setRun(null);
          setPhone('');
          setAuth('');
        }
      });
    }
  };

  return (
    <View>
      <LoginInput
        placeholder="휴대폰 번호 입력"
        onChangeText={e => setPhone(e)}
        value={phone}
        name="phone"
        placeholderTextColor="#969696"
        inputMode="tel"
      />

      <View>
        <LoginInput
          placeholder="인증번호"
          onChangeText={e => setAuth(e)}
          value={auth}
          name="auth"
          keyboardType="number-pad"
          returnKeyType="done"
          placeholderTextColor="#969696"
          onEndEditing={() => console.log('4자리 입력')}
        />
        <Btn onPress={() => onPressSend(phone)}>
          <Title color="#444" size={14}>
            인증번호 발송
          </Title>
        </Btn>
      </View>
    </View>
  );
};

const Btn = styled(TouchableOpacity)`
  border-width: 1px;
  border-color: #d9d9d9;
  border-radius: 50px;
  background-color: #fff;

  width: 100px;
  padding: 6px 0px;

  display: flex;
  align-items: center;
  justify-content: center;

  position: absolute;
  right: 15px;
  top: 12px;
`;
export default LoginAuth;
