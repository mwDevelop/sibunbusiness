// import React, {memo, useState, useCallback, useEffect} from 'react';
// import NavigationHeader from '../components/Header/NavigationHeader';
// import {View, TouchableOpacity, Text, Dimensions, Alert} from 'react-native';
// import styled from 'styled-components';
// import axios from 'axios';
// import apis from '../api/apis';
// import {useRecoilValue} from 'recoil';
// import {storeIdState} from '../recoil/atom';
// import _ from 'lodash';
// import GridView from 'react-native-draggable-gridview';
// import {Title, Img} from '../styles/styledComponent';
// import IconClose from '../assets/image/close_img.png';
// import BottomBtn from '../components/BottomBtn/BottomBtn';
// import {ImagePickerFun} from '../utils/ImagePickerFun';

// const EditImgScreen = ({navigation}) => {
//   return (
//     <Edit>
//       <NavigationHeader
//         title={'이미지 수정'}
//         value={'stack'}
//         navigation={navigation}
//       />
//       <Title size={20} weight={600} top={10} bottom={10} left={10}>
//         이미지 업로드
//       </Title>
//       <Container />
//     </Edit>
//   );
// };

// const Container = memo(() => {
//   const storeId = useRecoilValue(storeIdState);
//   const [data, setData] = useState();

//   const Height = Dimensions.get('window').height - 70 - 120 - 35;

//   useEffect(() => {
//     axios.all([apis.getStoreDetail(storeId), apis.getStoreImg(storeId)]).then(
//       axios.spread((res1, res2) => {
//         const main = res1.data.data;
//         const detail = res2.data.list;

//         const mainImg = {
//           store_img_data: main?.store_main_simg,
//           uuid: 'main',
//         };
//         if (!detail) {
//           setData([mainImg]);
//         } else {
//           setData([mainImg, ...detail]);
//         }
//       }),
//     );
//   }, []);

//   const locked = useCallback(item => item === 'add', [data]);

//   const onPressImg = async () => {
//     ImagePickerFun({data, setData});
//   };

//   const renderLockedItem = useCallback(
//     () => <LockedItem onPress={onPressImg} />,
//     [data],
//   );

//   const onReleaseCell = useCallback(
//     items => {
//       const data1 = items.slice(1);
//       console.log(!_.isEqual(data, data1));
//       if (!_.isEqual(data, data1)) setData(data1);
//     },
//     [data],
//   );

//   function EditMainImg() {
//     const mainData = data[0];

//     if (mainData?.uuid !== 'main') {
//       const data = {
//         store_main_simg: !!mainData?.store_img_idx
//           ? mainData?.store_img_data
//           : `data:${mainData?.mime};base64,${mainData?.data}`,
//       };
//       apis.postStore(storeId, data).then(res => {
//         console.log('메인이미지 수정', res.data);
//       });
//     }
//   }

//   async function EditDetailImg() {
//     const detail = data?.splice(1);

//     const newList = [];
//     detail.forEach((el, k) => {
//       newList.push({
//         store_img_data: !!el.store_img_data
//           ? el?.store_img_data
//           : `data:${el?.mime};base64,${el?.data}`,
//         store_img_orderby: k,
//       });
//     });

//     const imgList = {store_img_li: newList};
//     console.log(imgList);

//     apis.postImgBulk(storeId, imgList).then(res => {
//       if (res.data.result === '000') {
//         Alert.alert('수정이 완료되었습니다.');
//       } else {
//         console.log('상세이미지', res);
//       }
//     });
//   }

//   const onPressEdit = () => {
//     EditMainImg();
//     EditDetailImg();
//   };

//   const onPressDelete = useCallback(
//     (e, index) => {
//       if (!!e.store_img_idx) {
//         apis.deleteStoreImg(storeId, e?.store_img_idx).then(res => {
//           const filter = data.filter(
//             (el, idx) => el.store_img_idx !== e.store_img_idx,
//           );
//           if (res.data.result === '000') {
//             setData(filter);
//           }
//         });
//       } else {
//         const filter = data.filter(el => el?.uuid !== e?.uuid);
//         setData(filter);
//       }
//     },
//     [data],
//   );

//   const renderItem = useCallback(
//     (item, index, loading) => (
//       <Item
//         item={item}
//         index={index}
//         onPressDelete={onPressDelete}
//         main={data[0]?.store_img_idx || data[0]?.uuid}
//       />
//     ),
//     [data],
//   );

