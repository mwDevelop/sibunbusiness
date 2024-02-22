import React, {useEffect, useState} from 'react';
import {styled} from 'styled-components';
import {View, TouchableOpacity, TextInput, Alert} from 'react-native';
import {
  AddTitle,
  Title,
  Display,
  Img,
  InputBtn,
  Zindex,
} from '../../styles/styledComponent';

import IconDown from '../../assets/image/down_g.png';
import IconDelete from '../../assets/image/delete_btn.png';
import Dropdown from '../Dropdown/Dropdown';
import apis from '../../api/apis';
import {useRecoilValue} from 'recoil';
import {storeIdState} from '../../recoil/atom';

const StorePrice = ({getData, data, value}) => {
  const HIT_SLOP = {top: 10, left: 10, right: 10, bottom: 10};
  const storeId = useRecoilValue(storeIdState);
  const dropdownData = [
    {title: '평일', value: '1,2,3,4,5'},
    {title: '주말', value: '6,7'},
  ];
  const [days, setDays] = useState(null);
  const [open, setOpen] = useState(false);
  const [priceList, setPriceList] = useState(null);
  const [storePrice, setStorePrice] = useState({
    store_pricing_price: null,
    store_pricing_days: null,
    store_pricing_time: null,
    store_pricing_cnt: null,
  });

  const {
    store_pricing_price,
    store_pricing_time,
    store_pricing_cnt,
    store_pricing_days,
  } = storePrice;

  const onChange = (keyvalue, e) => {
    setStorePrice({
      ...storePrice,
      [keyvalue]: e,
    });
  };

  const onPressDown = () => {
    setOpen(!open);
  };

  const onPressAdd = () => {
    const arr = new Array();
    if (
      !store_pricing_cnt ||
      !store_pricing_price ||
      !store_pricing_days ||
      !store_pricing_time
    ) {
      Alert.alert('입력칸을 확인해주세요.');
    } else {
      if (priceList === null || data === null) {
        arr.push(storePrice);
      } else {
        arr.push(...priceList, storePrice);
      }
    }
    if (value !== 'edit') {
      getData(arr);
      setPriceList(arr);
    } else {
      onPressPut();
    }

    setStorePrice({
      store_pricing_cnt: null,
      store_pricing_price: null,
      store_pricing_days: null,
      store_pricing_time: null,
    });
    setDays(null);
  };

  const onPressPut = () => {
    apis.putPricing(storeId, storePrice).then(res => {
      if (res.data.result === '000') {
        const id = res.data.data;
        const list = !data
          ? [{...storePrice, store_pricing_idx: id.lastInsertId}]
          : [...data, {...storePrice, store_pricing_idx: id.lastInsertId}];

        getData(list);
        setPriceList(list);
      }
    });
  };

  const onPressDelete = e => {
    if (value !== 'edit') {
      const filterList = priceList?.filter((el, index) => index !== e);
      setPriceList(filterList);
      getData(filterList);
    } else {
      apis.deletePricing(storeId, e).then(res => {
        console.log(res.data);
        if (res.data.result === '000') {
          const filterList = priceList?.filter(
            el => el.store_pricing_idx !== e,
          );
          setPriceList(filterList);
        }
      });
    }
  };

  useEffect(() => {
    if (value === 'edit') {
      setPriceList(data);
    }
  }, []);

  return (
    <View>
      <View>
        <AddTitle>이용가격</AddTitle>
        <InputBtn
          onPress={() => {
            onPressAdd();
          }}>
          <Title size={12} color="#7d7d7d">
            +추가
          </Title>
        </InputBtn>
      </View>

      <Display content="space-between">
        <TouchableOpacity
          style={{width: '19%'}}
          hitSlop={HIT_SLOP}
          activeOpacity={0.8}
          onPress={() => onPressDown()}>
          <InputBox>
            <Display content="space-evenly">
              <Title color={days ? '#333' : '#d7d7d7'} size={13} right={5}>
                {days ? days : '요일'}
              </Title>
              <Img source={IconDown} width={12} resizeMode="contain" />
            </Display>
          </InputBox>
        </TouchableOpacity>
        {open ? (
          <Dropdown
            data={dropdownData}
            width={19}
            getData={onChange}
            setData={setDays}
            onPressDown={onPressDown}
          />
        ) : (
          ''
        )}
        <InputBox width="21%">
          <Input
            placeholderTextColor="#d7d7d7"
            placeholder="예)60"
            keyboardType="number-pad"
            maxLength={3}
            onChangeText={e => onChange('store_pricing_time', e)}
            value={store_pricing_time}
            name="store_pricing_time"
          />
          <Title size={14} color="#7d7d7d">
            분
          </Title>
        </InputBox>

        <InputBox width="20%">
          <Input
            placeholderTextColor="#d7d7d7"
            placeholder="예) 1"
            keyboardType="number-pad"
            maxLength={3}
            onChangeText={e => onChange('store_pricing_cnt', e)}
            value={store_pricing_cnt}
            name="store_pricing_cnt"
          />
          <Title size={14} color="#7d7d7d">
            회
          </Title>
        </InputBox>
        <InputBox width="36%">
          <Input
            placeholderTextColor="#d7d7d7"
            placeholder="예) 12,000"
            keyboardType="number-pad"
            onChangeText={e => onChange('store_pricing_price', e)}
            value={store_pricing_price}
            name="store_pricing_price"
          />
          <Title size={14} color="#7d7d7d">
            원
          </Title>
        </InputBox>
      </Display>
      {value === 'edit' ? (
        ''
      ) : (
        <Zindex bottom={5}>
          {priceList &&
            priceList?.map((i, k) => {
              const day = i.store_pricing_days;
              const dayValue = day.indexOf('6') === -1 ? '평일' : '주말';
              return (
                <Display top={10} key={k}>
                  <TouchableOpacity
                    onPress={() =>
                      onPressDelete(
                        !i.store_pricing_idx ? k : i.store_pricing_idx,
                      )
                    }>
                    <Img source={IconDelete} width={22} resizeMode="contain" />
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <Title size={14}>{` ${dayValue} / ${
                      i.store_pricing_time
                    }분 / ${i.store_pricing_cnt}회 / ${Number(
                      i.store_pricing_price,
                    ).toLocaleString()}원`}</Title>
                  </TouchableOpacity>
                </Display>
              );
            })}
        </Zindex>
      )}
    </View>
  );
};

const InputBox = styled(View)`
  width: ${props => props.width || '100%'};
  height: 50px;
  border-radius: 5px;
  padding: 5px 12px;
  border-width: 1px;
  border-color: #d7d7d7;
  border-style: solid;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
`;

const Input = styled(TextInput)`
  width: ${props => props.width || '100%'};
  height: 50px;
  border-radius: 5px;
  padding: 5px;
  color: #333;
`;

export default StorePrice;
