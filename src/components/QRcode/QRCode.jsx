import React, {useState} from 'react';
import {View, TouchableOpacity, Platform} from 'react-native';
import {Title, Img} from '../../styles/styledComponent';
import QRCodeScanner from './QRCodeScanner';
import {useRecoilValue} from 'recoil';
import {storeIdState} from '../../recoil/atom';
import IconBarcode from '../../assets/image/barcode_scan.png';
import styled from 'styled-components';

const QRCode = ({buttonTop}) => {
  const [open, setOpen] = useState(false);
  const storeId = useRecoilValue(storeIdState);
  return (
    <View>
      {open ? (
        <View style={{width: '100%', height: '100%', position: 'absolute'}}>
          <QRCodeScanner storeId={storeId} />
        </View>
      ) : (
        ''
      )}

      <BottomBar top={buttonTop}>
        <Barcode activeOpacity={0.9} onPress={() => setOpen(!open)}>
          <Img source={IconBarcode} width={14} resizeMode="contain" />
          <Title left={5}>코드 스캔</Title>
        </Barcode>
      </BottomBar>
    </View>
  );
};

const BottomBar = styled(View)`
  width: 100%;
  height: 65px;
  position: absolute;
  top: ${props => props.top}px;
  background-color: #e8e8e8;
  padding: 15px;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
`;
const Barcode = styled(TouchableOpacity)`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-right: 10px;
`;

export default QRCode;
