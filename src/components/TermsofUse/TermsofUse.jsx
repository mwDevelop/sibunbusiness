import React, {useEffect, useState} from 'react';
import {Alert, TouchableOpacity, View} from 'react-native';
import styled from 'styled-components';
import CheckBox from '../CheckBox/CheckBox';
import {Display, Img, Title} from '../../styles/styledComponent';
import IconOn from '../../assets/image/termscheckbox_on.png';
import IconOff from '../../assets/image/termscheckbox_off.png';
import IconArrow from '../../assets/image/right-arrow.png';
import BottomBtn from '../BottomBtn/BottomBtn';
import {useTheme} from '@react-navigation/native';

const TermsofUse = ({setSignUp, setIsModalVisible}) => {
  const {colors} = useTheme();
  const [isCheck, setIsCheck] = useState([]);
  const [isAllCheck, setIsAllCheck] = useState(false);

  const termsList = [
    '선톡 이용약관 필수 동의',
    '개인(신용)정보 필수 동의',
    '마케팅 정보 수신 필수 동의',
  ];

  useEffect(() => {
    if (isCheck?.length === 3) {
      setIsAllCheck(true);
    } else {
      setIsAllCheck(false);
    }
  }, [isCheck]);

  const onPressAll = () => {
    if (isAllCheck) {
      setIsCheck([]);
    } else {
      setIsCheck([0, 1, 2]);
    }
    setIsAllCheck(!isAllCheck);
  };

  const onPressItem = k => {
    if (isCheck?.includes(k)) {
      const filter = isCheck?.filter(el => el !== k);
      setIsCheck(filter);
    } else {
      if (!isCheck) {
        setIsCheck([k]);
      } else {
        setIsCheck([...isCheck, k]);
      }
    }
  };

  const onPreeConfrim = () => {
    if (isAllCheck) {
      setSignUp(true);
      setIsModalVisible(false);
    } else {
      Alert.alert('약관 전체 동의가 필요합니다.');
    }
  };

  return (
    <Terms>
      <CheckAll onPress={() => onPressAll()}>
        <Img
          width={23}
          resizeMode="contain"
          source={isAllCheck ? IconOn : IconOff}
        />
        <Title size={17} weight={600} left={5}>
          약관 전체 동의
        </Title>
      </CheckAll>
      <Lists>
        {termsList.map((title, k) => {
          return (
            <Item key={k} onPress={() => onPressItem(k)}>
              <Display>
                <Img
                  width={23}
                  resizeMode="contain"
                  source={isCheck?.includes(k) ? IconOn : IconOff}
                />
                <Title size={17} weight={600} left={5}>
                  {title}
                </Title>
              </Display>

              <Img width={23} resizeMode="contain" source={IconArrow} />
            </Item>
          );
        })}
      </Lists>
      <Btn onPress={() => onPreeConfrim()} bg={colors.mainColor}>
        <Title color="#fff" weight={600}>
          확인
        </Title>
      </Btn>
    </Terms>
  );
};

const Terms = styled(View)`
  background-color: #fff;
  border-top-right-radius: 25px;
  border-top-left-radius: 25px;

  width: 100%;

  padding: 35px 20px;
`;

const CheckAll = styled(TouchableOpacity)`
  width: 100%;
  height: 55px;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-left: 20px;
  border-radius: 5px;
`;

const Lists = styled(View)`
  padding: 20px 10px 20px 20px;
`;

const Item = styled(TouchableOpacity)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const Btn = styled(TouchableOpacity)`
  width: 100%;
  height: 50px;
  background-color: ${props => props.bg};
  border-radius: 5px;

  display: flex;
  justify-content: center;
  align-items: center;
`;

export default TermsofUse;
