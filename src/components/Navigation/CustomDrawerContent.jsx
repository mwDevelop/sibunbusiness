import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {Title, Img, Display} from '../../styles/styledComponent';
import apis from '../../api/apis';
import {styled} from 'styled-components';

import {useRecoilState, useRecoilValue} from 'recoil';
import {addStoreState, storeIdState, loginState} from '../../recoil/atom';
import axios from 'axios';

import IconCheck from '../../assets/image/drawer_check.png';

import IconSetting from '../../assets/image/setting.png';
import IconDown from '../../assets/image/down.png';
import IconDownG from '../../assets/image/down_g.png';
import IconUp from '../../assets/image/up.png';
import IconLogout from '../../assets/image/logout.png';
import IconSimg from '../../assets/image/main_img.png';
import {useDrawerStatus} from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ToastMessage} from '../Toast/ToastMessage';

const CustomDrawerContent = ({navigation}) => {
  const Height = Dimensions.get('window').height - getStatusBarHeight();
  const update = useRecoilValue(addStoreState);
  const [, setLogin] = useRecoilState(loginState);
  const [user, setUser] = useState();
  const [selectedStore, setSelectedStore] = useState();
  const [store, setStore] = useState();
  const [openDropdown, setOpenDropdown] = useState(false);
  const [openList, setOpenList] = useState(false);
  const [storeId, setStoreId] = useRecoilState(storeIdState);

  const drawerList = [
    {title: '예약관리', screen: 'StoremainScreen'},
    {title: '스케줄관리', screen: 'ScheduleScreen'},
    {title: '후기관리', screen: 'Reivew'},
    {title: '할인권', screen: 'Voucher'},
    {title: '나의 매장 관리', screen: 'InfoManagement'},
  ];

  const managementList = [
    {title: '기본 정보 수정', screen: 'EditStroeScreen'},
    {title: '이용 가격 수정', screen: 'EditStorePriceScreen'},
    {title: '방 추가', screen: 'AddRoomScreen'},
    {title: '방 수정', screen: 'EditRoomScreen'},
  ];

  const isDrawerClose = useDrawerStatus() === 'closed';

  function getAllData() {
    axios.all([apis.getUser(), apis.getStore()]).then(
      axios.spread((res1, res2) => {
        setUser(res1.data.data);
        const storelist = res2.data.list;
        if (res2.data.result === '000') {
          const filterSelected = storelist.filter(
            el => el.store_idx === storeId,
          );
          const anotherStore = storelist.filter(el => el.store_idx !== storeId);
          setSelectedStore(...filterSelected);
          setStore(anotherStore);
        }
      }),
    );
  }

  useEffect(() => {
    getAllData();
  }, []);

  useEffect(() => {
    setOpenList(false);
    setOpenDropdown(false);
    getAllData();
  }, [storeId, update, isDrawerClose]);

  const onPressStore = (e, name) => {
    setStoreId(e);
    setOpenDropdown(false);
    ToastMessage(`'${name}'으로 이동합니다.⛳️`);
    navigation.navigate('StoremainScreen');
  };

  const onPressAdd = value => {
    const checkValue = value === 'edit';

    checkValue
      ? navigation.navigate('AddStore', {
          screen: 'EditStroeScreen',
          params: {
            screen: 'stack',
          },
        })
      : navigation.navigate('AddStore', {
          screen: 'AddStoreScreen',
          params: {
            screen: 'drawer',
          },
        });

    checkValue ? setOpenList(false) : setOpenDropdown(false);
    setOpenDropdown(false);
  };

  const onPressMovePage = (screen, index) => {
    if (index === 4) {
      setOpenList(!openList);
    } else {
      navigation.navigate(screen);
    }
  };

  const logout = async () => {
    const keys = ['accessToken', 'refreshToken', 'userInfo'];
    await AsyncStorage.multiRemove(keys);
    setLogin(false);
    // setTimeout(() => {
    //   navigation.navigate('IntroScreen');
    // }, 1000);

    console.log('logout');
  };

  return (
    <View
      style={{
        zIndex: -100,
        backgroundColor: '#fff',
        backgroundColor: '#fff',
        height: '100%',
      }}>
      {user && (
        <Top>
          <Display content="space-between">
            <Btn onPress={() => navigation.navigate('EditUserScreen')}>
              <Img width={22} source={IconSetting} resizeMode="contain" />
              <Title color="#fff" left={3} size={14}>
                정보수정
              </Title>
            </Btn>
            <Btn onPress={() => logout()}>
              <Img width={22} source={IconLogout} resizeMode="contain" />
              <Title color="#7d7d7d" left={3} size={14}>
                로그아웃
              </Title>
            </Btn>
          </Display>

          <Wrap>
            {!user.pt_profile_img ? (
              <Profile></Profile>
            ) : (
              <Img
                src={user?.pt_profile_img}
                width={90}
                bottom={5}
                radius={100}
              />
            )}

            <Title color="#fff" size={20} weight={600}>
              {user.pt_name}
            </Title>
            <Title color="#747474">{user.pt_cellphone}</Title>
          </Wrap>
        </Top>
      )}
      {selectedStore && (
        <SelectedInfo>
          <Display>
            <Img
              width={50}
              radius={10}
              source={
                !!selectedStore?.store_main_simg
                  ? {uri: selectedStore?.store_main_simg}
                  : IconSimg
              }
            />

            <Title left={5} color="#222" weight={600} size={15}>
              {selectedStore.store_name}
            </Title>
          </Display>
          <Img width={22} source={IconCheck} resizeMode="contain" />
        </SelectedInfo>
      )}

      {store &&
        (store?.length >= 1 ? (
          <View style={{zIndex: 600}}>
            <DropdowBox
              activeOpacity={0.9}
              onPress={() => setOpenDropdown(!openDropdown)}>
              <Title color="#444" size={14}>
                다른 매장
              </Title>
              <Img width={13} source={IconDown} resizeMode="contain" />
            </DropdowBox>
            {openDropdown ? (
              <Dropdown
                style={{
                  backgroundColor: '#fff',
                  height: store?.length * 90 > 330 ? 330 : store?.length * 130,
                }}>
                <ScrollView style={{backgroundColor: '#fff'}}>
                  {store?.map((i, k) => {
                    return (
                      <Store
                        key={k}
                        activeOpacity={0.8}
                        onPress={() => onPressStore(i.store_idx, i.store_name)}>
                        <Img
                          width={50}
                          radius={10}
                          source={
                            !!i?.store_main_simg
                              ? {uri: i?.store_main_simg}
                              : IconSimg
                          }
                        />
                        <Title left={5} color="#222" weight={600} size={15}>
                          {i.store_name}
                        </Title>
                      </Store>
                    );
                  })}
                </ScrollView>
                <AddStore margin="auto" onPress={() => onPressAdd()}>
                  <Title color="#444" size={15}>
                    + 매장 추가하기
                  </Title>
                </AddStore>
              </Dropdown>
            ) : (
              ''
            )}
          </View>
        ) : (
          <AddStore
            bg="#e9e9e9"
            width={95}
            margin="10px auto 20px auto"
            onPress={() => onPressAdd()}>
            <Title color="#444" size={15}>
              + 매장 추가하기
            </Title>
          </AddStore>
        ))}
      <Bar />
      <View
        style={{
          height: Math.floor(Height) - 380,
          paddingBottom: 30,
          zIndex: 500,
          backgroundColor: '#fff',
        }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <ScreenList>
            {drawerList.map((i, k) => {
              return (
                <Screen
                  style={{flex: 1}}
                  key={k}
                  onPress={() => onPressMovePage(i.screen, k)}
                  activeOpacity={0.8}>
                  <Title size={15}>{i.title}</Title>
                  {k === 4 ? (
                    <Img
                      width={13}
                      source={openList ? IconUp : IconDownG}
                      resizeMode="contain"
                    />
                  ) : (
                    ''
                  )}
                </Screen>
              );
            })}
          </ScreenList>

          {openList ? (
            <View style={{paddingLeft: 30, paddingTop: 5}}>
              {managementList.map((i, k) => {
                return (
                  <TouchableWithoutFeedback
                    activeOpacity={0.8}
                    onPress={() => {
                      i.screen === 'EditStroeScreen'
                        ? onPressAdd('edit')
                        : navigation.navigate(i.screen);
                    }}
                    key={k}>
                    <Title size={14} color="#7d7d7d" top={6} bottom={6}>
                      {i.title}
                    </Title>
                  </TouchableWithoutFeedback>
                );
              })}
            </View>
          ) : (
            ''
          )}
        </ScrollView>
      </View>
    </View>
  );
};
const Top = styled(View)`
  background-color: #222;
  padding: 10px 10px 20px 10px;
  height: 220px;
`;

const Btn = styled(TouchableOpacity)`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Profile = styled(View)`
  width: 65px;
  height: 65px;
  border-radius: 50px;
  background-color: #d9d9d9;
  margin-bottom: 15px;
`;

const Wrap = styled(View)`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 25px;
`;

const SelectedInfo = styled(View)`
  padding: 20px 15px;
  height: 100px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const DropdowBox = styled(TouchableOpacity)`
  width: 90%;
  height: 38px;

  border-width: 1px;
  border-color: #e9e9e9;

  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin: 5px auto 20px auto;

  padding: 0px 10px;
`;

const Dropdown = styled(View)`
  width: 90%;

  border-left-width: 1px;
  border-right-width: 1px;
  border-bottom-width: 1px;
  border-color: #e9e9e9;
  padding: 10px;
  margin: auto;
  z-index: 800;

  position: absolute;
  background-color: #fff;
  top: 43px;
  left: 14px;
`;

const Store = styled(TouchableOpacity)`
  flex-direction: row;
  align-items: center;
  margin: 5px 0px;
`;

const AddStore = styled(TouchableOpacity)`
  width: ${props => props.width || 100}%;
  height: 40px;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.bg || '#FFF'};
  margin: ${props => props.margin};
`;

const Screen = styled(TouchableOpacity)`
  height: 55px;
  padding: 0px 20px;
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;

  border-bottom-width: 1px;
  border-color: #f3f3f3;
`;

const ScreenList = styled(View)`
  position: relative;
  z-index: -100;
`;

const Bar = styled(View)`
  border-top-width: 10px;
  border-color: #f0f0f0;
  z-index: -100;
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

export default CustomDrawerContent;
