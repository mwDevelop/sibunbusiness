import React from 'react';
import {TouchableOpacity} from 'react-native';
import {styled} from 'styled-components';
import {Header, Title, Img} from '../../styles/styledComponent';
import IconSetting from '../../assets/image/editinfo.png';
import {useNavigation} from '@react-navigation/native';
const StoreListHeader = ({onPressEdit, edit, btnvalue}) => {
  const navigation = useNavigation();
  return (
    <HeaderWrap>
      <EditBtn onPress={() => navigation.navigate('EditUserScreen')}>
        <Img width={22} source={IconSetting} resizeMode="contain" />
        <Title color="#000" left={3} size={14}>
          정보수정
        </Title>
      </EditBtn>
      <Title
        color="#222"
        weight="600"
        size="18"
        style={{justifyContent: 'center'}}>
        매장선택
      </Title>
      {btnvalue ? (
        ''
      ) : (
        <Button
          onPress={() => onPressEdit()}
          hitSlop={{top: 32, bottom: 32, left: 32, right: 32}}>
          <Title color="#444" weight="400" size="14">
            {edit ? '취소' : '편집'}
          </Title>
        </Button>
      )}
    </HeaderWrap>
  );
};

const HeaderWrap = styled(Header)`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const Button = styled(TouchableOpacity)`
  position: absolute;
  right: 0px;
`;

const EditBtn = styled(TouchableOpacity)`
  position: absolute;
  left: 0px;

  display: flex;
  flex-direction: row;
  align-items: center;
`;
export default StoreListHeader;
