import React, {useEffect, useState} from 'react';
import dayjs from 'dayjs';
import apis from '../api/apis';
import axios from 'axios';
import {View, TouchableOpacity, ScrollView, Alert} from 'react-native';
import {styled} from 'styled-components';
import {
  Input,
  Img,
  Title,
  Display,
  AddTitle,
  Wrap,
  InputBtn,
  Zindex,
} from '../styles/styledComponent';

import WeekDay from '../components/Week/WeekDay';
import Option from '../components/Options/Option';
import BottomBtn from '../components/BottomBtn/BottomBtn';
import StorePrice from '../components/Addstore/StorePrice';
import OpeningHours from '../components/TimePicker/OpeningHours';

import ImagePicker from 'react-native-image-crop-picker';
import ImgPicker from '../components/ImgPicker/ImgPicker';

import {ChangeTimeData} from '../utils/TimeCalculation';
import {useRecoilState, useRecoilValue} from 'recoil';
import {addStoreState, storeIdState} from '../recoil/atom';

import IconClose from '../assets/image/close_g.png';
import IconAdd from '../assets/image/addImg.png';
import IconDown from '../assets/image/down_g.png';

import {useTheme} from '@react-navigation/native';
import {Time} from '../utils/TimeCalculation';

import LottieView from 'lottie-react-native';
import Dropdown from '../components/Dropdown/Dropdown';

