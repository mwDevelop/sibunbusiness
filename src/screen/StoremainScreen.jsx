import React, {useEffect, useState} from 'react';
import {View, ScrollView, Alert, TouchableOpacity} from 'react-native';

import {styled} from 'styled-components';
import {Container, Title, Img} from '../styles/styledComponent';

import apis from '../api/apis';
import {useRecoilValue} from 'recoil';
import {storeIdState} from '../recoil/atom';
import {useQuery} from 'react-query';
import dayjs from 'dayjs';
import QRCodeScanner from '../components/QRcode/QRCodeScanner';
import ReservationCard from '../components/Reservation/ReservationCard';
import NavigationHeader from '../components/Header/NavigationHeader';
import NavBar from '../components/NavBar/NavBar';
import IconBarcode from '../assets/image/barcode_scan.png';

const objectSupport = require('dayjs/plugin/objectSupport');
const isSameOrAfter = require('dayjs/plugin/isSameOrAfter');
dayjs.extend(objectSupport);
dayjs.extend(isSameOrAfter);

const StoreMainScreen = ({navigation, route}) => {
  const navData = [{title: '대기중'}, {title: '확정'}, {title: '취소/노쇼'}];
  const storeId = useRecoilValue(storeIdState);
  const [navValue, setNavValue] = useState(1);
  const [sttLists, setSttLists] = useState();
  const [update, setUpdate] = useState();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setNavValue(1);
  }, [storeId]);

  useEffect(() => {
    apis.getReservation(storeId).then(res => {
      if (res.data.result === '000') {
        const list = res.data.list;
        const groupValues = list.reduce((acc, current) => {
          acc[current.reservation_stt] = acc[current.reservation_stt] || [];
          acc[current.reservation_stt].push(current);
          return acc;
        }, {});
        setSttLists(groupValues);
      } else {
        setSttLists();
      }
    });
  }, [update, route?.params?.state, storeId]);

  const getReservationList = async () => {
    const res = await apis.getReservationSttList(
      storeId,
      navValue === 3 ? '3,4' : navValue,
    );
    return res.data.list;
  };

  const {data: sttList, refetch} = useQuery(
    ['ReservationList', navValue, storeId],
    getReservationList,
  );

  const onPressStt = data => {
    apis.getReservationStt(data.idx, data.stt).then(res => {
      if (res.data.result === '000') {
        const title =
          data?.stt === 'cancel'
            ? '예약을 거절하였습니다.'
            : '예약을 확정하였습니다.';
        Alert.alert(`${title}`);
      }
      refetch();
      setUpdate(data.idx);
    });
  };

  const onPressNav = k => {
    setNavValue(k + 1);
  };

  return (
    <Container bg="#f2f2f2">
      <View style={{zIndex: -100}}>
        <NavigationHeader
          navigation={navigation}
          value="drawer"
          title={'예약 목록'}
        />
        <NavBar
          navData={navData}
          onPressNav={onPressNav}
          navValue={navValue - 1}
          arrLength={sttLists}
          screen={'main'}
        />
      </View>
      <Wrap>
        <List>
          {sttList &&
            Object.keys(sttList).map((i, idx) => {
              return (
                <View key={idx}>
                  <Title top={10}>{i}</Title>
                  {sttList[i].map((stt, k) => {
                    return (
                      <ReservationCard
                        data={stt}
                        key={k}
                        reservationStt={onPressStt}
                        storeId={storeId}
                        navigation={navigation}
                      />
                    );
                  })}
                </View>
              );
            })}
        </List>
      </Wrap>
      {open ? (
        <QrBg>
          <QRCodeScanner storeId={storeId} />
        </QrBg>
      ) : (
        ''
      )}
      <BottomBar>
        <Barcode activeOpacity={0.9} onPress={() => setOpen(!open)}>
          <Img source={IconBarcode} width={14} resizeMode="contain" />
          <Title left={5}>코드 스캔</Title>
        </Barcode>
      </BottomBar>
    </Container>
  );
};

const List = styled(ScrollView)`
  width: 100%;
  padding: 0px 20px;
  z-index: -100;
`;

const Wrap = styled(View)`
  height: 100%;
  margin-bottom: 30px;
  padding-bottom: 185px;
`;

const QrBg = styled(View)`
  width: 100%;
  height: 100%;
  position: absolute;
`;

const BottomBar = styled(View)`
  width: 100%;
  height: 55px;
  position: absolute;
  bottom: 0px;
  background-color: #e9e9e9;
  padding: 15px;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
`;

const Barcode = styled(TouchableOpacity)`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-right: 10px;
`;

export default StoreMainScreen;
