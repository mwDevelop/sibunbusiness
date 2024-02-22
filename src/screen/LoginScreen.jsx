import React, {useState} from 'react';
import {
  TouchableOpacity,
  KeyboardAvoidingView,
  Modal,
  Platform,
  View,
} from 'react-native';
import {Container, Display, Img, Title} from '../styles/styledComponent';
import styled from 'styled-components/native';
import IconArrow from '../assets/image/arrow_r_b.png';
import LoginAuth from '../components/Login/LoginAuth';
import Signup from '../components/Login/Signup';
import {useTheme} from '@react-navigation/native';

import TermsofUse from '../components/TermsofUse/TermsofUse';

const LoginScreen = ({navigation}) => {
  const {colors} = useTheme();
  const [idx, setIdx] = useState(1);
  const [run, setRun] = useState(null);
  const [signUp, setSignUp] = useState(false);
  const [phone, setPhone] = useState();

  const [isModalVisible, setIsModalVisible] = useState(false);

  const onPressNext = e => {
    setRun(e);
  };

  const getData = e => {
    setIdx(e);
  };

  const onPressSignup = () => {
    setIsModalVisible(true);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{
        backgroundColor: '#fff',
        paddingTop: 70,
        position: 'relative',
        paddingBottom: 300,
      }}>
      <Login>
        <Display content="space-between" bottom={30}>
          <Title color="#222" size={25} weight={600}>
            정보를 {'\n'}
            입력해주세요
          </Title>
          <Title color={colors.mainColor} size={16} weight={500}>
            {idx}{' '}
            <Title color="#7d7d7d" size={16} weight={500}>
              / 3
            </Title>
          </Title>
        </Display>
        {idx === 1 ? (
          <LoginAuth
            run={run}
            setIdx={setIdx}
            navigation={navigation}
            setData={setPhone}
            setRun={setRun}
          />
        ) : (
          <Signup
            idx={idx}
            getData={getData}
            setRun={setRun}
            signUp={signUp}
            phone={phone}
            run={run}
            navigation={navigation}
          />
        )}
      </Login>
      {idx === 3 ? (
        <Modal
          presentationStyle="overFullScreen"
          animationType="slide"
          visible={isModalVisible}
          statusBarTranslucent={true}
          transparent={true}>
          <Bg>
            <Wrap>
              <TermsofUse
                setSignUp={setSignUp}
                setIsModalVisible={setIsModalVisible}
              />
            </Wrap>
          </Bg>
        </Modal>
      ) : (
        ''
      )}
      <NextBtn
        activeOpacity={0.8}
        onPress={() => {
          idx === 3 ? onPressSignup() : onPressNext(idx);
        }}>
        <Display>
          <Title color="#222" right={12}>
            {idx === 3 ? '완료' : '다음'}
          </Title>
          <Img source={IconArrow} width={14} resizeMode="contain" />
        </Display>
      </NextBtn>
    </KeyboardAvoidingView>
  );
};

const Login = styled(Container)`
  padding: 0px 20px;
`;

const Bg = styled(View)`
  height: 100%;
  background-color: rgba(0, 0, 0, 0.2);
`;

const Wrap = styled(View)`
  position: absolute;

  width: 100%;

  bottom: 0px;
  z-index: 500;
`;

const NextBtn = styled(TouchableOpacity)`
  position: absolute;
  right: 15px;
  bottom: 80px;
`;

export default LoginScreen;

//  {/* <Btn onPress={() => navigation.navigate('SignUpScreen')}>
//         <Text>회원가입</Text>
//       </Btn> */}

//       {value ? (
//         <>
//           <TextInput
//             placeholder="전화전호를 입력해주세요!"
//             onChange={onChangePhone}
//             keyboardType="number-pad"
//             style={{marginBottom: 20, marginTop: 20}}
//           />
//           <TouchableOpacity onPress={() => onPressSend(phone)}>
//             <Text>확인</Text>
//           </TouchableOpacity>

//           {alert ? (
//             <Wrap>
//               <TextInput
//                 placeholder="인증번호를 입력해주세요"
//                 onChange={onChangeAuth}
//                 keyboardType="number-pad"
//               />
//               <TouchableOpacity onPress={() => onPressCheck()}>
//                 <Text>확인</Text>
//               </TouchableOpacity>
//             </Wrap>
//           ) : (
//             ''
//           )}
//         </>
//       ) : (
//         <Btn onPress={() => setValue(true)}>
//           <Text>로그인</Text>
//         </Btn>
//       )}
