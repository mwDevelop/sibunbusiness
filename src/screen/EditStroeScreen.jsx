// import React, {useEffect, useState} from 'react';
// import axios from 'axios';
// import dayjs from 'dayjs';
// import apis from '../api/apis';
// import {View, TouchableOpacity, ScrollView} from 'react-native';
// import {useTheme} from '@react-navigation/native';
// import {styled} from 'styled-components';
// import {
//   Input,
//   Img,
//   Title,
//   Display,
//   AddTitle,
//   Wrap,
//   InputBtn,
// } from '../styles/styledComponent';

// import WeekDay from '../components/Week/WeekDay';
// import IconClose from '../assets/image/close_g.png';

// import OpeningHours from '../components/TimePicker/OpeningHours';

// import Option from '../components/Options/Option';
// import BottomBtn from '../components/BottomBtn/BottomBtn';

// import {ChangeTimeData, Time} from '../utils/TimeCalculation';
// import {useRecoilState, useRecoilValue} from 'recoil';
// import {addStoreState, storeIdState, storeState} from '../recoil/atom';

// import EditImgScreen from './EditImgScreen';
// import {EditDetailImg, EditMainImg} from '../utils/EditimgFun';

// const EditStroeScreen = ({navigation, route}) => {
//   const {colors} = useTheme();

//   const storeId = useRecoilValue(storeIdState);
//   const address = route?.params;
//   const [, setUpdate] = useRecoilState(addStoreState);
//   const [, setStor] = useRecoilState(storeState);
//   const [day, setDay] = useState([]);
//   const [startTime, setStartTime] = useState('00:00');
//   const [endTime, setEndTime] = useState('00:00');
//   const [selectedOption, setSelectedOption] = useState(null);
//   const [img, setImg] = useState();
//   const [optionData, setOptionData] = useState();
//   const [modalVisible, setModalVisible] = useState(false);
//   const [storeInfo, setStoreInfo] = useState({
//     store_ctg_idx: 1,
//     store_name: '',
//     store_tel: '',
//     store_amenities: '',
//   });

//   const {store_name, store_tel, store_addr2, store_addr1} = storeInfo;

//   const onChange = (keyvalue, e) => {
//     setStoreInfo({
//       ...storeInfo,
//       [keyvalue]: e,
//     });
//   };

//   const onPressImg = async () => {
//     ImagePicker.openPicker({
//       width: 400,
//       height: 400,
//       multiple: true,
//       cropping: true,
//       compressImageMaxWidth: 500,
//       compressImageMaxHeight: 500,
//       includeBase64: true,
//       compressImageQuality: 0.5,
//     }).then(images => {
//       if (img === undefined) {
//         setImg(images);
//       } else {
//         const arr = [...img];
//         arr.push(...images);
//         setImg(arr);
//       }
//     });
//   };

//   function MainData(main) {
//     setStoreInfo({
//       store_addr1: main.store_addr1,
//       store_addr2: main.store_addr2,
//       store_name: main.store_name,
//       store_tel: main.store_tel,
//     });

//     setStartTime(Time(main?.store_open_time));
//     setEndTime(Time(main?.store_close_time));
//     const days = main.store_closed_days.split(',');
//     setDay(days);
//     const optionList = main.store_amenities.split(',');
//     setOptionData(optionList);
//   }

//   function getAllData() {
//     axios.all([apis.getStoreDetail(storeId), apis.getStoreImg(storeId)]).then(
//       axios.spread((res1, res2) => {
//         const main = res1.data.data;
//         const detail = res2.data.list;
//         MainData(main);
//         const mainImg = {
//           store_img_data: main?.store_main_simg,
//           uuid: 'main',
//         };

//         const imgdata = !detail ? [mainImg] : [mainImg, ...detail];
//         setImg(imgdata);
//       }),
//     );
//   }

//   useEffect(() => {
//     getAllData();
//   }, []);

//   useEffect(() => {
//     if (!!address.store_addr1) {
//       setStoreInfo({...storeInfo, ...address});
//     }
//   }, [address]);

//   const onPressEdit = async () => {
//     const today = dayjs().format('YYYY-MM-DD');
//     const storeAddr = !store_addr2
//       ? `${store_addr1}`
//       : `${store_addr1} ${store_addr2}`;
//     storeInfo.store_addr = storeAddr;
//     storeInfo.store_open_time = ChangeTimeData(`${today} ${startTime}`);
//     storeInfo.store_close_time = ChangeTimeData(`${today} ${endTime}`);
//     storeInfo.store_closed_days = day.join(',');
//     storeInfo.store_amenities = selectedOption.join();
//     storeInfo.store_main_simg = EditMainImg(img[0]);

