import {useCallback} from 'react';
import ImagePicker from 'react-native-image-crop-picker';
import ImageResizer from 'react-native-image-resizer';

export function ImagePickerFun({data, setData}) {
  const randomNo = Math.floor(Math.random() * 89999) + 10000;

  ImagePicker.openPicker({
    width: 500,
    height: 500,
    multiple: true,
    cropping: true,
    compressImageMaxWidth: 500,
    compressImageMaxHeight: 500,
    includeBase64: true,
    compressImageQuality: 0.8,
    includeExif: true,
    includeBase64: true,
    mediaType: 'photo',
  }).then(images => {
    if (data === undefined) {
      setTimeout(() => setData({uuid: 'uuid' + randomNo, ...images}), 1500);
    } else {
      const arr = [];
      images.map((i, k) => arr.push({uuid: 'uuid' + randomNo + k, ...i}));
      setTimeout(() => setData([...data, ...arr]), 1500);
    }
  });
}
