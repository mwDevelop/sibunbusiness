import React, {useEffect, useMemo, useState} from 'react';
import {
  TextInput,
  TouchableOpacity,
  Platform,
  View,
  SafeAreaView,
  Alert,
  Modal,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
  Title,
  Container,
  AddTitle,
  Input,
  Img,
  Display,
  InputBox,
} from '../styles/styledComponent';
import {styled} from 'styled-components';
import WeekDay from '../components/Week/WeekDay';
import {ChangeTimeData, Time} from '../utils/TimeCalculation';

import dayjs from 'dayjs';
import apis from '../api/apis';
import {useRecoilValue} from 'recoil';
import {storeIdState} from '../recoil/atom';
import IconCalendar from '../assets/image/calendar.png';

import CalendarModal from '../components/calendar/CalendarModal';
import OpeningHours from '../components/TimePicker/OpeningHours';
import BottomBtn from '../components/BottomBtn/BottomBtn';

import {useTheme} from '@react-navigation/native';

const AddVoucherScreen = ({navigation, route}) => {
  const {colors} = useTheme();
  const storeId = useRecoilValue(storeIdState);
  const edit = route?.params?.state;
  const status = route?.params?.status;

  const [index, setIndex] = useState();
  const [modalVisible, setModalVisible] = useState([false, false]);
  const [editInfo, setEditInfo] = useState(edit);
  const [day, setDay] = useState(
    editInfo ? editInfo?.store_voucher_available_days.split(',') : [],
  );
  const [startTime, setStartTime] = useState(
    editInfo ? `${Time(editInfo?.store_voucher_beg_time)}` : '',
  );
  const [endTime, setEndTime] = useState(
    editInfo ? ` ${Time(editInfo?.store_voucher_end_time)}` : '',
  );
  const [startDate, setStartDate] = useState(
    editInfo ? editInfo?.store_voucher_beg_date : '날짜선택',
  );
  const [endDate, setEndDate] = useState(
    editInfo ? editInfo?.store_voucher_end_date : '날짜선택',
  );
  const [inputs, setInputs] = useState({
    voucherTitle: editInfo ? editInfo.store_voucher_title : '',
    voucherDesc: editInfo ? editInfo.store_voucher_desc : '',
    voucherRate: editInfo ? editInfo.store_voucher_discount_rate : '',
    voucherCount: editInfo ? editInfo.store_voucher_daily_total_cnt : '',
  });
  const {voucherTitle, voucherDesc, voucherRate, voucherCount} = inputs;

  const onChange = (keyvalue, e) => {
    setInputs({
      ...inputs,
      [keyvalue]: e,
    });
  };

  function putVoucher(storeId, data) {
    apis.putVoucher(storeId, data).then(res => {
      if (res.data.result === '000') {
        navigation.navigate('VoucherLists', {state: 'add'});
      } else {
        Alert.alert('입력한 정보를 확인해주세요!');
      }
    });
  }

  function postVoucher(storeId, voucherIdx, data) {
    apis.postVoucher(storeId, voucherIdx, data).then(res => {
      if (res.data.result === '000') {
        navigation.navigate('VoucherLists', {state: voucherIdx});
      }
    });
  }

  const onPressVoucher = () => {
    const checkday = dayjs(startDate).isBefore(dayjs(endDate));

    console.log(checkday);
    const data = {
      store_voucher_title: voucherTitle,
      store_voucher_desc: voucherDesc,
      store_voucher_discount_rate: Number(voucherRate),
      store_voucher_available_days: day.join(','),
      store_voucher_beg_date: startDate,
      store_voucher_end_date: endDate,
      store_voucher_beg_time: ChangeTimeData(
        `${dayjs().format('YYYY-MM-DD')}${startTime}`,
      ),
      store_voucher_end_time: ChangeTimeData(
        `${dayjs().format('YYYY-MM-DD')}${endTime}`,
      ),
      store_voucher_daily_total_cnt: Number(voucherCount),
    };

    status === 'edit'
      ? postVoucher(storeId, editInfo?.store_voucher_idx, data)
      : putVoucher(storeId, data);
  };

  function openModal(e) {
    const newArr = Array(2).fill(false);
    newArr[e] = !modalVisible[e];
    setModalVisible(newArr);
  }

  const onPressModal = e => {
    if (e === 1 && startDate === '날짜선택') {
      Alert.alert('시작날짜를 선택해주세요!');
      setTimeout(() => {
        openModal(0);
      }, 1000);
    } else {
      openModal(e);
      setIndex(e);
    }
  };

  const dayCheck = useMemo(() => {
    if (startDate !== '날짜선택' && endDate !== '날짜선택') {
      if (
        dayjs(startDate).isBefore(dayjs(endDate)) ||
        dayjs(endDate).isAfter(dayjs(startDate))
      ) {
      } else {
        Alert.alert('날짜를 확인해주세요.');
      }
    }
  }, [startDate, endDate]);

  const timeCheck = useMemo(() => {
    const start = ChangeTimeData(`${dayjs().format('YYYY-MM-DD')}${startTime}`);
    const end = ChangeTimeData(`${dayjs().format('YYYY-MM-DD')}${endTime}`);
    if (start !== 0 && end !== 0) {
      if (start > end) {
        Alert.alert('시간을 확인해주세요.');
      }
    }
  }, [startTime, endTime]);

  return (
    <Container>
      <SafeAreaView>
        <KeyboardAwareScrollView
          enableonandroid={true}
          enableautomaticscroll={Platform.OS === 'ios'}
          style={{marginBottom: Platform.OS === 'ios' ? 0 : 70}}>
          <Wrap>
            <AddTitle>
              쿠폰명
              <Title color={colors.mainColor} size="16" weight="600">
                {' '}
                *
              </Title>
            </AddTitle>
            <Input
              onChangeText={e => onChange('voucherTitle', e)}
              name="voucherTitle"
              value={voucherTitle}
            />
            <AddTitle>상세설명</AddTitle>
            <Input
              onChangeText={e => onChange('voucherDesc', e)}
              name="voucherDesc"
              value={voucherDesc}
            />

            <AddTitle>
              할인이율
              <Title color={colors.mainColor} size="16" weight="600">
                {' '}
                *
              </Title>
            </AddTitle>
            <InputBox width="30%">
              <RateInput
                placeholder="예) 30"
                keyboardType="number-pad"
                onChangeText={e => onChange('voucherRate', e)}
                name="voucherRate"
                value={voucherRate}
                border={0}
              />
              <Title size={14} color="#7d7d7d">
                %
              </Title>
            </InputBox>

            <AddTitle>이 날 사용할 수 있어요</AddTitle>
            <WeekDay day={day} setDay={setDay} />

            <AddTitle>
              운영기간
              <Title color={colors.mainColor} size="16" weight="600">
                {' '}
                *
              </Title>
            </AddTitle>

            <Display content="space-between" style={{backgroundColor: '#fff'}}>
              <TouchableOpacity
                onPress={() => onPressModal(0)}
                style={{width: '47%'}}>
                <InputBox width="100%">
                  <View>
                    <Title
                      color={startDate === '날짜선택' ? '#7d7d7d' : '#333'}
                      size={14}>
                      {startDate}
                    </Title>
                  </View>

                  <Img width={15} source={IconCalendar} resizeMode="contain" />
                </InputBox>
              </TouchableOpacity>
              <Title color="#7d7d7d">-</Title>
              <TouchableOpacity
                onPress={() => onPressModal(1)}
                style={{width: '47%'}}>
                <InputBox width="100%">
                  <View>
                    <Title
                      color={endDate === '날짜선택' ? '#7d7d7d' : '#333'}
                      size={14}>
                      {endDate}
                    </Title>
                  </View>

                  <Img width={15} source={IconCalendar} resizeMode="contain" />
                </InputBox>
              </TouchableOpacity>

              {modalVisible[index] ? (
                <Modal
                  animationType="slide"
                  transparent={true}
                  statusBarTranslucent={true}
                  visible={modalVisible[index]}>
                  <ModalBg onPress={() => setModalVisible(false)}>
                    <ModalWrap>
                      <CalendarModal
                        setDate={index === 0 ? setStartDate : setEndDate}
                        setModalOpen={setModalVisible}
                        startDate={startDate}
                        endDate={endDate}
                        value="period"
                      />
                    </ModalWrap>
                  </ModalBg>
                </Modal>
              ) : (
                ''
              )}
            </Display>
            <View style={{zIndex: -100}}>
              <OpeningHours
                setStartTime={setStartTime}
                setEndTime={setEndTime}
                startTime={startTime}
                endTime={endTime}
              />
            </View>

            <View style={{zIndex: -100}}>
              <Title style={{marginBottom: 10, marginTop: 30}}>
                하루 발행 수
                <Title color={colors.mainColor} size="16" weight="600">
                  {' '}
                  *
                </Title>
              </Title>
              <Input
                width="50%"
                placeholder="예) 1,000"
                keyboardType="numeric"
                onChangeText={e => onChange('voucherCount', e)}
                name="voucherCount"
                value={voucherCount}
              />
            </View>
          </Wrap>
        </KeyboardAwareScrollView>
      </SafeAreaView>
      <BottomBtn
        onPress={onPressVoucher}
        title={status === 'edit' ? '수정하기' : '등록하기'}
      />
    </Container>
  );
};

const Wrap = styled(View)`
  padding: 0px 20px 80px 20px;
`;

const ModalBg = styled(TouchableOpacity)`
  position: absolute;
  right: 0px;
  bottom: 0px;
  left: 0px;
  top: 0px;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
`;

const RateInput = styled(TextInput)`
  width: 80%;
  height: 50px;
  border-radius: 5px;
  padding: 15px 10px;
`;

const ModalWrap = styled(View)`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
`;

export default AddVoucherScreen;
