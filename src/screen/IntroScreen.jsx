import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {styled} from 'styled-components';
import {Container, Img} from '../styles/styledComponent';
import IconLogo from '../assets/image/logo.png';
import IconPhone from '../assets/image/phone.png';
const IntroScreen = ({navigation}) => {
  return (
    <Container>
      <Logo>
        <Img source={IconLogo} width={160} resizeMode="contain" />
      </Logo>
      <Bottom>
        <UnderLine></UnderLine>
        <Wrap>
          <Title>회원가입/로그인 3초만에 하기</Title>
        </Wrap>
        <Flex>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('LoginScreen')}>
            <Img source={IconPhone} width={100} resizeMode="contain" />
          </TouchableOpacity>
        </Flex>
      </Bottom>
    </Container>
  );
};

const Flex = styled(View)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Logo = styled(Flex)`
  height: 70%;
`;

const Bottom = styled(View)`
  height: 30%;
`;

const UnderLine = styled(View)`
  border-width: 0.5px;
  border-color: #e8e8e8;
`;

const Wrap = styled(Flex)`
  display: flex;
  align-items: center;
  justify-content: center;

  position: relative;
  top: -13px;

  margin-bottom: 50px;
`;

const Title = styled(Text)`
  background-color: #fff;
  padding: 0px 20px;
`;
export default IntroScreen;
