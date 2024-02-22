import React, {useEffect, useState} from 'react';
import {
  View,
  TouchableOpacity,
  Alert,
  ScrollView,
  Dimensions,
} from 'react-native';
import {Container, Display, Title, Img} from '../styles/styledComponent';
import NavigationHeader from '../components/Header/NavigationHeader';
import styled from 'styled-components';
import apis from '../api/apis';

import {useRecoilValue} from 'recoil';
import {storeIdState} from '../recoil/atom';

import IconDelete from '../assets/image/delete_btn.png';
import RoomInputs from '../components/Room/RoomInputs';

const AddRoomScreen = ({navigation}) => {
  const storeId = useRecoilValue(storeIdState);
  const [roomList, setRoomList] = useState();
  const [updateId, setUpdateId] = useState();

  useEffect(() => {
    apis.getRooms(storeId).then(res => {
      if (res.data.result === '000') {
        setRoomList(res.data.list);
      }
    });
  }, [updateId]);

  const onPressDelete = data => {
    apis
      .deleteRoom(data.store_room_by_store_idx, data.store_room_idx)
      .then(res => {
        if (res.data.result === '000') {
          const filter = roomList.filter(
            el => el.store_room_idx !== data.store_room_idx,
          );
          setRoomList(filter);
        }
      });
  };

  const onPressAdd = addInfo => {
    if (!addInfo?.store_room_name) {
      Alert.alert('입력 값을 확인해주세요.');
    } else {
      apis.putRooms(storeId, addInfo).then(res => {
        if (res.data.result === '000') {
          const idData = res.data.data;
          setUpdateId(idData.lastInsertId);
        }
      });
    }
  };

  // const onPressMove = () => {
  //   navigation.goBack();
  //   setTimeout(() => navigation.openDrawer(), 200);
  // };

  const Height = Dimensions.get('window').height - 330;

  return (
    <Container>
      <NavigationHeader
        navigation={navigation}
        value="stack"
        title={'방 추가'}
      />
      <RoomInputs onPress={onPressAdd} value={'add'} />
      <List heigth={Height}>
        <ScrollView>
          {roomList &&
            roomList?.map((room, k) => {
              const desc = !room.store_room_desc;
              return (
                <Item key={k}>
                  <TouchableOpacity
                    onPress={() => onPressDelete(room, k)}
                    activeOpacity={0.8}>
                    <Img source={IconDelete} width={22} resizeMode="contain" />
                  </TouchableOpacity>
                  <Title>
                    {room.store_room_name} /{' '}
                    {desc ? '' : `${room.store_room_desc} / `}
                    {room.store_room_use_yn.toUpperCase()}
                  </Title>
                </Item>
              );
            })}
        </ScrollView>
      </List>
    </Container>
  );
};

const List = styled(View)`
  padding: 20px 15px;
  height: ${props => props.heigth}px;
`;

const Item = styled(Display)`
  margin-bottom: 10px;
  height: 25px;
`;

export default AddRoomScreen;
