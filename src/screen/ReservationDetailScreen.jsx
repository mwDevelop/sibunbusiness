import React, {useEffect, useState} from 'react';
import {Alert, Platform, TouchableOpacity, View} from 'react-native';
import apis from '../api/apis';
import {ReservationStt} from '../utils/ReservationStt';
import ScheduleHeader from '../components/Header/ScheduleHeader';
import {
  Container,
  Display,
  Img,
  Title,
  Btn,
  BtnWrap,
} from '../styles/styledComponent';
import {styled} from 'styled-components';
import {Linking} from 'react-native';

import IconReady from '../assets/image/ready.png';
import IconCancel from '../assets/image/cancel.png';
import IconConfirm from '../assets/image/confirm.png';
import IconNowShow from '../assets/image/noshow.png';
import IconEnter from '../assets/image/enter.png';
import {Hour, Minute, Period, TimeSetting} from '../utils/TimeCalculation';
import {useTheme} from '@react-navigation/native';

const ReservationDetailScreen = ({route, navigation}) => {
  const {colors} = useTheme();
  const [data, setData] = useState();
  const [update, setUpdate] = useState(null);
  const btnheight = Platform.OS === 'ios' ? 75 : 60;

  const state = route?.params;
  useEffect(() => {
    state &&
      apis.getReservationaDetail(state?.storeId, state?.idx).then(res => {
        if (res.data.result === '000') {
          setData(res.data.data);
        }
      });
    if (!state) {
      navigation.goBack();
    }
  }, [update]);

  const stt = data?.reservation_stt;
  const hour = Hour(data?.reservation_time);
  const minute = Minute(data?.reservation_time);
  const endTime = TimeSetting(hour, minute, Period(data?.reservation_period));

  function sttValue(index) {
    switch (Number(index)) {
      case 1:
        return IconReady;
      case 2:
        return IconConfirm;
      case 3:
        return IconCancel;
      case 4:
        return IconNowShow;
      case 5:
        return IconEnter;
    }
  }

  const onPressStt = (idx, stt) => {
    apis.getReservationStt(idx, stt).then(res => {
      if (res.data.result === '000') {
        const title =
          stt === 'cancel'
            ? '예약을 거절하였습니다.'
            : '예약을 확정하였습니다.';
        Alert.alert(`${title}`);
        setUpdate(idx);
      }
    });
  };

  const onPressClose = () => {
    console.log(update);
    navigation.navigate(state.screen, {state: update});
  };

  return (
    <Container>
      <View>
        <ScheduleHeader
          title="예약 상세"
          navigation={navigation}
          onPressClose={onPressClose}
        />
      </View>
      <Info>
        {data && (
          <View style={{marginTop: 100}}>
            <View
              style={{display: 'flex', alignItems: 'center', marginBottom: 40}}>
              <Img bottom={10} width={75} source={sttValue(stt)} />
              <Title size={18} color={stt === 3 ? '#444' : colors.mainColor}>
                {state?.title
                  ? state?.title
                  : ReservationStt(stt) === '대기'
                  ? '대기 중인 예약입니다.'
                  : `${ReservationStt(stt)}된 예약입니다.`}
              </Title>
            </View>
            <Box1>
              <Detail>
                <InfoTitle size={13}>예약날짜</InfoTitle>
                <Title size={15} color={'#444'}>
                  {data?.reservation_date}
                </Title>
              </Detail>
              <Detail left={1} right={1}>
                <InfoTitle size={13}>예약시간</InfoTitle>
                <Title size={15} color={'#444'}>
                  {hour}:{minute} ~ {endTime}
                </Title>
              </Detail>
              <Detail>
                <InfoTitle size={13}>방 번호</InfoTitle>
                <Title size={15} color={'#444'}>
                  {data?.reservation_room_idx}번
                </Title>
              </Detail>
            </Box1>

            <Box2>
              <Title size={17} color={'#222'}>
                예약자 정보
              </Title>
              <Display content="space-between" top={10}>
                <InfoTitle size={15} color="#7d7d7d">
                  예약자명
                </InfoTitle>
                <Title size={15} color={'#444'}>
                  {data?.reservation_user_name}
                </Title>
              </Display>
              <Display content="space-between" top={5}>
                <InfoTitle size={15} color="#7d7d7d">
                  전화번호
                </InfoTitle>
                <TouchableOpacity
                  onPress={() => {
                    Linking.openURL(`tel:${data?.reservation_user_cellphone}`);
                  }}>
                  <Title size={15} color={'#444'}>
                    {data?.reservation_user_cellphone}
                  </Title>
                </TouchableOpacity>
              </Display>
            </Box2>
          </View>
        )}
      </Info>
      <BtnWrap>
        {stt === 1 ? (
          <Display>
            <Btn
              onPress={() => onPressStt(data?.reservation_idx, 'cancel')}
              width={50}
              height={btnheight}
              bg="#D7D7D7"
              activeOpacity={0.8}>
              <Title color="#444" size={18}>
                거절하기
              </Title>
            </Btn>
            <Btn
              width={50}
              height={btnheight}
              activeOpacity={0.8}
              onPress={() => onPressStt(data?.reservation_idx, 'confirm')}>
              <Title color="#fff" size={18}>
                확정하기
              </Title>
            </Btn>
          </Display>
        ) : (
          <View>
            {stt === 3 ? (
              <Cancel>
                <Title color="#444" size={14}>
                  취소 일시 : {data?.reservation_cancel_dt}
                </Title>
              </Cancel>
            ) : (
              ''
            )}

            <Btn onPress={() => onPressClose()} height={btnheight}>
              <Title color="#fff" size={18}>
                확인
              </Title>
            </Btn>
          </View>
        )}
      </BtnWrap>
    </Container>
  );
};

const Info = styled(View)`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0px 16px;

  border-top-width: 1px;
  border-color: #e9e9e9;
`;

const Box1 = styled(View)`
  border-width: 1px;
  border-color: #b8b8b8;
  border-radius: 5px;
  height: 70px;

  display: flex;
  flex-direction: row;

  align-items: center;
`;

const Detail = styled(View)`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 34%;
  height: 100%;
  border-left-width: ${props => props.left || 0}px;
  border-right-width: ${props => props.right || 0}px;
  border-color: #b8b8b8;
`;

const InfoTitle = styled(Title)`
  color: #7d7d7d;
  margin-bottom: 10px;
`;

const Box2 = styled(View)`
  border-width: 1px;
  border-color: #efefef;
  border-radius: 5px;
  padding: 20px;

  margin-top: 30px;
`;

const Cancel = styled(View)`
  padding: 8px 20px;
  height: 35px;
  border-radius: 5px;
  background-color: #e9e9e9;

  margin: 12px auto;
  box-sizing: border-box;

  display: flex;
  align-items: center;
`;
export default ReservationDetailScreen;
