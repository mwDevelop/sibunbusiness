import React from 'react';
import axios from 'axios';
import {View} from 'react-native';
import Postcode from '@actbase/react-daum-postcode';

const KakaoAddress = ({navigation, route}) => {
  const getAddressData = async e => {
    const searchTxt = e?.address;

    await axios
      .get(
        `https://dapi.kakao.com/v2/local/search/address.json?query=${searchTxt}`,
        {
          headers: {
            Authorization: `KakaoAK 1e23c3208bc2335311e9f8653b38f85b`,
          },
        },
      )
      .then(res => {
        const location = res.data.documents[0];
        const address = location.address;

        navigation.navigate(route.params.state, {
          store_addr_zip: e?.zonecode,
          store_addr1: e?.address,
          store_addr_x: address.x,
          store_addr_y: address.y,
          store_addr_sep1: address.region_1depth_name,
          store_addr_sep2: address.region_2depth_name,
          store_addr_sep3: address.region_3depth_name,
        });
      });
  };

  return (
    <View>
      <Postcode
        style={{width: '100%', height: '100%'}}
        jsOptions={{animation: true}}
        onSelected={data => getAddressData(data)}
      />
    </View>
  );
};

export default KakaoAddress;
