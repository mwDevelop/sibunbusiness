import React, {useEffect, useRef, useState} from 'react';
import {Alert, Dimensions, StyleSheet, View} from 'react-native';
import {Camera, CameraType} from 'react-native-camera-kit';
import apis from '../../api/apis';
import {useNavigation} from '@react-navigation/native';

const QRCodeScanner = ({storeId}) => {
  const [scaned, setScaned] = useState(true);
  const navigation = useNavigation();
  const ref = useRef(null);

  useEffect(() => {
    setScaned(true);
  }, []);

  const onBarCodeRead = event => {
    if (!scaned) return;
    setScaned(false);
    if (!!event.nativeEvent.codeStringValue) {
      const value = event.nativeEvent.codeStringValue;
      apis
        .getReservationStt(event.nativeEvent.codeStringValue, 'enter')
        .then(res => {
          if (res.data.result === '000') {
            try {
              navigation.navigate('ReservationDetailScreen', {
                storeId: storeId,
                idx: value,
                title: '입장처리되었습니다.',
                screen: 'StoremainScreen',
              });
            } catch (e) {
              Alert.alert(`${e.message} ${value}`);
            }
          }
        });
    } else {
      Alert.alert('QR Code', '인식 할수없는 QR입니다.', [
        {text: '확인', onPress: () => setScaned(true)},
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <Camera
        style={styles.scanner}
        ref={ref}
        cameraType={CameraType.Back}
        scanBarcode
        showFrame={false}
        laserColor="rgba(0, 0, 0, 0)"
        frameColor="rgba(0, 0, 0, 0)"
        surfaceColor="rgba(0, 0, 0, 0)"
        onReadCode={onBarCodeRead}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: 600,
    height: Dimensions.get('window').height,
  },
  scanner: {flex: 1},
});
export default QRCodeScanner;

// import React from 'react';
// import {View} from 'react-native';
// import {Camera, CameraType} from 'react-native-camera-kit';

// const QRCodeScanner = () => {
//   return (
//     <View>
//       <Camera
//         scanBarcode={true}
//         onReadCode={event => Alert.alert('QR code found')} // optional
//         showFrame={true}
//         laserColor="red"
//         frameColor="white"
//       />
//     </View>
//   );
// };

// export default QRCodeScanner;