//   return (
//     <Edit>
//       {data && (
//         <View style={{height: Height}}>
//           <GridView
//             data={['add', ...data]}
//             keyExtractor={item =>
//               item == 'add' ? item : item.store_img_idx || item.uuid
//             }
//             renderItem={renderItem}
//             onReleaseCell={onReleaseCell}
//             numColumns={3}
//             delayLongPress={500}
//             containerMargin={{top: 0, left: 15, right: 15, bottom: 0}}
//             renderLockedItem={renderLockedItem}
//             locked={locked}
//           />
//         </View>
//       )}
//       <BottomBtn title="적용하기" onPress={onPressEdit} bottom={105} />
//     </Edit>
//   );
// });

// const DeleteButton = memo(({onPress}) => (
//   <DeleteBtn onPress={onPress}>
//     <Img source={IconClose} width={17} />
//   </DeleteBtn>
// ));

// const LockedItem = memo(({onPress}) => (
//   <AddBtn activeOpacity={0.5} onPress={onPress}>
//     <EditItem style={{flex: 1}}>
//       <Text style={{fontSize: 30, color: '#7d7d7d'}}>+</Text>
//     </EditItem>
//   </AddBtn>
// ));

// const Item = ({item, index, main, onPressDelete, btnValue}) => {
//   const checkid = item?.store_img_idx || item?.uuid;

//   return (
//     <EditItem style={{flex: 1}}>
//       {!item?.store_img_idx && checkid !== 'main' ? (
//         <Img
//           resizeMode="cover"
//           width={110}
//           height={110}
//           radius={5}
//           src={item?.path}
//         />
//       ) : (
//         <Img
//           resizeMode="cover"
//           width={110}
//           height={110}
//           radius={5}
//           source={{uri: item?.store_img_data}}
//         />
//       )}

//       {main === checkid ? (
//         <MainImg>
//           <Title color="#FFF" size={12}>
//             {' '}
//             대표사진
//           </Title>
//         </MainImg>
//       ) : (
//         ''
//       )}

//       {btnValue ? (
//         ''
//       ) : (
//         <DeleteButton onPress={() => onPressDelete(item, index)} />
//       )}
//     </EditItem>
//   );
// };

// const EditItem = styled(View)`
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   position: relative;
// `;

// const DeleteBtn = styled(TouchableOpacity)`
//   position: absolute;
//   top: 3px;
//   right: 3px;
//   width: 32px;
//   height: 32px;
//   justify-content: center;
//   align-items: center;
// `;

// const Edit = styled(View)`
//   background-color: #fff;
//   height: 100%;
// `;

// const MainImg = styled(View)`
//   width: 110px;
//   height: 21px;
//   background: rgba(51, 51, 51, 0.85);

//   position: absolute;

//   bottom: 5px;
//   margin-right: 100px;

//   align-items: center;
//   justify-content: center;

//   border-bottom-left-radius: 5px;
//   border-bottom-right-radius: 5px;
// `;

// const AddBtn = styled(TouchableOpacity)`
//   width: 110px;
//   height: 110px;
//   border-width: 1px;
//   border-color: #d7d7d7;
//   border-radius: 5px;
//   margin-top: 6px;
//   margin-left: 4px;
// `;

// export default EditImgScreen;

import React, {useEffect, useState} from 'react';
import {Img, Display, AddTitle, Zindex} from '../styles/styledComponent';
import {TouchableOpacity} from 'react-native';
import IconAdd from '../assets/image/addImg.png';

import axios from 'axios';
import apis from '../api/apis';

import {useRecoilValue} from 'recoil';
import {storeIdState} from '../recoil/atom';

import ImgPicker from '../components/ImgPicker/ImgPicker';
import {ImagePickerFun} from '../utils/ImagePickerFun';
import ImagePicker from 'react-native-image-crop-picker';

const EditImgScreen = ({data, setData}) => {
  const storeId = useRecoilValue(storeIdState);

  useEffect(() => {
    axios.all([apis.getStoreDetail(storeId), apis.getStoreImg(storeId)]).then(
      axios.spread((res1, res2) => {
        const main = res1.data.data;
        const detail = res2.data.list;
        const mainImg = {
          store_img_data: main?.store_main_simg,
          uuid: 'main',
        };
        if (!detail) {
          setData([mainImg]);
        } else {
          setData([mainImg, ...detail]);
        }
      }),
    );
  }, []);

  const onPressImg = async () => {
    ImagePickerFun({data, setData});
  };
  return (
    <Zindex>
      <AddTitle>이미지</AddTitle>
      <Display>
        <TouchableOpacity onPress={onPressImg}>
          <Img source={IconAdd} width={80} />
        </TouchableOpacity>
        {data && (
          <ImgPicker
            img={data}
            setImg={setData}
            value={'edit'}
            storeId={storeId}
          />
        )}
      </Display>
    </Zindex>
  );
};

export default EditImgScreen;
