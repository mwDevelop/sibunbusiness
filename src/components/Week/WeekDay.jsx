import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import {Display, Title} from '../../styles/styledComponent';
import {styled} from 'styled-components';
import {useTheme} from '@react-navigation/native';

const WeekDay = ({day, setDay}) => {
  const {colors} = useTheme();
  const days = [
    {title: '월', value: '1'},
    {title: '화', value: '2'},
    {title: '수', value: '3'},
    {title: '목', value: '4'},
    {title: '금', value: '5'},
    {title: '토', value: '6'},
    {title: '일', value: '7'},
  ];

  const onPressDay = e => {
    if (day?.includes(e)) {
      console.log(day);
      const filter = day?.filter(el => el !== e);
      setDay(filter);
    } else {
      setDay([...day, e]);
    }
  };

  return (
    <WeekWrap>
      {days.map((i, k) => {
        const dayCheck = day?.includes(i?.value);
        return (
          <Btn
            bg={dayCheck ? 'rgba(243, 53, 98, 0.05)' : '#fff'}
            color={dayCheck ? colors.mainColor : '#d7d7d7dd'}
            key={k}
            onPress={() => onPressDay(i?.value)}>
            <Title
              color={dayCheck ? colors.mainColor : '#d7d7d7'}
              size={14}
              weight={400}>
              {i.title}
            </Title>
          </Btn>
        );
      })}
    </WeekWrap>
  );
};

const WeekWrap = styled(Display)`
  flex-wrap: wrap;
  justify-content: space-between;
`;

const Btn = styled(TouchableOpacity)`
  width: 12%;
  height: 60px;
  border-radius: 5px;

  padding: 5px 0px;

  display: flex;
  justify-content: center;
  align-items: center;

  border-color: ${props => props.color};
  background-color: ${props => props.bg};
  border-width: 1px;
`;

export default WeekDay;
