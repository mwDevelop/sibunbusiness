import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  SafeAreaView,
  Modal,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {useRecoilValue} from 'recoil';
import {storeIdState, storeState} from './../recoil/atom';
import {useQuery} from 'react-query';
import {Hour} from '../utils/TimeCalculation';
import apis from '../api/apis';
import dayjs from 'dayjs';

import ScheduleWeek from '../components/Week/ScheduleWeek';
import CalendarHeader from '../components/Header/CalendarHeader';

import {styled} from 'styled-components';
import {Display, Title, ModalBg, Img} from '../styles/styledComponent';

import ScheduleList from '../components/Schedule/ScheduleList';
import CalendarModal from '../components/calendar/CalendarModal';

import IconBarcode from '../assets/image/barcode_scan.png';
import QRCodeScanner from '../components/QRcode/QRCodeScanner';
import {useTheme} from '@react-navigation/native';
import QRCode from '../components/QRcode/QRCode';

const ScheduleScreen = ({navigation, route}) => {
  const {colors} = useTheme();
  const [value, setValue] = useState(false);
  const [day, setDay] = useState(dayjs().format('YYYY-MM-DD'));
  const [nowTime, setNowTime] = useState(dayjs().format('HH'));
  const [modalVisible, setModalVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const storeId = useRecoilValue(storeIdState);
  const storeInfo = useRecoilValue(storeState);

  const scrollViewRef = useRef(null);
  const openTime = Hour(storeInfo?.open);
  const time = Hour(storeInfo?.close) - Hour(storeInfo?.open);

  useEffect(() => {
    const arr = [];
    Array.from({length: time}, (value, index) => {
      return arr.push(openTime + index);
    });
    if (scrollViewRef.current) {
      const index = arr.indexOf(Number(nowTime));

      scrollViewRef.current.scrollTo({
        x: 60 * index,
        y: 0,
        animated: true,
      });
    }
  }, [day, nowTime]);

  useEffect(() => {
    refetch();
  }, [route?.params?.state]);

  const getReservation = async () => {
    const result = await apis.getReservationDay(storeId, day);
    return result?.data?.list;
  };

  const {data: reservation, refetch} = useQuery(
    [('reservation', storeId, day)],
    getReservation,
  );

  const reservationRoom = reservation?.reduce((acc, current) => {
    const hour = Hour(current?.reservation_time);
    acc[hour] = acc[hour] || [];
    acc[Number(hour)].push({
      reservation_room_idx: current.reservation_room_idx,
      hour: hour,
    });
    return acc;
  }, {});

  const getOpenValue = () => {
    setModalVisible(!modalVisible);
  };

  const onPressTime = (index, k) => {
    setNowTime(index);
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({x: 60 * k, y: 0, animated: true});
    }
  };

  const datafilter = reservation?.filter(
    el => Hour(el?.reservation_time) === Number(nowTime),
  );

  const StatusBarHeight =
    Platform.OS === 'ios' ? getStatusBarHeight(true) : StatusBar.currentHeight;

  const buttonTop = Platform.OS === 'android' ? '-65' : '-30';
  return (
    <Container>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        statusBarTranslucent={true}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <ModalBg onPress={() => setModalVisible(false)}>
          <Wrap top={StatusBarHeight + 120}>
            <CalendarModal
              setDate={setDay}
              value={'selectedday'}
              getOpenValue={getOpenValue}
              setValue={setValue}
              setNowTime={setNowTime}
              storeId={storeId}
            />
          </Wrap>
        </ModalBg>
      </Modal>

      {day && (
        <>
          <CalendarHeader
            getOpenValue={getOpenValue}
            day={dayjs(day).format('MM')}
            navigation={navigation}
          />
          <ScheduleWeek
            day={day}
            setDay={setDay}
            value={value}
            setValue={setValue}
            setNowTime={setNowTime}
          />
        </>
      )}

      <TimeLine>
        <ScrollView
          ref={scrollViewRef}
          horizontal={true}
          style={{height: 50}}
          showsHorizontalScrollIndicator={false}>
          {Array.from({length: time}, (value, index) => {
            const count =
              reservationRoom && reservationRoom[openTime + index]?.length;
            const checkColor = count === undefined ? '#d7d7d7' : '#444';
            const nowTimeValue = Number(nowTime) === Number(openTime + index);
            return (
              <Time
                color={colors.mainColor}
                borderWidth={nowTimeValue ? '2px' : '0px'}
                key={index}
                onPress={() => onPressTime(openTime + index, index)}>
                <Title color={nowTimeValue ? colors.mainColor : checkColor}>
                  {openTime + index}시
                </Title>
              </Time>
            );
          })}
        </ScrollView>
      </TimeLine>

      <ScrollView>
        {datafilter && (
          <ScheduleList
            reservation={datafilter}
            navigation={navigation}
            storeId={storeId}
          />
        )}
      </ScrollView>

      {open ? (
        <View style={{width: '100%', height: '100%', position: 'absolute'}}>
          <QRCodeScanner storeId={storeId} />
        </View>
      ) : (
        ''
      )}

      <BottomBar>
        <Barcode activeOpacity={0.9} onPress={() => setOpen(!open)}>
          <Img source={IconBarcode} width={14} resizeMode="contain" />
          <Title left={5}>코드 스캔</Title>
        </Barcode>
      </BottomBar>

      {/* <QRCode buttonTop={buttonTop} /> */}
    </Container>
  );
};

const Container = styled(SafeAreaView)`
  position: relative;
  height: 100%;
  background-color: #fff;
`;

const TimeLine = styled(View)`
  border-top-width: 1px;
  border-bottom-width: 1px;
  border-color: #e3e3e3;
`;

const Time = styled(TouchableOpacity)`
  position: relative;
  margin: 0px 20px;
  display: flex;
  justify-content: center;
  align-items: center;

  width: 40px;

  border-top-width: ${props => props.borderWidth};
  border-color: ${props => props.color};
  height: 50px;
`;

const BottomBar = styled(View)`
  width: 100%;
  height: 65px;
  position: absolute;
  bottom: -10px;
  background-color: #f5f5f5;
  padding: 15px;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 10px;
`;

const Wrap = styled(View)`
  width: 75%;
  background-color: #fff;
  border-radius: 10px;
  position: absolute;
  right: 15px;
  top: ${props => props.top}px;
  padding: 10px;
`;

const Barcode = styled(TouchableOpacity)`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-right: 10px;
`;

export default ScheduleScreen;
