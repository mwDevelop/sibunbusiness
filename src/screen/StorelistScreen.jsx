import React, {useEffect, useState} from 'react';

import {View, TouchableOpacity, FlatList, Alert} from 'react-native';

import {useRecoilState, useRecoilValue} from 'recoil';
import {
  storeIdState,
  loginState,
  storeState,
  addStoreState,
} from '../recoil/atom';
import {styled} from 'styled-components';
import {Img, Title} from '../styles/styledComponent';
import IconSmile from '../assets/image/smile.png';
import IconAdd from '../assets/image/store_add.png';

import apis from '../api/apis';

import StoreListHeader from '../components/Header/StoreListHeader';
import CheckBox from '../components/CheckBox/CheckBox';
import BottomBtn from '../components/BottomBtn/BottomBtn';
import {ToastMessage} from '../components/Toast/ToastMessage';

const StorelistScreen = ({navigation, route}) => {
  const login = useRecoilValue(loginState);
  const [, setStoreId] = useRecoilState(storeIdState);
  const [, setStore] = useRecoilState(storeState);
  const [edit, setEdit] = useState(false);
  const [deletItems, setDelteItems] = useState(null);
  const [flatlistData, setFlatlistData] = useState();
  const update = useRecoilValue(addStoreState);

  useEffect(() => {
    if (login) {
      apis.getStore().then(res => {
        if (res?.data?.result === '000') {
          const data = res?.data?.list;
          const filter = [...data, 'last'];
          setFlatlistData(filter);
        } else {
          setFlatlistData(['none']);
        }
      });
    } else {
      navigation.navigate('LoginScreen');
    }
  }, [login, deletItems, route?.params?.state, update]);

  const onPressStore = store => {
    navigation.navigate('DrawerNavigation', {
      screen: 'StoremainScreen',
      params: {
        storeId: store?.store_idx,
      },
    });
    setStoreId(store?.store_idx);
    setStore({open: store?.store_open_time, close: store?.store_close_time});
  };

  function deletedReset() {
    setDelteItems(null);
    setEdit(false);
    ToastMessage('삭제되었습니다.');
  }

  const onPressDelete = async () => {
    await deletItems.map(i => {
      apis.deleteStore(i).then(res => {
        if (res.data.result === '000') {
        }
      });
    });
    setTimeout(() => deletedReset(), 1000);
  };

  const onPressEdit = () => {
    setEdit(!edit);
    if (!edit) {
      setDelteItems(null);
    }
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

  const onPressAdd = () => {
    navigation.navigate('AddStore', {
      screen: 'AddStoreScreen',
      params: {
        screen: 'StorelistScreen',
      },
    });
    setEdit(false);
  };

  const renderItem = ({item}) => {
    return (
      <RenderItem width={item === 'none' ? '100%' : '48%'}>
        {item === 'last' || item === 'none' ? (
          <Store onPress={() => onPressAdd()}>
            <Img source={IconAdd} width={125} />
            <StoreName color="#444" weight={600}>
              매장추가
            </StoreName>
          </Store>
        ) : (
          <Store onPress={() => onPressStore(item)} disabled={edit}>
            {edit ? (
              <Position>
                <CheckBox
                  onPressCheck={onPressCheck}
                  id={item?.store_idx}
                  isCheck={deletItems?.includes(item?.store_idx)}
                />
              </Position>
            ) : (
              ''
            )}
            {!!item?.store_main_simg ? (
              <Img
                resizeMode="cover"
                width={125}
                height={125}
                radius={10}
                source={{uri: item?.store_main_simg}}
              />
            ) : (
              <MainImg color={'#ffd0d0'}>
                <Smile source={IconSmile} width={80} resizeMode="contain" />
              </MainImg>
            )}
            <StoreName color="#444" weight={600}>
              {item.store_name}
            </StoreName>
          </Store>
        )}
      </RenderItem>
    );
  };

  return (
    <Container>
      <TopWrap>
        {flatlistData && (
          <StoreListHeader
            onPressEdit={onPressEdit}
            edit={edit}
            btnvalue={flatlistData[0] === 'none'}
          />
        )}

        <Title size={14} color="#444">
          {edit ? '삭제할 매장을 선택해주세요' : '관리할 매장을 선택해주세요'}
        </Title>
      </TopWrap>

      <BottomWrap paddingBttom={edit ? 130 : 80}>
        {flatlistData && (
          <StoreList
            data={flatlistData}
            renderItem={renderItem}
            keyExtractor={data => data.store_idx}
            numColumns={2}
            columnWrapperStyle={{justifyContent: 'space-between'}}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={() => <Title>없다!</Title>}
          />
        )}
      </BottomWrap>
      {edit ? <BottomBtn onPress={onPressDelete} title="삭제하기" /> : ''}
    </Container>
  );
};

const Container = styled(View)`
  height: 100%;
  background-color: #fff;
  display: flex;
  align-items: center;
`;

const TopWrap = styled(View)`
  width: 100%;
  height: 60px;
  padding-left: 20px;
  padding-right: 20px;
  display: flex;
  align-items: center;
`;

const BottomWrap = styled(View)`
  padding-bottom: ${props => props.paddingBttom}px;
`;

const StoreList = styled(FlatList)`
  width: 80%;
  margin-top: 20px;
  padding-top: 20px;

  height: ${props => props.height}px;
`;

const Store = styled(TouchableOpacity)`
  display: flex;
  align-items: center;
  margin-bottom: 40px;
  z-index: 100;
`;

const StoreName = styled(Title)`
  margin-top: 10px;
  font-size: 15px;
`;

const Position = styled(View)`
  position: absolute;
  left: 5px;
  top: -8px;
  z-index: 100;
`;

const MainImg = styled(View)`
  width: 125px;
  height: 125px;
  border-radius: 5px;
  background-color: ${props => props.color};
`;

const Smile = styled(Img)`
  position: absolute;
  top: 25px;
  right: 20px;
`;

const RenderItem = styled(View)`
  width: ${props => props.width};
  margin-top: 10px;
`;

export default StorelistScreen;
