import React, {useEffect, useState} from 'react';
import {Modal, TouchableOpacity, View, TextInput, Alert} from 'react-native';
import {styled} from 'styled-components';
import {Title, Box} from '../../styles/styledComponent';
import {useTheme} from '@react-navigation/native';

const Option = ({
  getData,
  value,
  modalVisible,
  setModalVisible,
  optionData,
  setOptionData,
  selectedOption,
  setSelectedOption,
}) => {
  const {colors} = useTheme();
  const valueCheck = value === 'edit';
  const [add, setAdd] = useState(null);

  useEffect(() => {
    if (valueCheck) {
      setSelectedOption(optionData);
    }
  }, []);

  const onPressOption = e => {
    const arr = new Array();
    if (!selectedOption) {
      arr.push(e);
    } else {
      if (selectedOption?.includes(e)) {
        const filter = selectedOption.filter(el => el !== e);
        arr.push(...filter);
      } else {
        arr.push(...selectedOption, e);
      }
    }
    setSelectedOption(arr);
  };

  const onPressPush = () => {
    if (!add) {
      Alert.alert('키워드를 입력해주세요.');
    } else {
      setOptionData([...optionData, add]);
      if (valueCheck) {
        setSelectedOption([...selectedOption, add]);
      }
      setModalVisible(false);
    }
  };

  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        statusBarTranslucent={true}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <Bg onPress={() => setModalVisible(false)}>
          <View
            style={{
              width: '95%',
              position: 'absolute',
              top: '50%',
              left: '3%',
            }}>
            <Input
              placeholder="#키워드를 입력해주세요."
              placeholderTextColor={'#fff'}
              onChangeText={e => setAdd(e)}
              maxLength={10}
            />
            <Btn onPress={() => onPressPush()}>
              <Title
                size={14}
                weight={400}
                color={add?.length < 1 ? '#989898' : '#fff'}>
                완료
              </Title>
            </Btn>
          </View>
        </Bg>
      </Modal>
      <Options>
        {optionData &&
          optionData?.map((i, k) => {
            const checkValue = selectedOption?.includes(i);
            return (
              <OptionBox
                activeOpacity={0.8}
                right={(k + 1) % 4 === 0 ? 0 : 9}
                key={k}
                onPress={() => onPressOption(i)}
                bordercolor={checkValue ? colors.mainColor : '#d7d7d7'}
                bg={checkValue ? 'rgba(243, 53, 98, 0.05)' : '#FFF'}>
                <Title
                  size={13}
                  color={checkValue ? colors.mainColor : '#d7d7d7'}
                  numberOfLines={2}>
                  {i}
                </Title>
              </OptionBox>
            );
          })}
      </Options>
    </View>
  );
};

const Options = styled(View)`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  z-index: 100;
`;

const OptionBox = styled(Box)`
  width: 23%;
  height: 45px;
`;

const Input = styled(TextInput)`
  border-bottom-width: 1px;
  border-color: #fff;

  height: 60px;
  padding: 0px 20px;

  display: flex;
  color: #fff;
  font-size: 16px;
`;

const Btn = styled(TouchableOpacity)`
  position: absolute;
  right: 20px;
  top: 25px;
`;

const Bg = styled(TouchableOpacity)`
  position: absolute;
  right: 0;
  left: 0;
  bottom: 0;
  top: -70px;
  background-color: rgba(0, 0, 0, 0.85);
  z-index: 1000;
`;

export default Option;
