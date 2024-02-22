import {View} from 'react-native';
import {Calendar} from 'react-native-calendars';

import styled from 'styled-components';
import {useEffect, useState} from 'react';
import {Img, Title, Btn, Wrap} from '../../styles/styledComponent';
import IconLeft from '../../assets/image/arrow_left.png';
import IconRight from '../../assets/image/arrow_right.png';
import {useTheme} from '@react-navigation/native';

import dayjs from 'dayjs';
import {LocaleConfig} from 'react-native-calendars';
import apis from '../../api/apis';

LocaleConfig.locales['fr'] = {
  monthNames: [
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월',
  ],
  monthNamesShort: [
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월',
  ],
  dayNames: [
    '일요일',
    '월요일',
    '화요일',
    '수요일',
    '목요일',
    '금요일',
    '토요일',
  ],
  dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
  today: "Aujourd'hui",
};
LocaleConfig.defaultLocale = 'fr';

const CalendarModal = ({
  setDate,
  setModalOpen,
  value,
  getOpenValue,
  setValue,
  setNowTime,
  storeId,
}) => {
  const {colors} = useTheme();
  const calendarValue = value === 'selectedday';
  const [marked, setMarked] = useState(dayjs().format('YYYY-MM-DD'));
  const [month, setMonth] = useState(dayjs().format('YYYY-MM'));
  const [checkSchedule, setCheckSchedule] = useState();
  const [markedUpdate, setMarkedUpdate] = useState(false);
  function seletedDay(e) {
    setDate(e);
    getOpenValue();
    setValue(true);
    setNowTime(dayjs().format('HH'));
  }

  function periodDay(e) {
    setModalOpen([false, false]);
    setDate(e);
  }

  const onDayPress = e => {
    if (calendarValue) {
      seletedDay(e);
    } else if (value == 'period') {
      periodDay(e);
    }
  };

  const onDayMarked = e => {
    setMarked(e);
    setMarkedUpdate(true);
  };

  function markedList(data) {
    if (data) {
      const monthlist = Object?.keys(data);
      let obj = monthlist?.reduce(
        (c, v) =>
          Object.assign(c, {
            [v]:
              marked === c || marked === v
                ? {marked: true, selected: true}
                : {marked: true},
          }),
        {},
      );
      setCheckSchedule(obj);
      setMarkedUpdate(false);
    }
  }

  useEffect(() => {
    if (value !== 'period') {
      apis.getReservationMonth(storeId, month).then(res => {
        if (res.data.result === '000') {
          markedList(res.data.list);
        } else {
        }
      });
    }
  }, [month, markedUpdate]);

  return (
    <View
      style={{
        backgroundColor: '#fff',
        borderRadius: 10,
        width: value === 'selectedday' ? '100%' : '70%',
        padding: 10,
      }}>
      <Calendar
        firstDay={1}
        monthFormat={'yyyy년 MM월'}
        onMonthChange={month => setMonth(`${month.year}-${month.month}`)}
        onDayPress={day => {
          calendarValue
            ? onDayMarked(day.dateString)
            : onDayPress(day.dateString);
        }}
        markedDates={{
          [marked]: {selected: true},
          ...checkSchedule,
        }}
        markingType={'dotUnder'}
        style={{borderRadius: 15}}
        renderArrow={direction =>
          direction === 'left' ? (
            <Img
              source={IconLeft}
              width={10}
              height={11}
              resizeMode="contain"
            />
          ) : (
            <Img
              source={IconRight}
              width={10}
              height={11}
              resizeMode="contain"
            />
          )
        }
        theme={{
          selectedDayBackgroundColor: colors.mainColor,
          todayBackgroundColor: colors.mainColor,
          todayTextColor: '#fff',
          textMonthFontSize: 18,
          textDayFontSize: 16,
        }}
      />
      {calendarValue ? (
        <BtnWrap>
          <Btn
            width={48}
            height={50}
            bg={'#d7d7d7'}
            radius={5}
            onPress={() => getOpenValue()}>
            <Title>취소</Title>
          </Btn>
          <Btn
            width={48}
            height={50}
            bg={colors.mainColor}
            radius={5}
            onPress={() => onDayPress(marked)}>
            <Title color="#fff">적용</Title>
          </Btn>
        </BtnWrap>
      ) : (
        ''
      )}
    </View>
  );
};

const BtnWrap = styled(Wrap)`
  margin-top: 15px;
  margin-bottom: 10px;
`;

export default CalendarModal;
