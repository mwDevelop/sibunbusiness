import React, {useState} from 'react';
import {styled} from 'styled-components';
import {View, TouchableWithoutFeedback} from 'react-native';
import {Img} from '../../styles/styledComponent';
import IconOn from '../../assets/image/check_on.png';
import IconOff from '../../assets/image/check_off.png';

const CheckBox = ({id, onPressCheck, isCheck, width}) => {
  const onPress = () => {
    onPressCheck(id);
  };
  return (
    <Box onPress={() => onPress()}>
      <Img
        width={width || 23}
        resizeMode="contain"
        source={isCheck ? IconOn : IconOff}
      />
    </Box>
  );
};

const Box = styled(TouchableWithoutFeedback)`
  z-index: 1000;
`;

export default CheckBox;
