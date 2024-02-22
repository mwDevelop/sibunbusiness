import React, {useState} from 'react';
import DatePicker from 'react-native-date-picker';
import {View} from 'react-native';
import dayjs from 'dayjs';
const TimePicker = ({open, setOpen, setTime, timeValue}) => {
  const getTimeData = time => {
    const timeformate = dayjs(time).format('HH:mm');
    setTime(timeformate);
    setOpen(false);
  };

  return (
    <View>
      <DatePicker
        modal
        open={open}
        mode="time"
        date={new Date()}
        minuteInterval={30}
        onConfirm={date => {
          setOpen(!open);
          getTimeData(date);
        }}
        onCancel={() => {
          setOpen(!open);
        }}
      />
    </View>
  );
};

export default TimePicker;
