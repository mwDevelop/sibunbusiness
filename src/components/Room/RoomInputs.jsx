import React, {useEffect, useState} from 'react';
import {View, TouchableOpacity, Text, TextInput, Alert} from 'react-native';
import {Title} from '../../styles/styledComponent';
import CheckBox from '../CheckBox/CheckBox';
import styled from 'styled-components';

import apis from '../../api/apis';

const RoomInputs = ({
  onPress,
  value,
  editInfo,
  postEdit,
  storeId,
  setUpdate,
  setPostEdit,
}) => {
  const CheckValue = value === 'edit';

  const [addInfo, setAddInfo] = useState({
    store_room_name: '',
    store_room_desc: '',
    store_room_orderby: '',
    store_room_use_yn: '',
  });

  const {store_room_name, store_room_desc, store_room_use_yn} = addInfo;
  const data = [
    {title: 'Y', value: 'y'},
    {title: 'N', value: 'n'},
  ];

  const onPressCheck = e => {
    onChange('store_room_use_yn', e);
  };

  const onChange = (keyvalue, e) => {
    setAddInfo({
      ...addInfo,
      [keyvalue]: e,
    });
  };

  function inputEmpty() {
    setAddInfo({
      store_room_name: '',
      store_room_desc: '',
      store_room_use_yn: '',
    });
  }

  function postEditFuc() {
    apis.postRooms(storeId, editInfo?.store_room_idx, addInfo).then(res => {
      if (res.data.result === '000') {
        Alert.alert('수정이 완료되었습니다!');
        inputEmpty();
        setUpdate(editInfo?.store_room_idx);
        setPostEdit(false);
      }
    });
  }

  useEffect(() => {
    if (CheckValue) {
      setAddInfo({
        store_room_name: editInfo?.store_room_name,
        // store_room_desc: editInfo?.store_room_desc,
        store_room_use_yn: editInfo?.store_room_use_yn,
      });
      setUpdate();
    }
  }, [editInfo?.store_room_idx]);

  useEffect(() => {
    if (postEdit) {
      postEditFuc();
    }
  }, [postEdit]);

  const onPressAdd = () => {
    onPress(addInfo);
    inputEmpty();
  };

  return (
    <View>
      <InputWrap>
        <InputTitle>방이름</InputTitle>
        <Input
          onChangeText={e => onChange('store_room_name', e)}
          name="store_room_name"
          value={store_room_name}
        />
      </InputWrap>
      {/* <InputWrap>
        <InputTitle>상세설명</InputTitle>
        <Input
          onChangeText={e => onChange('store_room_desc', e)}
          name="store_room_desc"
          value={store_room_desc}
        />
      </InputWrap> */}
      <InputWrap>
        <InputTitle>사용여부</InputTitle>
        {data.map((item, k) => {
          return (
            <CheckBoxWrap key={k}>
              <CheckBox
                onPressCheck={onPressCheck}
                id={item?.value}
                isCheck={store_room_use_yn === item.value}
                width={20}
              />
              <Title size={18} left={2}>
                {item.title}
              </Title>
            </CheckBoxWrap>
          );
        })}
      </InputWrap>
      {value === 'add' ? (
        <AddBtn activeOpacity={0.8} onPress={() => onPressAdd()}>
          <Title weight={400}>+ 방 추가하기</Title>
        </AddBtn>
      ) : (
        ''
      )}
    </View>
  );
};

const InputWrap = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 65px;
  border-bottom-width: 1px;
  border-color: #e9e9e9;
  padding: 0px 20px;
`;
const Input = styled(TextInput)`
  width: 75%;
`;

const InputTitle = styled(Text)`
  width: 25%;
  font-size: 17px;
  font-weight: 600;
  color: #333;
`;

const CheckBoxWrap = styled(View)`
  margin-right: 20px;
  display: flex;
  align-items: center;

  flex-direction: row;
`;

const AddBtn = styled(TouchableOpacity)`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60px;
  border-bottom-width: 10px;
  border-color: #e9e9e9;
`;

export default RoomInputs;
