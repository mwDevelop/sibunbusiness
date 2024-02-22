import React, {useEffect} from 'react';
import {StatusBar} from 'react-native';

import {RecoilRoot} from 'recoil';
import {QueryClient, QueryClientProvider} from 'react-query';
import Toast from 'react-native-toast-message';
import Navigation from './src/components/Navigation/Navigation';
import {SafeAreaView} from 'react-native';
import SplashScreen from 'react-native-splash-screen';

const queryClient = new QueryClient();

function App() {
  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 1000);
  }, []);

  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <Toast />
        <StatusBar backgroundColor={'#fff'} />
        <SafeAreaView />
        <Navigation />
      </QueryClientProvider>
    </RecoilRoot>
  );
}

export default App;