//     const detail = img?.slice(1);
//     EditDetailImg(detail, storeId);

//     await apis.postStore(storeId, storeInfo).then(res => {
//       if (res.data.result === '000') {
//         const data = res.data.data;
//         setStor({
//           open: ChangeTimeData(`${today} ${startTime}`),
//           close: ChangeTimeData(`${today} ${endTime}`),
//         });
//         setUpdate(data.lastInsertId);
//         navigation.navigate('DrawerNavigation', {
//           screen: 'StoremainScreen',
//         });
//       }
//     });
//   };

//   return (
//     <Add>
//       <Container showsVerticalScrollIndicator={false}>
//         <AddTitle>
//           업체명
//           <Title color={colors.mainColor} size="16" weight="600">
//             {' '}
//             *
//           </Title>
//         </AddTitle>
//         <Input
//           onChangeText={e => onChange('store_name', e)}
//           name="store_name"
//           value={store_name}
//         />
//         <Wrap content="space-between">
//           <AddTitle>주소지</AddTitle>
//           <InputBtn
//             onPress={() =>
//               navigation.navigate('KakaoAddress', {state: 'EditStroeScreen'})
//             }
//             border={1}>
//             <Title size={12} color="#7d7d7d">
//               주소 검색
//             </Title>
//           </InputBtn>
//         </Wrap>
//         <Margin top={4}>
//           <Input
//             placeholder="주소"
//             editable={false}
//             value={store_addr1}
//             name="store_addr1"
//             bottom={5}
//           />

//           <Input
//             placeholder="상세주소"
//             onChangeText={e => onChange('store_addr2', e)}
//             name="store_addr2"
//             value={store_addr2}
//           />
//         </Margin>

//         <AddTitle>연락처</AddTitle>
//         <View>
//           <Input
//             keyboardType="number-pad"
//             onChangeText={e => onChange('store_tel', e)}
//             name="store_tel"
//             value={store_tel}
//           />
//           <DeleteBtn onPress={() => onChange('store_tel', '')}>
//             <Img source={IconClose} width={10} />
//           </DeleteBtn>
//         </View>
//         {/* <Zindex>
//           <AddTitle>이미지</AddTitle>
//           <Display>
//             <TouchableOpacity onPress={onPressImg}>
//               <Img source={IconAdd} width={80} />
//             </TouchableOpacity>
//             {img && <ImgPicker img={img} setImg={setImg} />}
//           </Display>
//         </Zindex> */}
//         <EditImgScreen data={img} setData={setImg} />
//         <Display>
//           <AddTitle>
//             부가정보{' '}
//             <Title size={12} color="#7d7d7d">
//               {' '}
//               중복선택가능
//             </Title>
//           </AddTitle>
//           <InputBtn
//             onPress={() => {
//               setModalVisible(true);
//             }}>
//             <Title size={12} color="#7d7d7d">
//               +추가
//             </Title>
//           </InputBtn>
//         </Display>
//         {optionData && (
//           <Option
//             navigation={navigation}
//             modalVisible={modalVisible}
//             setModalVisible={setModalVisible}
//             optionData={optionData}
//             setOptionData={setOptionData}
//             setSelectedOption={setSelectedOption}
//             selectedOption={selectedOption}
//             value="edit"
//           />
//         )}

//         <AddTitle>영업시간</AddTitle>
//         <OpeningHours
//           setStartTime={setStartTime}
//           setEndTime={setEndTime}
//           startTime={startTime}
//           endTime={endTime}
//         />
//         <AddTitle>매장 휴무요일</AddTitle>
//         <WeekDay day={day} setDay={setDay} />
//       </Container>
//       <BottomBtn onPress={onPressEdit} title={'수정하기'} />
//     </Add>
//   );
// };

// const Add = styled(View)`
//   height: 100%;
//   background-color: #fff;
// `;

// const Container = styled(ScrollView)`
//   height: 100%;
//   padding: 0px 15px;
//   margin-bottom: 100px;
// `;

// const DeleteBtn = styled(TouchableOpacity)`
//   position: absolute;
//   right: 15px;
//   top: 19px;
// `;

// const Margin = styled(View)`
//   margin-top: ${props => props.top || 0}px;
// `;

// export default EditStroeScreen;

import React from 'react';
import AddStoreScreen from './AddStoreScreen';

const EditStroeScreen = ({navigation, route}) => {
  return <AddStoreScreen value="edit" navigation={navigation} route={route} />;
};

export default EditStroeScreen;
