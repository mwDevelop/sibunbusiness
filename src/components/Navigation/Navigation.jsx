import React, {useEffect} from 'react';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {getHeaderTitle} from '@react-navigation/elements';

import StorelistScreen from '../../screen/StorelistScreen';
import StoremainScreen from '../../screen/StoremainScreen';
import LoginScreen from '../../screen/LoginScreen';
import ScheduleScreen from '../../screen/ScheduleScreen';
import SignUpScreen from '../../screen/SignUpScreen';
import AddStoreScreen from '../../screen/AddStoreScreen';
import EditStroeScreen from '../../screen/EditStroeScreen';
import ReservationDetailScreen from '../../screen/ReservationDetailScreen';
import AddVoucherScreen from '../../screen/AddVoucherScreen';
import ReviewScreen from '../../screen/ReviewScreen';
import WriteReviewScreen from '../../screen/WriteReviewScreen';
import IntroScreen from '../../screen/IntroScreen';
import AddOptions from '../Addstore/AddOptions';
import CustomDrawerContent from './CustomDrawerContent';

import VoucherLists from '../Voucher/VoucherLists';
import AddRoomScreen from '../../screen/AddRoomScreen';
import EditRoomScreen from '../../screen/EditRoomScreen';
import EditImgScreen from '../../screen/EditImgScreen';
import EditStorePriceScreen from '../../screen/EditStorePriceScreen';
import EditUserScreen from '../../screen/EditUserScreen';
import SignUpDone from '../Login/SignUpDone';

import NavigationHeader from '../Header/NavigationHeader';
import KakaoAddress from '../KakaoAddress/KakaoAddress';

import {useRecoilState} from 'recoil';
import {loginState, tokenState} from '../../recoil/atom';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {loginFun} from '../../utils/toekenFun';

import messaging from '@react-native-firebase/messaging';
import Toast from 'react-native-toast-message';
import {View, Text, Dimensions} from 'react-native';

const Theme = {
  colors: {
    mainColor: '#f33562',
  },
};

const Width = Dimensions.get('window').width;

const toastConfig = {
  selectedToast: ({text1}) => (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        height: 40,
        backgroundColor: '#000',
        paddingLeft: 20,
        paddingRight: 20,
        borderRadius: 18,
      }}>
      <Text
        style={{
          color: '#fff',
          fontFamily: 'Poppins-Regular',
        }}>
        {text1}
      </Text>
    </View>
  ),
};

