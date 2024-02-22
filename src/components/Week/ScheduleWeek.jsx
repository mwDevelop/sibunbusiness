import dayjs from 'dayjs';
import React, {useEffect, useState} from 'react';
import {View, TouchableOpacity} from 'react-native';
import {styled} from 'styled-components';
import {Title} from '../../styles/styledComponent';

const Weekly = ({day, setDay, value, setValue, setNowTime}) => {
  const [currentDay, setCurrentDay] = useState(dayjs().format('YYYY-MM-DD'));
  const [dayValue, setDayValue] = useState(0);

  useEffect(() => {
    if (value) {
      setDayValue(0);
      setCurrentDay(day);
    }
    setValue(false);
  }, [value === true]);

  function DayofWeek(day) {
    switch (Number(day)) {
      case 1:
        return 'M';
      case 2:
        return 'T';
      case 3:
        return 'W';
      case 4:
        return 'T';
      case 5:
        return 'F';
      case 0:
      case 6:
        return 'S';
    }
  }

  const onPressDate = (index, date) => {
    const dateformat = dayjs(date).format('YYYY-MM-DD');
    setDayValue(index);
    setDay(dateformat);
    setNowTime(dayjs().format('HH'));
  };

  return (
    <Container>
      <Display>
        {Array.from({length: 7}, (value, index) => {
          const colorValue = index === dayValue;
          const date = dayjs(currentDay).add(index, 'day');
          return (
            <Week
              key={index}
              bg={colorValue ? '#444' : '#fff'}
              onPress={() => onPressDate(index, date)}
              activeOpacity={0.8}>
              <Title
                key={index}
                color={colorValue ? '#ffff' : '#BDBDBD'}
                size={13}
                weight={600}>
                {DayofWeek(dayjs(date).format('d'))}
              </Title>
              <Title color={colorValue ? '#ffff' : '#515151'} weight={600}>
                {dayjs(date).format('D')}
              </Title>
            </Week>
          );
        })}
      </Display>
    </Container>
  );
};

const Container = styled(View)`
  padding: 15px 20px;
  background-color: #fff;
`;

const Display = styled(View)`
  display: felx;
  flex-direction: row;
  justify-content: space-between;
  height: 65px;
`;

const Week = styled(TouchableOpacity)`
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 40px;
  background-color: ${props => props.bg};
  border-radius: 9px;
`;

export default Weekly;
