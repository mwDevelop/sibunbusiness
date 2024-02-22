import React, {useState, useEffect} from 'react';
import {TouchableOpacity, View} from 'react-native';

import IcnMonth from '../../assets/image/month.png';
import {Img, Title} from '../../styles/styledComponent';
import {styled} from 'styled-components';
import OpenDrawer from '../Navigation/OpenDrawer';

const CalendarHeader = ({navigation, getOpenValue, day}) => {
  const [month, setMonth] = useState(day);

  useEffect(() => {
    setMonth(day);
  }, [day]);

  const onPressOpen = () => {
    getOpenValue();
  };

  return (
    <Header>
      <OpenDrawer navigation={navigation} />
      <Title color="#222" size={18} weight="600">
        {Number(month)}월{' '}
      </Title>
      <TouchableOpacity onPress={() => onPressOpen()}>
        <Img width={20} height={22} source={IcnMonth} resizeMode="contain" />
      </TouchableOpacity>
    </Header>
  );
};

const Header = styled(View)`
  height: 65px;
  background-color: #ffffff;
  padding: 20px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  position: relative;
`;

const Display = styled(TouchableOpacity)`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const TEST = styled(View)`
  /* position: absolute;
  right: 10px;
  top: 50px; */
  position: absolute;
  right: 10px;
  top: 50px;
  width: 100%;
`;

export default CalendarHeader;
