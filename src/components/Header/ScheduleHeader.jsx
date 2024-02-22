import React from 'react';
import {TouchableOpacity} from 'react-native';
import OpenDrawer from '../Navigation/OpenDrawer';
import Iconclose from '../../assets/image/close.png';
import {Display, Img, Title} from '../../styles/styledComponent';
import {styled} from 'styled-components';

const ScheduleHeader = ({title, navigation, onPressClose}) => {
  return (
    <Header content="space-between">
      <Title size="18" weight="600">
        {title}
      </Title>
      <Btn onPress={() => onPressClose()}>
        <Img source={Iconclose} width={16} />
      </Btn>
    </Header>
  );
};

const Header = styled(Display)`
  height: 60px;
  background-color: #ffffff;
  padding: 0 20px;
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const Btn = styled(TouchableOpacity)`
  position: absolute;
  right: 15px;
`;

export default ScheduleHeader;
