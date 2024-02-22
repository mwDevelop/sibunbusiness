import React from 'react';
import {View, Text} from 'react-native';
import LottieView from 'lottie-react-native';

const Loading = () => {
  return (
    <View
      style={{
        flex: 1,
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <LottieView
        style={{
          width: 200,
          height: 200,
        }}
        source={require('../assets/animations/loading.json')}
        autoPlay
        loop={false}
      />
    </View>
  );
};

export default Loading;
