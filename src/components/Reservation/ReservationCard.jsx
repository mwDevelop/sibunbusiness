import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {styled} from 'styled-components';
import {Display, Img, Title} from '../../styles/styledComponent';

import IconProfile from '../../assets/image/profile.png';
import IconRight from '../../assets/image/arrow_r_b.png';
import IconTime from '../../assets/image/period.png';

import dayjs from 'dayjs';
import {Hour, Minute, Time} from '../../utils/TimeCalculation';

const ReservationCard = ({data, reservationStt, storeId, navigation}) => {
  const {colors} = useTheme();
  const sttValue = data.reservation_stt;
  const sttCss = sttValue === 2;
  const time = data.reservation_time;
  const hour = Hour(time);
  const minute = Minute(time);

  const period =
    data.reservation_period === 1
      ? 30
      : data.reservation_period === 2
      ? 60
      : 90;
  const endtime = dayjs({hour: hour, minute: minute}).add({
    m: period,
  });

  function sttTitle(index) {
    switch (index) {
      case 1:
        return '예약 대기';
      case 2:
        return '예약 확정';
      case 3:
        return '예약 취소';
      case 4:
        return '노쇼';
    }
  }

  const onPressStt = (idx, stt) => {
    const data = {idx, stt};
    reservationStt(data);
  };

  return (
    <Card>
      <BtnDetail
        onPress={() =>
          navigation.navigate('ReservationDetailScreen', {
            storeId: storeId,
            idx: data?.reservation_idx,
            screen: 'StoremainScreen',
          })
        }>
        <Title size={15}>예약 상세보기</Title>
        <Img source={IconRight} width={13} resizeMode="contain" />
      </BtnDetail>
      <Info bottom={sttValue === 1 ? 2 : 10}>
        <Display content="space-between">
          <Display>
            <Img
              source={
                !!data?.mb_profile_img
                  ? {uri: data?.mb_profile_img}
                  : IconProfile
              }
              width={60}
              resizeMode="contain"
            />
            <Title left={10}>{data.reservation_user_name}</Title>
          </Display>
          <Stt
            bg={sttCss ? '#FFE8E8' : '#fff'}
            color={sttCss ? '#FFE8E8' : '#e9e9e9'}>
            <Title color={sttCss ? colors.mainColor : '#444'} size={14}>
              {sttTitle(sttValue)}
            </Title>
          </Stt>
        </Display>
        <Wrap>
          <Box width={30} border={1}>
            <Title size={18} color="#222">
              {data.reservation_room_idx}번방
            </Title>
          </Box>

          <Box width={70}>
            <Title right={10} size={18} color="#222">
              {Time(data.reservation_time)}
            </Title>
            <Img source={IconTime} width={50} resizeMode="contain" />
            <Arrow>
              <Title size={14}>({period}분)</Title>
            </Arrow>
            <Title left={10} size={18} color="#222">
              {dayjs(endtime).format('HH:mm')}
            </Title>
          </Box>
        </Wrap>
        {sttValue === 1 ? (
          <BtnWrap>
            <Box width={50} border={1}>
              <TouchableOpacity
                hitSlop={30}
                onPress={e => {
                  onPressStt(data?.reservation_idx, 'cancel');
                }}>
                <Title>거절하기</Title>
              </TouchableOpacity>
            </Box>
            <Box width={50}>
              <TouchableOpacity
                hitSlop={30}
                onPress={e => {
                  onPressStt(data?.reservation_idx, 'confirm');
                }}>
                <Title color={colors.mainColor}>확정하기</Title>
              </TouchableOpacity>
            </Box>
          </BtnWrap>
        ) : (
          ''
        )}
      </Info>
    </Card>
  );
};

const Card = styled(View)`
  position: relative;
  width: 100%;
  background-color: #fff;
  border-radius: 7px;
  margin-top: 23px;
  z-index: -500;
`;

const BtnDetail = styled(TouchableOpacity)`
  width: 100%;
  height: 50px;
  padding: 0px 15px;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  border-color: #e9e9e9;
  border-bottom-width: 1px;
  border-top-right-radius: 7px;
  border-top-left-radius: 7px;
`;

const Info = styled(View)`
  padding: 20px 10px 0px 10px;
  padding-bottom: ${props => props.bottom}px;
`;

const Stt = styled(View)`
  background-color: ${props => props.bg || '#fff'};
  padding: 5px 10px;
  border-radius: 50px;
  border-width: 1px;
  border-color: ${props => props.color};
`;

const Wrap = styled(View)`
  width: 100%;
  height: 68px;

  margin-top: 15px;
  padding: 10px;

  border-width: 1px;
  border-color: #e9e9e9;
  border-radius: 5px;

  flex-direction: row;
`;

const Box = styled(View)`
  width: ${props => props.width}%;
  height: 100%;
  border-right-width: ${props => props.border || 0}px;
  border-color: #e9e9e9;
  padding: 10px 0;

  align-items: center;
  justify-content: center;
  flex-direction: row;
`;

const Arrow = styled(View)`
  position: absolute;
  top: 30px;
`;

const BtnWrap = styled(View)`
  width: 100%;
  height: 58px;
  margin-top: 20px;
  padding: 7px 0px;
  border-top-width: 1px;
  border-color: #e9e9e9;

  flex-direction: row;
`;

export default ReservationCard;
