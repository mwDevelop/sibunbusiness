import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {Title} from '../../styles/styledComponent';
import {styled} from 'styled-components';
const Dropdown = ({
  data,
  width,
  setData,
  getData,
  onPressDown,
  align,
  value,
}) => {
  const onPressItem = data => {
    if (value === 'add') {
      getData(data);
    } else {
      getData('store_pricing_days', data?.value);
      setData(data?.value === 'input' ? data.value : data?.title);
      onPressDown();
    }
  };

  return (
    <DropDown width={width}>
      {data?.map((i, k) => {
        return (
          <Item
            align={align}
            activeOpacity={0.8}
            key={k}
            border={k + 1 === data?.length ? 0 : 1}
            onPress={() => onPressItem(i)}>
            <Title size={14}>{i.title}</Title>
          </Item>
        );
      })}
    </DropDown>
  );
};

const DropDown = styled(View)`
  width: ${props => props.width}%;
  background-color: #ffffff;
  border-width: 1px;

  border-color: #d7d7d7;

  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  margin-top: 4px;

  position: absolute;
  top: 40px;
`;

const Item = styled(TouchableOpacity)`
  height: 50px;
  padding: 5px 15px;

  justify-content: center;
  border-bottom-width: ${props => props.border}px;
  border-color: #d7d7d7;
`;

export default Dropdown;
