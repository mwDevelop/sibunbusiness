import React from 'react';
import {Display, Img, Title, Header} from '../../styles/styledComponent';
import IconMenu from '../../assets/image/menu.png';
import IconBack from '../../assets/image/arrow_left_b.png';
import IconAdd from '../../assets/image/+.png';
import {TouchableOpacity} from 'react-native';
import {styled} from 'styled-components';

const NavigationHeader = ({navigation, title, value}) => {
  const drawer = value === 'drawer';
  const btnNone =
    title === '매장선택' || title === '로그인' || title === '회원가입';

  const HIT_SLOP = {top: 20, left: 20, right: 20, bottom: 20};

  return (
    <HeaderWrap>
      {btnNone ? (
        ''
      ) : (
        <Btn
          onPress={() => {
            drawer ? navigation.openDrawer() : navigation.goBack();
          }}
          hitSlop={HIT_SLOP}>
          <Img
            width={drawer ? 25 : 20}
            source={drawer ? IconMenu : IconBack}
            resizeMode="contain"
          />
        </Btn>
      )}
      <Title
        color="#222"
        weight="600"
        size="18"
        style={{justifyContent: 'center'}}>
        {title}
      </Title>
      {title === '방 수정' ? (
        <AdddBtn onPress={() => navigation.navigate('AddRoomScreen')}>
          <Img width={18} source={IconAdd} resizeMode="contain" />
        </AdddBtn>
      ) : (
        ''
      )}
    </HeaderWrap>
  );
};

const HeaderWrap = styled(Header)`
  display: flex;
  flex-direction: row;
  justify-content: center;
  border-bottom-width: 1px;
  border-color: #efefef;
  height: 65px;
`;

const Btn = styled(TouchableOpacity)`
  position: absolute;
  left: 20px;
`;

const AdddBtn = styled(TouchableOpacity)`
  position: absolute;
  right: 15px;
`;

export default NavigationHeader;
