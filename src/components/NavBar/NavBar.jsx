import React from 'react';
import {styled} from 'styled-components';
import {TouchableOpacity} from 'react-native';
import {Display, Title} from '../../styles/styledComponent';
import {useTheme} from '@react-navigation/native';
const NavBar = ({navData, onPressNav, navValue, arrLength, screen}) => {
  const {colors} = useTheme();
  return (
    <Container content="space-around">
      {navData.map((nav, k) => {
        const countLength = !arrLength || !arrLength[k + 1]?.length;
        const countValue = countLength ? 0 : arrLength[k + 1]?.length;
        return (
          <Nav
            width={k === navValue ? 1 : 0}
            key={k}
            color={colors.mainColor}
            onPress={() => onPressNav(k)}>
            <Title>
              {nav.title}{' '}
              <Title color={k === navValue ? colors.mainColor : '#333'}>
                {screen === 'main' ? countValue : arrLength(k)}
              </Title>
            </Title>
          </Nav>
        );
      })}
    </Container>
  );
};

const Container = styled(Display)`
  height: 45px;
  border-color: #e9e9e9;
  border-top-width: 1px;
  border-bottom-width: 1px;
  background-color: #fff;
`;

const Nav = styled(TouchableOpacity)`
  width: 25%;
  height: 45px;
  line-height: 45px;
  justify-content: center;
  align-items: center;
  border-bottom-width: ${props => props.width}px;
  border-color: ${props => props.color};
`;

export default NavBar;