const Navigation = ({}) => {
  const Stack = createNativeStackNavigator();
  const [login, setLogin] = useRecoilState(loginState);
  const [, setToken] = useRecoilState(tokenState);

  useEffect(() => {
    AsyncStorage.getItem('userInfo', async (err, result) => {
      if (result) {
        const info = JSON.parse(result);
        const data = {pt_cellphone: info?.pt_cellphone};
        const loginvalue = await loginFun(data);
        if (loginvalue) {
          setLogin(true);
        } else {
          setLogin(false);
        }
      } else {
        setLogin(false);
      }
    });
  }, [login]);

  useEffect(() => {
    requestUserPermission();
  }, []);

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      setToken(enabled);
    }
  };

  function AddStore() {
    return (
      <Stack.Navigator
        initialRouteName="AddStoreScreen"
        screenOptions={{
          header: ({navigation, options}) => {
            const title = getHeaderTitle(options);
            return (
              <NavigationHeader
                navigation={navigation}
                value={'stack'}
                title={title}
              />
            );
          },
        }}>
        <Stack.Screen
          name="AddStoreScreen"
          component={AddStoreScreen}
          options={{title: '매장추가'}}
        />
        <Stack.Screen
          name="AddOptions"
          component={AddOptions}
          options={{title: '부가서비스 추가'}}
        />
        <Stack.Screen
          name="KakaoAddress"
          component={KakaoAddress}
          options={{title: '주소검색'}}
        />

        <Stack.Screen
          name="EditStroeScreen"
          component={EditStroeScreen}
          options={{title: '매장수정'}}
        />
      </Stack.Navigator>
    );
  }

  function Reivew({navigation}) {
    return (
      <Stack.Navigator initialRouteName="ReviewScreen">
        <Stack.Screen
          name="ReviewScreen"
          component={ReviewScreen}
          options={{
            header: ({navigation}) => {
              return (
                <NavigationHeader
                  navigation={navigation}
                  value="drawer"
                  title={'리뷰리스트'}
                />
              );
            },
          }}
        />

        <Stack.Screen
          name="WriteReviewScreen"
          component={WriteReviewScreen}
          options={{
            header: ({navigation}) => {
              return (
                <NavigationHeader
                  navigation={navigation}
                  value="stack"
                  title={'답변달기'}
                />
              );
            },
          }}
        />
      </Stack.Navigator>
    );
  }

  function Voucher() {
    return (
      <Stack.Navigator
        screenOptions={{
          header: ({navigation, options}) => {
            const title = getHeaderTitle(options);
            return (
              <NavigationHeader
                navigation={navigation}
                value={title === '쿠폰 관리' ? 'drawer' : 'stack'}
                title={title}
              />
            );
          },
        }}>
        <Stack.Screen
          name="VoucherLists"
          component={VoucherLists}
          options={{title: '쿠폰 관리'}}
        />
        <Stack.Screen
          name="AddVoucherScreen"
          component={AddVoucherScreen}
          options={{title: '쿠폰 등록'}}
        />
      </Stack.Navigator>
    );
  }

  function DrawerNavigation() {
    const Drawer = createDrawerNavigator();
    const navigation = useNavigation();

    return (
      <Drawer.Navigator
        initialRouteName="StoremainScreen"
        drawerContent={() => <CustomDrawerContent navigation={navigation} />}>
        {login && (
          <Drawer.Group
            screenOptions={{
              headerShown: false,
              unmountOnBlur: true,
            }}>
            <Drawer.Screen name="StoremainScreen" component={StoremainScreen} />
            <Drawer.Screen name="ScheduleScreen" component={ScheduleScreen} />
            <Drawer.Screen name="Reivew" component={Reivew} />
            <Drawer.Screen name="Voucher" component={Voucher} />
            <Drawer.Screen name="AddStore" component={AddStore} />
            <Drawer.Screen name="AddRoomScreen" component={AddRoomScreen} />
            <Drawer.Screen name="EditRoomScreen" component={EditRoomScreen} />
            <Drawer.Screen name="EditImgScreen" component={EditImgScreen} />
            <Drawer.Screen
              name="EditStorePriceScreen"
              component={EditStorePriceScreen}
            />
            <Drawer.Screen name="EditUserScreen" component={EditUserScreen} />
          </Drawer.Group>
        )}
      </Drawer.Navigator>
    );
  }

  function IntroNavigation({navigation}) {
    return (
      <Stack.Navigator
        screenOptions={{
          headerTitleAlign: 'center',
          height: 70,
          header: ({navigation, options}) => {
            const title = getHeaderTitle(options);
            return (
              <NavigationHeader
                navigation={navigation}
                value="stack"
                title={title}
              />
            );
          },
        }}>
        <Stack.Screen
          name="IntroScreen"
          component={IntroScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="LoginScreen"
          component={LoginScreen}
          options={{title: '로그인/회원가입'}}
        />
        <Stack.Screen
          name="SignUpScreen"
          component={SignUpScreen}
          options={{title: '회원가입'}}
        />
        <Stack.Screen
          name="SignUpDone"
          component={SignUpDone}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    );
  }

  return (
    <>
      <NavigationContainer theme={Theme}>
        {login === null ? (
          ''
        ) : (
          <Stack.Navigator>
            {login ? (
              <Stack.Group screenOptions={{headerShown: false}}>
                <Stack.Screen
                  name="StorelistScreen"
                  component={StorelistScreen}
                  options={{title: '매장선택'}}
                />
                <Stack.Screen
                  name="EditUserScreen"
                  component={EditUserScreen}
                />
                <Stack.Screen name="AddStore" component={AddStore} />
                <Stack.Screen
                  name="ReservationDetailScreen"
                  component={ReservationDetailScreen}
                />
                <Stack.Screen
                  name="DrawerNavigation"
                  component={DrawerNavigation}
                />

                <Stack.Screen
                  name="IntroScreen"
                  component={IntroScreen}
                  options={{title: '인드로', headerShown: false}}
                />
              </Stack.Group>
            ) : (
              <Stack.Screen
                name="IntroNavigation"
                component={IntroNavigation}
                options={{title: '인드로', headerShown: false}}
              />
            )}
          </Stack.Navigator>
        )}
      </NavigationContainer>
      <Toast config={toastConfig} />
    </>
  );
};

export default Navigation;
