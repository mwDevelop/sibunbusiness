import React from 'react';
import {Img} from '../../styles/styledComponent';
import IconMenu from '../../assets/image/menu.png';
import {TouchableOpacity} from 'react-native';

const OpenDrawer = ({navigation}) => {
  return (
    <TouchableOpacity onPress={() => navigation.openDrawer()}>
      <Img width={25} source={IconMenu} resizeMode="contain" />
    </TouchableOpacity>
  );
};

export default OpenDrawer;
