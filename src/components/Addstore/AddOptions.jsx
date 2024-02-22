import React, {useState} from 'react';
import {TextInput, TouchableOpacity, View} from 'react-native';
import {Container, Title} from '../../styles/styledComponent';
import {styled} from 'styled-components';
import Option from '../Options/Option';

const AddOptions = () => {
  const [add, setAdd] = useState(null);
  const [done, setDone] = useState(false);

  const onPressPush = e => {
    setDone(true);
  };

  return (
    <Container>
      <Input
        placeholder="#키워드를 입력해주세요."
        onChangeText={e => setAdd(e)}
      />
      <Btn onPress={() => onPressPush()}>
        <Title size={14} weight={400}>
          완료
        </Title>
      </Btn>
      <Wrap>
        <Option
          add={done ? add : null}
          value="add"
          done={done}
          setDone={setDone}
        />
      </Wrap>
    </Container>
  );
};

const Input = styled(TextInput)`
  border-bottom-width: 1px;
  border-color: #d7d7d7;

  height: 60px;
  padding: 0px 20px;
`;

const Btn = styled(TouchableOpacity)`
  position: absolute;
  right: 20px;
  top: 15px;
`;

const Wrap = styled(View)`
  padding: 20px;
`;

export default AddOptions;
