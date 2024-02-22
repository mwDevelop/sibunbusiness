import React, {useEffect, useState} from 'react';
import {
  LoginInput,
  Btn,
  Wrap,
  Title,
  Container,
  Display,
  Img,
} from '../../styles/styledComponent';
import {Alert, TextInput, TouchableOpacity, View} from 'react-native';
import {styled} from 'styled-components';
import Dropdown from '../Dropdown/Dropdown';
import IconDown from '../../assets/image/down.png';
import apis from '../../api/apis';

import {useTheme} from '@react-navigation/native';

import {useRecoilState} from 'recoil';
import {userState} from '../../recoil/atom';
import {loginFun} from '../../utils/toekenFun';

const Signup = ({idx, getData, run, signUp, phone, setRun, navigation}) => {
  const {colors} = useTheme();
  const [, setUser] = useRecoilState(userState);
  const [open, setOpen] = useState(false);

  const [name, setName] = useState();
  const [birth, setBirth] = useState();
  const [emailId, setEmailId] = useState();
  const [email, setEmail] = useState(0);
  const [gender, setGender] = useState();
  const genderlist = [
    {title: '남자', value: 'm'},
    {title: '여자', value: 'w'},
  ];

  const dropdownData = [
    {title: 'naver.com', value: 'naver.com'},
    {title: 'hanmail.net', value: 'hanmail.net'},
    {title: 'daum.net', value: 'daum.net'},
    {title: 'gmail.com', value: 'gmail.com'},
    {title: '직접입력', value: 'input'},
  ];

  let randomStr = Math.random().toString(36).substring(2, 12);

  async function saveLogin() {
    const data = {pt_cellphone: phone};
    const login = await loginFun(data);
    if (login) {
      setUser(login?.user);
      setOpen(false);
      setTimeout(() => {
        navigation.navigate('SignUpDone', {state: name});
      }, 1000);
    } else {
      Alert.alert('로그인에 오류가 발생했습니다!');
    }
  }

  function onPressMember() {
    const data = {
      pt_id: randomStr,
      pt_passwd: randomStr,
      pt_name: name,
      pt_cellphone: phone,
    };

    emailId ? (data.pt_email = `${emailId}@${email}`) : '';
    birth ? (data.pt_birth = birth) : '';
    gender ? (data.gender = gender) : '';

    apis.putUser(data).then(res => {
      if (res.data.result === '000') {
        Alert.alert('회원가입이 완료되었습니다.');
        saveLogin();
      } else {
        Alert.alert('오류가 발생했습니다!');
        navigation.navigate('SignUpDone', {state: name});
      }
    });
  }

  useEffect(() => {
    if (run === idx) {
      if (!name) {
        Alert.alert('이름을 입력해주세요');
      } else {
        getData(3);
      }
    }

    if (signUp) {
      onPressMember();
    }
  }, [run === idx, signUp]);

  const onPressDown = () => {
    setOpen(!open);
  };

  const getDataEmail = () => {};

  return (
    <Container>
      {idx === 2 ? (
        <>
          <LoginInput
            placeholder="이름"
            onChangeText={e => setName(e)}
            value={name}
            name="name"
            placeholderTextColor="#969696"
          />
          <LoginInput
            placeholderTextColor="#969696"
            placeholder="8자리 예)19940106"
            onChangeText={e => setBirth(e)}
            value={birth}
            name="birth"
          />
          <Wrap>
            {genderlist.map((i, k) => {
              const checkValue = gender === i.value;
              return (
                <Box
                  width={49}
                  key={k}
                  activeOpacity={0.8}
                  color={checkValue ? colors.mainColor : '#d9d9d9;'}
                  onPress={() => setGender(i.value)}>
                  <Title
                    color={checkValue ? colors.mainColor : '#222'}
                    size={15}
                    weight={400}>
                    {i.title}
                  </Title>
                </Box>
              );
            })}
          </Wrap>
        </>
      ) : (
        <Display content="space-between">
          <LoginInput
            width={45}
            placeholder="이메일"
            onChangeText={e => setEmailId(e)}
            value={emailId}
            name="emailId"
            placeholderTextColor="#969696"
            inputMode="email"
          />
          <Title>@</Title>
          <Selected activeOpacity={0.8} onPress={() => setOpen(!open)}>
            {email === 'input' ? (
              <Directly />
            ) : (
              <Title color="#444" weight={400} size={14}>
                {email === 0 ? '선택' : email}
              </Title>
            )}

            <Img source={IconDown} width={10} resizeMode="contain" />
          </Selected>
          {open ? (
            <DropdownWrap>
              <Dropdown
                data={dropdownData}
                width={100}
                setData={setEmail}
                onPressDown={onPressDown}
                getData={getDataEmail}
                align="flex-start"
              />
            </DropdownWrap>
          ) : (
            ''
          )}
        </Display>
      )}
    </Container>
  );
};

const Box = styled(Btn)`
  height: 50px !important;
  background-color: #fff;
  border-width: 1px;
  border-color: ${props => props.color || '#d9d9d9'};
  border-radius: 5px;
`;

const DropdownWrap = styled(View)`
  width: 45%;
  position: absolute;
  right: 0px;
  top: -1px;
`;

const Selected = styled(TouchableOpacity)`
  width: 45%;
  height: 55px;
  border-radius: 5px;
  margin-bottom: 10px;
  padding: 0px 18px;

  border: 1px solid #d9d9d9;

  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const Directly = styled(TextInput)`
  width: 100%;
  height: 100%;
`;

export default Signup;
