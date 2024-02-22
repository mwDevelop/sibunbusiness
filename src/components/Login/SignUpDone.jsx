import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {Img, Title} from '../../styles/styledComponent';
import Icon from '../../assets/image/signup.png';
import styled from 'styled-components';
import {useRecoilState} from 'recoil';
import {loginState} from '../../recoil/atom';
import {useTheme} from '@react-navigation/native';

const SignUpDone = ({route}) => {
  const {colors} = useTheme();
  const [, setLogin] = useRecoilState(loginState);

  return (
    <Wrap>
      <ImgWrap>
        <Img source={Icon} width={130} resizeMode="contain" left={5} />
        <Title size={22} color={'#222'} weight={600} top={10}>
          {route.params.state
            ? `${route.params.state}님, 환영합니다.`
            : '환영합니다.'}
        </Title>
      </ImgWrap>
      <Btn onPress={() => setLogin(true)} bg={colors.mainColor}>
        <Title color="#fff" weight={600}>
          확인
        </Title>
      </Btn>
    </Wrap>
  );
};

const Wrap = styled(View)`
  background-color: #fff;
  height: 100%;
  width: 100%;
  padding: 20px;
`;

const ImgWrap = styled(View)`
  display: flex;
  justify-content: center;
  align-items: center;

  height: 600px;
`;

const Btn = styled(TouchableOpacity)`
  width: 100%;
  height: 55px;
  background-color: ${props => props.bg};
  display: flex;
  justify-content: center;
  align-items: center;

  border-radius: 5px;
`;
export default SignUpDone;