const AddStoreScreen = ({navigation, route, value}) => {
  const {colors} = useTheme();
  const storeId = useRecoilValue(storeIdState);
  const address = route?.params;
  const HIT_SLOP = {top: 13, left: 13, right: 13, bottom: 8};
  const [loading, setLoading] = useState(false);
  const [, setUpdate] = useRecoilState(addStoreState);
  const [img, setImg] = useState();
  const [day, setDay] = useState([]);
  const [startTime, setStartTime] = useState('00:00');
  const [endTime, setEndTime] = useState('00:00');
  const [selectedOption, setSelectedOption] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [optionData, setOptionData] = useState();
  // const [ctg, setCtg] = useState(0);
  // const [ctgOpen, setCtgOpen] = useState(false);
  const [storeInfo, setStoreInfo] = useState({
    store_ctg_idx: 2,
    store_room_cnt: 1,
  });

  const options = [
    '스윙/무비',
    '바닥스크린',
    '새벽영업',
    '장비보관',
    '주차',
    '단체석',
    '무선인터넷',
    '제로페이',
    '락커룸',
    '샤워장',
    '지역화페',
    '국민지원금',
  ];

  // const ctgData = [
  //   {title: '골프', idx: 1},
  //   {title: '요가', idx: 2},
  //   {title: '필라테스', idx: 3},
  // ];

  const {store_name, store_tel, store_room_cnt, store_addr2, store_addr1} =
    storeInfo;

  const onChange = (keyvalue, e) => {
    setStoreInfo({
      ...storeInfo,
      [keyvalue]: keyvalue === 'store_room_cnt' ? Number(e) : e,
    });
  };

  useEffect(() => {
    setUpdate();
    if (!!address?.store_addr1) {
      setStoreInfo({...storeInfo, ...address});
    }
  }, [address]);

  const onPressImg = async () => {
    ImagePicker.openPicker({
      width: 400,
      height: 400,
      multiple: true,
      cropping: true,
      compressImageMaxWidth: 500,
      compressImageMaxHeight: 500,
      includeBase64: true,
      compressImageQuality: 0.8,
    }).then(images => {
      if (img === undefined) {
        setImg(images);
      } else {
        const arr = [...img];
        arr.push(...images);
        setImg(arr);
      }
    });
  };

  function editDetailImg(detailImg) {
    const data = {store_img_li: detailImg};

    apis.postBulkImg(storeId, data).then(res => {
      console.log('상세이미지', res);
    });
  }
  async function makeData(result) {
    const today = dayjs().format('YYYY-MM-DD');
    const storeAddr = !store_addr2
      ? `${storeInfo?.store_addr1}`
      : `${storeInfo?.store_addr1} ${store_addr2}`;
    storeInfo.store_addr = storeAddr;
    storeInfo.store_open_time = ChangeTimeData(`${today} ${startTime}`);
    storeInfo.store_close_time = ChangeTimeData(`${today} ${endTime}`);
    storeInfo.store_closed_days = day.join(',');
    storeInfo.store_amenities = selectedOption?.join(',');

    if (!store_name) {
      Alert.alert('업체명을 입력해주세요.');
    } else if (!store_addr1) {
      Alert.alert('주소를 입력해주세요.');
    } else if (!store_tel) {
      Alert.alert('전화번호를 입력해주세요.');
    } else if (value === 'edit') {
      storeInfo.store_main_simg = result[0].store_img_data;
      const detailImg = result?.slice(1);
      editDetailImg(detailImg);
      await apis.postStore(storeId, storeInfo).then(res => {
        if (res.data.result === '000') {
          Alert.alert('수정이 완료되었습니다.');
          navigation.navigate('StorelistScreen', {state: 'edit'});
        } else {
          Alert.alert('오류가 발생하였습니다.');
          setLoading(false);
        }
      });
    } else {
      storeInfo.store_main_simg = !!img ? result[0].store_img_data : '';
      const detailImg = result?.slice(1);
      storeInfo.store_img_li = !!img ? [...detailImg] : '';
      await apis.putStore(storeInfo).then(res => {
        const data = res.data.data;
        if (res.data.result === '000') {
          setUpdate(data.lastInsertId);
          setLoading(false);
          navigation.navigate('StorelistScreen', {state: 'add'});
        } else {
          Alert.alert('오류가 발생하였습니다. 다시 한번 시도해주세요.');
          setLoading(false);
        }
      });
    }
  }

  const onPressAdd = async () => {
    const arr = [];
    if (img) {
      img?.map((el, index) => {
        arr.push({
          store_img_data: !!el.store_img_data
            ? el.store_img_data
            : `data:${el?.mime};base64,${el?.data}`,
          store_img_orderby: Number(index) - 1,
        });
      });
      setTimeout(() => makeData(arr), 1500);
    } else {
      makeData();
    }
  };

  function MainData(main) {
    setStoreInfo({
      store_addr1: main.store_addr1,
      store_addr2: main.store_addr2,
      store_name: main.store_name,
      store_tel: main.store_tel,
    });

    setStartTime(Time(main?.store_open_time));
    setEndTime(Time(main?.store_close_time));
    const days = main.store_closed_days.split(',');
    setDay(days);
    const optionList = main.store_amenities.split(',');
    setOptionData(optionList);
  }

  function getAllData() {
    axios.all([apis.getStoreDetail(storeId), apis.getStoreImg(storeId)]).then(
      axios.spread((res1, res2) => {
        const main = res1.data.data;
        const detail = res2.data.list;
        MainData(main);
        const mainImg = {
          store_img_data: main?.store_main_simg,
          uuid: 'main',
        };

        const imgdata = !detail ? [mainImg] : [mainImg, ...detail];
        setImg(imgdata);
      }),
    );
  }

  // const getData = data => {
  //   setCtg(data.title);
  //   setCtgOpen(false);
  // };

  useEffect(() => {
    if (value === 'edit') {
      getAllData();
    } else {
      setOptionData(options);
    }
  }, []);

  return (
    <Add>
      {loading ? (
        <Lottie>
          <LottieView
            style={{
              width: 200,
              height: 200,
            }}
            source={require('../assets/animations/loading.json')}
            autoPlay
            loop={false}
          />
        </Lottie>
      ) : (
        <>
          <Container showsVerticalScrollIndicator={false}>
            <AddTitle>
              업체명
              <Title color={colors.mainColor} size="16" weight="600">
                {' '}
                *
              </Title>
            </AddTitle>
            <Input
              onChangeText={e => onChange('store_name', e)}
              name="store_name"
              value={store_name}
            />
            {/* <AddTitle>
              업종선택
              <Title color={colors.mainColor} size="16" weight="600">
                {' '}
                *
              </Title>
            </AddTitle>
            <InputWrap>
              <DropDownInput
                activeOpacity={1}
                onPress={() => setCtgOpen(!ctgOpen)}>
                <Title color={ctg === 0 ? '#d7d7d7' : '#333'} size={14}>
                  {ctg === 0 ? '(선택)' : ctg}
                </Title>
              </DropDownInput>
              <Arrow width={12} source={IconDown} resizeMode="contain" />
              {ctgOpen ? (
                <Dropdown
                  width={100}
                  data={ctgData}
                  getData={getData}
                  value="add"
                />
              ) : (
                ''
              )}
            </InputWrap> */}

            <Wrap content="space-between">
              <AddTitle>
                주소지
                <Title color={colors.mainColor} size="16" weight="600">
                  {' '}
                  *
                </Title>
              </AddTitle>
              <InputBtn
                onPress={() =>
                  navigation.navigate('KakaoAddress', {
                    state:
                      value === 'edit' ? 'EditStroeScreen' : 'AddStoreScreen',
                  })
                }
                border={1}>
                <Title size={12} color="#7d7d7d">
                  주소 검색
                </Title>
              </InputBtn>
            </Wrap>
            <Margin top={4}>
              <Input
                placeholder="주소"
                editable={false}
                value={store_addr1}
                name="store_addr1"
                bottom={5}
              />
              <Input
                placeholder="상세주소"
                onChangeText={e => onChange('store_addr2', e)}
                name="store_addr2"
                value={store_addr2}
              />
            </Margin>

            <AddTitle>
              연락처
              <Title color={colors.mainColor} size="16" weight="600">
                {' '}
                *
              </Title>
            </AddTitle>
            <View>
              <Input
                keyboardType="number-pad"
                onChangeText={e => onChange('store_tel', e)}
                name="store_tel"
                value={store_tel}
              />
              <DeleteBtn onPress={() => onChange('store_tel', '')}>
                <Img source={IconClose} width={10} />
              </DeleteBtn>
            </View>
            {value === 'edit' ? '' : <StorePrice getData={onChange} />}

            <Zindex>
              <AddTitle>이미지</AddTitle>
              <Display>
                <TouchableOpacity onPress={onPressImg}>
                  <Img source={IconAdd} width={80} />
                </TouchableOpacity>
                {img && <ImgPicker img={img} setImg={setImg} />}
              </Display>
            </Zindex>
            <Display>
              <AddTitle>
                부가정보{' '}
                <Title size={12} color="#7d7d7d">
                  {' '}
                  중복선택가능
                </Title>
              </AddTitle>
              <InputBtn
                onPress={() => {
                  setModalVisible(true);
                }}
                hitSlop={HIT_SLOP}>
                <Title size={12} color="#7d7d7d">
                  +추가
                </Title>
              </InputBtn>
            </Display>

            {optionData && (
              <Option
                getData={onChange}
                navigation={navigation}
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                optionData={optionData}
                setOptionData={setOptionData}
                setSelectedOption={setSelectedOption}
                selectedOption={selectedOption}
                value={value === 'edit' ? 'edit' : 'add'}
              />
            )}
            {value === 'edit' ? (
              ''
            ) : (
              <>
                <AddTitle>방 개수</AddTitle>
                <View>
                  <Input
                    width={'30%'}
                    keyboardType="number-pad"
                    onChangeText={e => onChange('store_room_cnt', e)}
                    name="store_room_cnt"
                    value={String(store_room_cnt)}
                    placeholder="예)1개"
                  />
                  <DeleteBtn
                    onPress={() => onChange('store_room_cnt', '')}
                    right={'74%'}>
                    <Img source={IconClose} width={10} />
                  </DeleteBtn>
                </View>
              </>
            )}

            <AddTitle>영업시간</AddTitle>
            <OpeningHours
              setStartTime={setStartTime}
              setEndTime={setEndTime}
              startTime={startTime}
              endTime={endTime}
            />

            <AddTitle>매장 휴무요일</AddTitle>
            <WeekDay day={day} setDay={setDay} />
          </Container>
          <BottomBtn
            onPress={onPressAdd}
            title={value === 'edit' ? '수정하기' : '등록하기'}
          />
        </>
      )}
    </Add>
  );
};

const Add = styled(View)`
  height: 100%;
  background-color: #fff;
`;

const Container = styled(ScrollView)`
  height: 100%;
  padding: 0px 15px;
  margin-bottom: 100px;
`;

const DeleteBtn = styled(TouchableOpacity)`
  position: absolute;
  right: ${props => props.right || '15px'};
  top: 19px;
`;

const Margin = styled(View)`
  margin-top: ${props => props.top || 0}px;
`;

const Lottie = styled(View)`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const DropDownInput = styled(TouchableOpacity)`
  width: ${props => props.width || '100%'};
  height: 50px;
  border-radius: 5px;
  padding: 15px 20px;
  border-width: 1px;
  border-color: #d7d7d7;
  border-style: solid;
`;

const InputWrap = styled(View)`
  position: relative;
  z-index: 600;
`;

const Arrow = styled(Img)`
  position: absolute;
  right: 15px;
  top: 19px;
`;

export default AddStoreScreen;
