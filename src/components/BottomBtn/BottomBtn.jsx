import React from 'react';
import {View} from 'react-native';
import {Btn, Title} from '../../styles/styledComponent';
import {styled} from 'styled-components';
const BottomBtn = ({onPress, title, bottom}) => {
  return (
    <BtnWrap bottom={bottom}>
      <Btn onPress={() => onPress()} activeOpacity={1}>
        <Title color="#fff" weight="600">
          {title}
        </Title>
      </Btn>
    </BtnWrap>
  );
};

const BtnWrap = styled(View)`
  position: absolute;
  bottom: ${props => props.bottom || 0}px;
  width: 100%;
`;
export default BottomBtn;
