import React, {useEffect, useState} from 'react';
import {View, TouchableOpacity} from 'react-native';
import {useRecoilValue} from 'recoil';
import {storeIdState} from '../recoil/atom';
import apis from '../api/apis';
import NavigationHeader from '../components/Header/NavigationHeader';
import styled from 'styled-components';
import StorePrice from '../components/Addstore/StorePrice';
import {Display, Img, Title} from '../styles/styledComponent';

import IconDelete from '../assets/image/delete_btn.png';

import DraggableFlatList, {
  ScaleDecorator,
} from 'react-native-draggable-flatlist';
import {gestureHandlerRootHOC} from 'react-native-gesture-handler';
import BottomBtn from '../components/BottomBtn/BottomBtn';

const EditStorePriceScreen = ({navigation}) => {
  const storeId = useRecoilValue(storeIdState);
  const [data, setData] = useState(null);

  useEffect(() => {
    apis.getPricing(storeId).then(res => {
      if (res.data.result === '000') {
        setData(res.data.list);
      }
    });
  }, []);

  const onPressDelete = e => {
    console.log(e);
    apis.deletePricing(storeId, e).then(res => {
      if (res.data.result === '000') {
        const filterList = data?.filter(el => el.store_pricing_idx !== e);
        setData(filterList);
      }
    });
  };

  const getData = (e, k) => {
    setData(k);
  };

  const onDragEnd = data => {
    setData(data);
  };

  const onPress = () => {
    const newList = [];
    data?.forEach(el => {
      newList.push({
        store_pricing_days: el.store_pricing_days,
        store_pricing_time: el.store_pricing_time,
        store_pricing_cnt: el.store_pricing_cnt,
        store_pricing_price: el.store_pricing_price,
      });
    });

    const pricingList = {store_pricing_li: newList};

    apis.postPricing(storeId, pricingList).then(res => {
      console.log(res);
    });
  };

  const DraggList = gestureHandlerRootHOC(() => (
    <View>
      <DraggableFlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, idx) => idx}
        onDragEnd={({data}) => {
          onDragEnd(data);
        }}
        dragHitSlop={{top: 10, left: 10, bottom: 10, right: 10}}
      />
    </View>
  ));
  const renderItem = gestureHandlerRootHOC(
    ({item, drag, isActive, getIndex}) => {
      const day = item.store_pricing_days;
      const dayValue = day.indexOf('6') === -1 ? '평일' : '주말';
      return (
        <ScaleDecorator>
          <Display style={{marginBottom: 10, width: '100%', marginLeft: 20}}>
            <TouchableOpacity
              onPress={() =>
                onPressDelete(
                  !item.store_pricing_idx ? getIndex() : item.store_pricing_idx,
                )
              }>
              <Img source={IconDelete} width={23} resizeMode="contain" />
            </TouchableOpacity>
            <TouchableOpacity onLongPress={drag} disabled={isActive}>
              <Title size={16}>{` ${dayValue} / ${
                item.store_pricing_time
              }분 / ${item.store_pricing_cnt}회 / ${Number(
                item.store_pricing_price,
              ).toLocaleString()}원`}</Title>
            </TouchableOpacity>
          </Display>
        </ScaleDecorator>
      );
    },
  );

  return (
    <Wrap>
      <NavigationHeader
        navigation={navigation}
        value="stack"
        title={'이용 가격 수정'}
      />
      <InputWrap>
        <StorePrice value={'edit'} data={data} getData={getData} />
      </InputWrap>

      <List>{data && <DraggList />}</List>
      <BottomBtn title="수정 완료" onPress={onPress} />
    </Wrap>
  );
};

const Wrap = styled(View)`
  height: 100%;
  background-color: #fff;
`;

const InputWrap = styled(View)`
  padding: 0px 20px;
  background-color: #fff;
`;

const List = styled(View)`
  width: 100%;
  height: 100%;
  padding: 20px 0px;
  background-color: #fff;
  z-index: -100;
`;

export default EditStorePriceScreen;
