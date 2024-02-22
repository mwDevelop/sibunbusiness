import Toast from 'react-native-toast-message';

export const ToastMessage = text => {
  Toast.show({
    type: 'selectedToast',
    text1: text,
    position: 'top',
    visibilityTime: 2000,
  });
};
