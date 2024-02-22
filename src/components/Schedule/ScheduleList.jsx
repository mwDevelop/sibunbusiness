import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {styled} from 'styled-components';
import dayjs from 'dayjs';
import {Display, Title} from '../../styles/styledComponent';
import {
  Hour,
  Minute,
  Period,
  TimeSetting,
  Time,
} from '../../utils/TimeCalculation';

const ScheduleList = ({reservation, navigation, storeId}) => {
  function sttValue(index) {
    switch (Number(index)) {
      case 1:
        return {
          color: '#FFA0B1',
          title: '대기',
        };
      case 2:
        return {
          color: '#8AE1A2',
          title: '확정',
        };
      case 3:
        return {
          color: '#D9D9D9',
          title: '취소',
        };
      case 4:
        return {
          color: '#F3CE97',
          title: '노쇼',
        };
      case 5:
        return {
          color: '#72D3E0',
          title: '입장',
        };
    }
  }

  return (
    <View>
      {reservation === undefined ? (
        <Text>예약된 정보가 없습니다!</Text>
      ) : (
        <Lists>
          {reservation &&
            reservation?.map((i, index) => {
              const hourvalue = Hour(i?.reservation_time);
              const minutevalue = Minute(i?.reservation_time);
              const endTime = TimeSetting(
                hourvalue,
                minutevalue,
                Period(i.reservation_period),
              );
              const stt = i.reservation_stt;
              return (
                <View key={index}>
                  <List>
                    <Room>
                      <Title size={18} weight="600">
                        {i?.reservation_room_idx}번
                      </Title>
                    </Room>
                    <TimeView>
                      <InfoText>
                        {Time(i?.reservation_time)} ~ {endTime} (
                        {Period(i.reservation_period)}
                        분)
                      </InfoText>
                    </TimeView>
                    <BtnWrap content="space-between">
                      <SttBg bg={sttValue(stt).color}>
                        <InfoText color="#fff" weight={600}>
                          {sttValue(stt).title}
                        </InfoText>
                      </SttBg>
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate('ReservationDetailScreen', {
                            storeId: storeId,
                            idx: i?.reservation_idx,
                            screen: 'ScheduleScreen',
                          })
                        }>
                        <InfoText color="#7d7d7d">상세</InfoText>
                      </TouchableOpacity>
                    </BtnWrap>
                  </List>
                </View>
              );
            })}
        </Lists>
      )}
    </View>
  );
};

const Color = styled(View)`
  border-color: #efefef;
`;

const Lists = styled(Color)``;

const List = styled(Display)`
  border-bottom-width: 1px;
  border-color: #efefef;
  height: 70px;
`;
const TimeView = styled(View)`
  width: 49%;
  padding-left: 20px;
`;
const Room = styled(Color)`
  border-right-width: 1px;
  width: 23%;
  height: 70px;
  padding: 0px 10px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const BtnWrap = styled(Display)`
  width: 23%;
`;

const InfoText = styled(Title)`
  font-size: 15px !important;
`;

const SttBg = styled(View)`
  background-color: ${props => props.bg};
  overflow: hidden;
  border-radius: 20px;
  padding: 5px 10px;
`;

export default ScheduleList;
