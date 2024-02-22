import React, {useEffect, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {
  Title,
  Img,
  Display,
  InputBox,
  Margin,
} from '../../styles/styledComponent';
import TimePicker from './TimePicker';
import IconDown from '../../assets/image/down_g.png';
import styled from 'styled-components';

const OpeningHours = ({setStartTime, setEndTime, startTime, endTime}) => {
  const [open, setOpen] = useState(false);
  const [timeValue, setTimeValue] = useState();
  const onPressTime = e => {
    setTimeValue(e);
    setOpen(true);
  };

  return (
    <Margin top={5}>
      <Display style={{backgroundColor: '#fff', zIndex: -100}}>
        <InputBox width="37%">
          <TimeBtn onPress={() => onPressTime('start')}>
            <Title color={!startTime ? '#7d7d7d' : '#333'} size={14}>
              {!startTime ? '시간선택' : startTime}
            </Title>
            <Img width={12} source={IconDown} resizeMode="contain" />
          </TimeBtn>
        </InputBox>
        <Title color="#7d7d7d">-</Title>
        <InputBox width="37%">
          <TimeBtn onPress={() => onPressTime('end')}>
            <Title color={!endTime ? '#7d7d7d' : '#333'} size={14}>
              {!endTime ? '시간선택' : endTime}
            </Title>
            <Img width={12} source={IconDown} resizeMode="contain" />
          </TimeBtn>
        </InputBox>
      </Display>
      <TimePicker
        open={open}
        setOpen={setOpen}
        timeValue={timeValue === 'start' ? startTime : endTime}
        setTime={timeValue === 'start' ? setStartTime : setEndTime}
      />
    </Margin>
  );
};

const TimeBtn = styled(TouchableOpacity)`
  width: 100%;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
`;

export default OpeningHours;
