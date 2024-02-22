import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import NavigationHeader from '../components/Header/NavigationHeader';
import {Container, Box, Title} from '../styles/styledComponent';
import styled from 'styled-components';
import RoomInputs from '../components/Room/RoomInputs';
import apis from '../api/apis';

import {useRecoilValue} from 'recoil';
import {storeIdState} from '../recoil/atom';
import BottomBtn from '../components/BottomBtn/BottomBtn';
import {useTheme} from '@react-navigation/native';

const EditRoomScreen = ({navigation}) => {
  const {colors} = useTheme();
  const storeId = useRecoilValue(storeIdState);
  const [roomList, setRoomList] = useState();
  const [editInfo, setEditInfo] = useState();
  const [postEdit, setPostEdit] = useState(false);
  const [update, setUpdate] = useState();
  const getRoomList = async () => {
    const result = await apis.getRooms(storeId);
    setRoomList(result?.data?.list);
  };

  useEffect(() => {
    getRoomList();
    setEditInfo();
  }, [update]);

  const onPressEdit = e => {
    setPostEdit(true);
  };

  return (
    <Container>
      <NavigationHeader
        navigation={navigation}
        value="stack"
        title={'방 수정'}
      />
      <View>
        <Boxs>
          <Title color="#7d7d7d" size={15}>
            방을 선택해주세요.
          </Title>

          <Wrap>
            {roomList &&
              roomList?.map((room, k) => {
                const check = editInfo?.store_room_idx === room?.store_room_idx;
                return (
                  <Room
                    key={k}
                    right={10}
                    onPress={() => setEditInfo(room)}
                    bg={check ? '#F335620D' : '#fff'}
                    bordercolor={check ? colors.mainColor : '#e9e9e9'}>
                    <Title color={check ? colors.mainColor : '#7d7d7d'}>
                      {room?.store_room_name}
                    </Title>
                  </Room>
                );
              })}
          </Wrap>
        </Boxs>
        <RoomInputs
          onPress={onPressEdit}
          value={'edit'}
          editInfo={editInfo}
          postEdit={postEdit}
          storeId={storeId}
          setUpdate={setUpdate}
          setPostEdit={setPostEdit}
        />
      </View>
      <BottomBtn title={'수정완료'} onPress={onPressEdit} />
    </Container>
  );
};

const Boxs = styled(View)`
  padding: 20px 16px;
  border-bottom-width: 1px;
  border-color: #e9e9e9;
`;

const Room = styled(Box)`
  padding: 15px;
`;

const Wrap = styled(View)`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  margin-top: 20px;
`;

export default EditRoomScreen;
