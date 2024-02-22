import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import {styled} from 'styled-components';
import Dropdown from '../components/Dropdown/Dropdown';
import apis from '../api/apis';
import ImagePicker from 'react-native-image-crop-picker';
import NavigationHeader from '../components/Header/NavigationHeader';
import IconEdit from '../assets/image/edit_img.png';
import IconEditIcon from '../assets/image/edit_icon.png';
import IconDown from '../assets/image/down.png';
import {Img, Title, Display} from '../styles/styledComponent';
import {useTheme} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useRecoilState} from 'recoil';
import {loginState} from '../recoil/atom';

const SignUpScreen = ({navigation, data, editValue, setEditValue}) => {
  const {colors} = useTheme();
  const [open, setOpen] = useState(false);
  const [, setLogin] = useRecoilState(loginState);
  const [emailId, setEmailId] = useState();
  const [email, setEmail] = useState('선택');
  const [profileImg, setProfileImg] = useState();

  const [userInfo, setUserInfo] = useState({
    pt_name: '',
    pt_profile_img: '',
    pt_birth: '',
    pt_gender: '',
    pt_nickname: '',
  });

  const {pt_name, pt_profile_img, pt_birth, pt_gender, pt_nickname} = userInfo;

  useEffect(() => {
    data && setUserInfo(data);
    const editEmail = data?.pt_email;
    const splitEmail = editEmail.split('@');
    setEmail(splitEmail[1]);
    setEmailId(splitEmail[0]);
  }, []);

  const onChangeInfo = (keyvalue, e) => {
    setUserInfo({
      ...userInfo,
      [keyvalue]: e,
    });
  };

  const onPressMember = () => {
    const data = {
      pt_name: pt_name,
      pt_birth: pt_birth,
      pt_nickname: pt_nickname,
      pt_gender: pt_gender,
      pt_email: `${emailId}@${email}`,
      pt_profile_img: pt_profile_img?.includes('base64')
        ? pt_profile_img
        : `data:${profileImg.mime};base64,${profileImg.data}`,
    };

    apis.postUser(data).then(res => {
      if (res.data.result === '000') {
        Alert.alert('수정완료되었습니다.');
        setEditValue(false);
      }
    });
  };

  useEffect(() => {
    if (editValue) {
      onPressMember();
    }
  }, [editValue]);

  const dropdownData = [
    {title: 'naver.com', value: 'naver.com'},
    {title: 'hanmail.net', value: 'hanmail.net'},
    {title: 'daum.net', value: 'daum.net'},
    {title: 'gmail.com', value: 'gmail.com'},
    {title: '직접입력', value: 'input'},
  ];

  const onPressProfile = () => {
    ImagePicker.openPicker({
      width: 200,
      height: 200,
      cropping: true,
      compressImageMaxWidth: 200,
      compressImageMaxHeight: 200,
      includeBase64: true,
      compressImageQuality: 1,
    }).then(image => {
      setProfileImg(image);
      onChangeInfo('pt_profile_img', image?.path);
    });
  };

  const onPressDown = () => {
    setOpen(!open);
  };
  const getDataEmail = () => {};

  const genderValue = pt_gender === 'm';

  const onPressRemove = async () => {
    await apis.deleteMember().then(res => {
      if (res.data.result === '000') {
        AsyncStorage.clear();
        setLogin(false);
        setTimeout(() => {
          navigation.navigate('IntroScreen');
        }, 1000);
      }
    });
  };

  return (
    <View>
      <NavigationHeader
        value="back"
        title="프로필 수정"
        navigation={navigation}
      />

      <KeyboardAvoidingView>
        <ScrollView>
          <ScrollWrap
            style={{
              marginBottom: Platform.OS === 'ios' ? 100 : 130,
              zIndex: -300,
            }}>
            <View style={{paddingBottom: 80}}>
              <InputWrap>
                <InputTitle>프로필 사진</InputTitle>
                <TouchableOpacity onPress={() => onPressProfile()}>
                  {pt_profile_img ? (
                    <Img
                      src={profileImg?.path || pt_profile_img}
                      width={90}
                      radius={100}
                    />
                  ) : (
                    <Img source={IconEdit} width={90} resizeMode="contain" />
                  )}

                  <Icon source={IconEditIcon} width={30} resizeMode="contain" />
                </TouchableOpacity>
              </InputWrap>
              <InputWrap>
                <InputTitle>이름</InputTitle>
                <Input
                  placeholder="이름"
                  name="pt_name"
                  value={pt_name}
                  onChangeText={e => onChangeInfo('pt_name', e)}
                />
              </InputWrap>
              <InputWrap>
                <InputTitle>닉네임</InputTitle>
                <Input
                  placeholder="닉네임"
                  name="pt_nickname"
                  value={pt_nickname}
                  onChangeText={e => onChangeInfo('pt_nickname', e)}
                />
              </InputWrap>

              <InputWrap>
                <InputTitle>이메일</InputTitle>
                <Display content="space-between">
                  <Input
                    width={45}
                    placeholder="이메일"
                    onChangeText={e => setEmailId(e)}
                    value={emailId}
                    name="emailId"
                    placeholderTextColor="#969696"
                    inputMode="email"
                  />
                  <Title>@</Title>
                  <Selected activeOpacity={0.8} onPress={() => setOpen(!open)}>
                    <Title color="#444" weight={400} size={14}>
                      {email}
                    </Title>
                    <Img source={IconDown} width={10} resizeMode="contain" />
                  </Selected>

                  {open ? (
                    <DropdownWrap>
                      <Dropdown
                        data={dropdownData}
                        width={100}
                        setData={setEmail}
                        onPressDown={onPressDown}
                        getData={getDataEmail}
                        align="flex-start"
                      />
                    </DropdownWrap>
                  ) : (
                    ''
                  )}
                </Display>
              </InputWrap>

              <InputWrap style={{zIndex: -1000}}>
                <InputTitle>생년월일</InputTitle>
                <Input
                  onChangeText={e => onChangeInfo('pt_birth', e)}
                  placeholder="- 없이 숫자만 입력해주세요. / ex)19940106"
                  keyboardType="number-pad"
                  value={pt_birth}
                  name="pt_birth"
                />
              </InputWrap>

              <InputWrap style={{zIndex: -1000}}>
                <InputTitle>성별</InputTitle>
                <BtnWrap>
                  <Btn
                    name="pt_gender"
                    onPress={() => onChangeInfo('pt_gender', 'm')}
                    width={50}
                    color={genderValue ? colors.mainColor : '#d7d7d7'}
                    bg={genderValue ? 'rgba(243,53,98,0.05)' : '#fff'}>
                    <Title
                      size={14}
                      color={genderValue ? colors.mainColor : '#333'}>
                      남자
                    </Title>
                  </Btn>
                  <Btn
                    name="pt_gender"
                    onPress={() => onChangeInfo('pt_gender', 'f')}
                    width={50}
                    color={!genderValue ? colors.mainColor : '#d7d7d7'}
                    bg={!genderValue ? 'rgba(243,53,98,0.05)' : '#fff'}>
                    <Title
                      size={14}
                      color={!genderValue ? colors.mainColor : '#333'}>
                      여자
                    </Title>
                  </Btn>
                </BtnWrap>
              </InputWrap>
              <TouchableOpacity onPress={() => onPressRemove()}>
                <Text>탈퇴하기</Text>
              </TouchableOpacity>
            </View>
          </ScrollWrap>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const ScrollWrap = styled(View)`
  padding: 10px 20px 100px 20px;
  background-color: #fff;
  z-index: -900;
`;

const InputTitle = styled(Text)`
  font-size: 14px;
  color: #7d7d7d;
  font-weight: 400;
  margin: 10px 0px;
`;

const InputWrap = styled(View)`
  margin-bottom: 20px;
  z-index: -100;
  position: relative;
`;

const Input = styled(TextInput)`
  width: ${props => props.width || 100}%;
  height: 55px;
  padding: 13px 20px;
  border: 1px solid #d7d7d7;
  border-radius: 5px;
  z-index: -100;
`;

const BtnWrap = styled(View)`
  width: 40%;

  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Btn = styled(TouchableOpacity)`
  width: ${props => props.width || 100}%;
  height: 55px;

  display: flex;
  justify-content: center;
  align-items: center;
  border-width: 1px;
  border-color: ${props => props.color || '#d7d7d7'};
  border-radius: 5px;
  margin-right: 10px;

  background-color: ${props => props.bg || '#fff'};
`;

const Selected = styled(TouchableOpacity)`
  width: 45%;
  height: 55px;
  border-radius: 5px;
  padding: 0px 18px;
  border: 1px solid #d9d9d9;

  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const DropdownWrap = styled(View)`
  width: 45%;
  position: absolute;
  right: 0px;
  top: 8px;
  background-color: #fff;
  z-index: 900;
`;

const Icon = styled(Img)`
  position: absolute;
  bottom: 0px;
  left: 68px;
`;

export default SignUpScreen;
