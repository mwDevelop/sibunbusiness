import {styled} from 'styled-components';
import {Image, Text, TextInput, View, TouchableOpacity} from 'react-native';

export const Container = styled(View)`
  background-color: ${props => props.bg || '#fff'};
  height: 100%;
  width: 100%;
  padding: ${props => props.padding || 0};
`;

export const Img = styled(Image)`
  width: ${props => props.width}px;
  height: ${props => props.height || props.width}px;
  border-radius: ${props => props.radius || 0}px;
  margin-right: ${props => props.right || 0}px;
  margin-left: ${props => props.left || 0}px;
  margin-bottom: ${props => props.bottom || 0}px;
`;

export const Title = styled(Text)`
  font-size: ${props => props.size || 17}px;
  color: ${props => props.color || '#333'};
  font-weight: ${props => props.weight || 500};
  margin-right: ${props => props.right || 0}px;
  margin-left: ${props => props.left || 0}px;
  margin-top: ${props => props.top || 0}px;
  margin-bottom: ${props => props.bottom || 0}px;
  /* line-height: 28px; */
`;

export const Display = styled(View)`
  display: flex;
  flex-direction: row;
  justify-content: ${props => props.content || 'flex-start'};
  align-items: center;
  align-content: center;
  margin-top: ${props => props.top || 0}px;
  margin-bottom: ${props => props.bottom || 0}px;
`;

export const Input = styled(TextInput)`
  width: ${props => props.width || '100%'};
  height: 50px;
  border-radius: 5px;
  padding: 15px 20px;
  border-width: 1px;
  border-color: #d7d7d7;
  border-style: solid;
  margin-bottom: ${props => props.bottom || 0}px;
  margin-top: ${props => props.top || 0}px;
  color: #333;
`;

export const InputBox = styled(View)`
  width: ${props => props.width || '100%'};
  height: 50px;
  border-radius: 5px;
  padding: 5px 10px;
  border-width: 1px;
  border-color: #d7d7d7;
  border-style: solid;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  margin-left: 5px;
  margin-right: 5px;
`;

export const AddTitle = styled(Title)`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
  margin-top: 30px;
`;

export const Btn = styled(TouchableOpacity)`
  width: ${props => props.width || 100}%;
  height: ${props => props.height || 75}px;
  background-color: ${props => props.bg || '#333'};
  border-radius: ${props => props.radius || 0}px;

  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ModalBg = styled(TouchableOpacity)`
  position: absolute;
  right: 0;
  left: 0;
  bottom: 0;
  top: -70px;
  background-color: rgba(125, 125, 125, 0.5);
  z-index: 1000;
`;

export const Wrap = styled(View)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const InputBtn = styled(TouchableOpacity)`
  border-bottom-width: ${props => props.border || 0}px;
  border-bottom-color: #888888;

  /* padding-bottom: 2px; */
  position: absolute;
  right: 5px;
  bottom: 9px;
`;

export const Zindex = styled(View)`
  z-index: -100;
  margin-bottom: ${props => props.bottom || 0}px;
`;

export const Header = styled(Display)`
  padding: 0 10px;
  height: 60px;
  background-color: #ffffff;
`;

export const Margin = styled(View)`
  margin-right: ${props => props.right || 0}px;
  margin-left: ${props => props.left || 0}px;
  margin-top: ${props => props.top || 0}px;
  padding-bottom: ${props => props.bottom || 0}px;
`;

export const BtnWrap = styled(View)`
  position: absolute;
  bottom: 0;
  width: 100%;
  z-index: 999;
`;

export const LoginInput = styled(TextInput)`
  background-color: #ececec;
  width: ${props => props.width || 100}%;
  height: 55px;
  border-radius: 5px;
  margin-bottom: 10px;
  padding: 0px 18px;
`;

export const Box = styled(TouchableOpacity)`
  display: flex;
  justify-content: center;
  align-items: center;
  border-width: 1px;
  border-color: ${props => props.bordercolor || '#d7d7d7'};
  border-radius: 5px;

  background-color: ${props => props.bg || '#fff'};
  margin-right: ${props => props.right}px;
  margin-bottom: 10px;
`;
