import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {Title} from '../styles/styledComponent';

const InfoManagementScreen = ({navigation}) => {
  return (
    <View style={{margin: 20}}>
      <TouchableOpacity
        style={{margin: 20}}
        onPress={() => navigation.navigate('VoucherLists')}>
        <Title>할인권 목록</Title>
      </TouchableOpacity>
    </View>
  );
};

export default InfoManagementScreen;
