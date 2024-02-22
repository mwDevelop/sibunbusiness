// import React, {useEffect, useState} from 'react';
// import DraggableFlatList, {
//   ScaleDecorator,
// } from 'react-native-draggable-flatlist';
// import {gestureHandlerRootHOC} from 'react-native-gesture-handler';
// import {Img, Title} from '../../styles/styledComponent';
// import {TouchableOpacity, View, Dimensions} from 'react-native';

// import {styled} from 'styled-components';
// import IconClose from '../../assets/image/close_img.png';

// const ImgPicker = ({img, setImg, value}) => {
//   const Width = Dimensions.get('window').width;
//   const [data, setData] = useState(img);

//   useEffect(() => {
//     setData(img);
//   }, [img]);

//   const onPressDelete = e => {
//     const filter = data?.filter((i, index) => index !== e);
//     setData(filter);
//     setImg(filter);
//   };

//   const onLongPress = data => {
//     setData(data);
//     setImg(data);
//   };

//   const DraggList = gestureHandlerRootHOC(() => (
//     <View>
//       <DraggableFlatList
//         style={{width: Width - 110}}
//         showsHorizontalScrollIndicator={false}
//         horizontal={true}
//         data={data}
//         onDragEnd={({data}) => {
//           onLongPress(data);
//         }}
//         keyExtractor={(item, index) => index}
//         renderItem={renderItem}
//       />
//     </View>
//   ));

//   const renderItem = gestureHandlerRootHOC(
//     ({item, drag, isActive, getIndex}) => {
//       return (
//         <ScaleDecorator>
//           <TouchableOpacity
//             style={{marginLeft: 8}}
//             onLongPress={drag}
//             disabled={isActive}
//             activeOpacity={0.8}>
//             {!!item.store_img_data ? (
//               <Img
//                 source={{uri: item?.store_img_data}}
//                 width={80}
//                 radius={5}
//                 resizeMode="cover"
//               />
//             ) : (
//               <Img src={item?.path} width={80} radius={5} resizeMode="cover" />
//             )}
//           </TouchableOpacity>
//           <Icon activeOpacity={0.8} onPress={() => onPressDelete(getIndex())}>
//             <Img source={IconClose} width={17} left={10} />
//           </Icon>
//           {getIndex() === 0 ? (
//             <MainImg>
//               <Title color="#FFF" size={12}>
//                 {' '}
//                 대표사진
//               </Title>
//             </MainImg>
//           ) : (
//             ''
//           )}
//         </ScaleDecorator>
//       );
//     },
//   );

//   return <View>{data && <DraggList />}</View>;
// };

// const MainImg = styled(View)`
//   width: 80px;
//   height: 21px;
//   background: rgba(51, 51, 51, 0.85);

//   position: absolute;
//   bottom: 0px;
//   left: 8px;
//   margin-right: 100px;

//   align-items: center;
//   justify-content: center;

//   border-bottom-left-radius: 5px;
//   border-bottom-right-radius: 5px;
// `;

// const Icon = styled(TouchableOpacity)`
//   position: absolute;
//   right: 15px;
//   top: 5px;
// `;

// export default ImgPicker;

import React, {useEffect, useState, useCallback} from 'react';
import DraggableFlatList, {
  ScaleDecorator,
} from 'react-native-draggable-flatlist';
import {gestureHandlerRootHOC} from 'react-native-gesture-handler';
import {Img, Title} from '../../styles/styledComponent';
import {TouchableOpacity, View, Dimensions} from 'react-native';

import {styled} from 'styled-components';
import IconClose from '../../assets/image/close_img.png';

import apis from '../../api/apis';

const ImgPicker = ({img, setImg, value, storeId}) => {
  const Width = Dimensions.get('window').width;
  const [data, setData] = useState(img);

  useEffect(() => {
    setData(img);
  }, [img]);

  const onPressDelete = e => {
    const filter = data?.filter((i, index) => index !== e);
    setData(filter);
    setImg(filter);
  };

  const onPressEditDelete = useCallback(
    (e, index) => {
      if (!!e.store_img_idx) {
        apis.deleteStoreImg(storeId, e?.store_img_idx).then(res => {
          const filter = data.filter(
            (el, idx) => el.store_img_idx !== e.store_img_idx,
          );
          if (res.data.result === '000') {
            setData(filter);
            setImg(filter);
          }
        });
      } else {
        const filter = data.filter(el => el?.uuid !== e?.uuid);
        setData(filter);
        setImg(filter);
      }
    },
    [data],
  );

  const onLongPress = data => {
    setData(data);
    setImg(data);
  };

  const DraggList = gestureHandlerRootHOC(() => (
    <View>
      <DraggableFlatList
        style={{width: Width - 110}}
        showsHorizontalScrollIndicator={false}
        horizontal={true}
        data={data}
        onDragEnd={({data}) => {
          onLongPress(data);
        }}
        keyExtractor={(item, index) => index}
        renderItem={renderItem}
      />
    </View>
  ));

  const renderItem = gestureHandlerRootHOC(
    ({item, drag, isActive, getIndex}) => {
      return (
        <ScaleDecorator>
          <TouchableOpacity
            style={{marginLeft: 8}}
            onLongPress={drag}
            disabled={isActive}
            activeOpacity={0.8}>
            {!!item.store_img_data ? (
              <Img
                source={{uri: item?.store_img_data}}
                width={80}
                radius={5}
                resizeMode="cover"
              />
            ) : (
              <Img src={item?.path} width={80} radius={5} resizeMode="cover" />
            )}
          </TouchableOpacity>
          <Icon
            activeOpacity={0.8}
            onPress={() =>
              value === 'edit'
                ? onPressEditDelete(item)
                : onPressDelete(getIndex())
            }>
            <Img source={IconClose} width={17} left={10} />
          </Icon>
          {getIndex() === 0 ? (
            <MainImg>
              <Title color="#FFF" size={12}>
                {' '}
                대표사진
              </Title>
            </MainImg>
          ) : (
            ''
          )}
        </ScaleDecorator>
      );
    },
  );

  return <View>{data && <DraggList />}</View>;
};

const MainImg = styled(View)`
  width: 80px;
  height: 21px;
  background: rgba(51, 51, 51, 0.85);

  position: absolute;
  bottom: 0px;
  left: 8px;
  margin-right: 100px;

  align-items: center;
  justify-content: center;

  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
`;

const Icon = styled(TouchableOpacity)`
  position: absolute;
  right: 15px;
  top: 5px;
`;

export default ImgPicker;
