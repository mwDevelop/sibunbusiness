import React, {useEffect, useState} from 'react';
import {ScrollView, TouchableOpacity, View} from 'react-native';
import apis from '../../api/apis';
import {useRecoilValue} from 'recoil';
import {storeIdState} from '../../recoil/atom';

import {
  Container,
  BtnWrap,
  Btn,
  Display,
  Title,
} from '../../styles/styledComponent';

import {styled} from 'styled-components';
import VoucherCard from './VoucherCard';
import {useTheme} from '@react-navigation/native';

const VoucherLists = ({navigation, route}) => {
  const {colors} = useTheme();
  const [deleteBtn, setDeleteBtn] = useState(false);
  const [deletItems, setDelteItems] = useState(null);
  const [data, setData] = useState();
  const [updateList, setUpdateList] = useState();

  const storeId = useRecoilValue(storeIdState);

  useEffect(() => {
    apis.getVoucherList(storeId).then(res => {
      if (res.data.result === '000') {
        setData(res?.data?.list);
      }
    });
    route?.params?.state && navigation.setParams({state: null});
  }, [route?.params?.state, storeId, updateList]);

  const onPressDelete = () => {
    deletItems?.map((id, index) => {
      apis.deleteVoucher(storeId, id).then(res => {
        if (index + 1 === deletItems?.length) {
          setUpdateList(updateList + 1);
          setDelteItems(null);
        }
      });
    });

    if (deletItems?.length === data?.length) {
      setData(null);
      setDelteItems(null);
    } else {
    }

    setDeleteBtn(!deleteBtn);
  };

  const onPressCheck = id => {
    const arr = [];
    if (!deletItems) {
      arr.push(id);
    } else {
      if (deletItems.includes(id)) {
        const result = deletItems.filter(el => el !== id);
        arr.push(...result);
      } else {
        arr.push(...deletItems, id);
      }
    }
    setDelteItems(arr);
  };

  const onPressAll = () => {
    const arr = [];
    data.map((i, k) => {
      arr.push(i.store_voucher_idx);
    });
    setDelteItems(arr);
  };

  const onPressDeleteBtn = () => {
    setDeleteBtn(!deleteBtn);
    if (deleteBtn) {
      setDelteItems(null);
    }
  };

  return (
    <Container>
      <Scroll>
        <Wrap>
          {deleteBtn ? (
            <TouchableOpacity onPress={() => onPressAll()}>
              <Title bottom={25} top={5}>
                전체선택
              </Title>
            </TouchableOpacity>
          ) : (
            ''
          )}

          {data &&
            data?.map((i, k) => {
              return (
                <VoucherCard
                  key={k}
                  data={i}
                  deleteBtn={deleteBtn}
                  onPressCheck={onPressCheck}
                  checkValue={deletItems?.includes(i.store_voucher_idx)}
                  navigation={navigation}
                />
              );
            })}
        </Wrap>
      </Scroll>
      <BtnWrap>
        <Display>
          <Btn onPress={() => onPressDeleteBtn()} width={50} bg="#e9e9e9">
            <Title color="#444" size={18}>
              {deleteBtn ? '취소' : '삭제'}
            </Title>
          </Btn>
          {deleteBtn ? (
            <Btn
              width={50}
              onPress={() => onPressDelete()}
              disabled={deletItems === null}>
              <Title color="#fff" size={18}>
                {deletItems === null ? 0 : deletItems?.length}개 ,삭제
              </Title>
            </Btn>
          ) : (
            <Btn
              width={50}
              bg={colors.mainColor}
              onPress={() =>
                navigation.navigate('AddVoucherScreen', {status: 'add'})
              }>
              <Title color="#fff" size={18}>
                새로 만들기
              </Title>
            </Btn>
          )}
        </Display>
      </BtnWrap>
    </Container>
  );
};

const Scroll = styled(ScrollView)`
  border-top-width: 1px;
  border-color: #e9e9e9;

  margin-bottom: 80px;
`;

const Wrap = styled(View)`
  padding: 18px 20px;
`;
export default VoucherLists;

{
  /* <Display
                  key={k}
                  content="space-between"
                  style={{marginBottom: 20}}>
                  <View>
                    <Title>{i.store_voucher_title}</Title>
                    <Title>{i.store_voucher_discount_rate}%</Title>
                    <Title>
                      {i.store_voucher_beg_date} ~ {i.store_voucher_end_date}
                    </Title>
                    <Title>
                      {Time(i.store_voucher_beg_time)} ~{' '}
                      {Time(i.store_voucher_end_time)}
                    </Title>
                  </View>
                  <Display>
                    <Btn onPress={() => onPressEdit(i)}>
                      <Title>수정</Title>
                    </Btn>
                    <Btn onPress={e => delteVoucher(i?.store_voucher_idx)}>
                      <Title>삭제</Title>
                    </Btn>
                  </Display>
                </Display> */
}
