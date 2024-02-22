import React, {useEffect, useState} from 'react';

import apis from '../api/apis';
import dayjs from 'dayjs';

import {
  View,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  Keyboard,
  Alert,
} from 'react-native';
import {styled} from 'styled-components';
import {Title, Img, Container, Display, Btn} from '../styles/styledComponent';

import StarRating from '../components/StarRating/StarRating';
import IconProfile from '../assets/image/profile.png';
import ReviewInfo from '../components/Review/ReviewInfo';
import {useTheme} from '@react-navigation/native';

const WriteReviewScreen = ({route, navigation}) => {
  const {colors} = useTheme();
  const state = route?.params?.state;
  const [data, setData] = useState();
  const [answer, setAnswer] = useState(0);
  useEffect(() => {
    apis.getReview(state?.storeid, state?.reviewid).then(res => {
      if (res.data.result === '000') {
        setData(res.data.data);
      }
    });
  }, []);

  const onChangeAnswer = e => {
    setAnswer(e);
  };

  const onPressAdd = () => {
    const data = {review_answer: answer};
    if (answer?.length > 9) {
      apis.postReivew(state?.storeid, state?.reviewid, data).then(res => {
        if (res.data.result === '000') {
          Alert.alert('댓글 작성이 완료되었습니다.');
          setTimeout(
            () => navigation.navigate('ReviewScreen', {state: state?.reviewid}),
            1000,
          );
        }
      });
    } else {
      Alert.alert('댓글을 확인해주세요.');
    }

    console.log(data);
  };

  return (
    <Container>
      <ScrollView>
        {data && (
          <KeyboardAvoidingView
            behavior={'padding'}
            style={{marginBottom: 300}}>
            <Wrap>
              <ImgWrap>
                <Img
                  source={
                    !!data?.mb_profile_img
                      ? {uri: data?.mb_profile_img}
                      : IconProfile
                  }
                  width={70}
                  radius={100}
                  resizeMode="cover"
                />
                <Title size={16} color="#222" weight={400} left={10}>
                  {data.mb_name}
                </Title>
              </ImgWrap>
              <Info content="space-between">
                <StarRating starData={data?.review_rating} />
                <Title size={14} color="#7d7d7d" weight={400}>
                  {dayjs(data?.review_reg_dt).format('YY.MM.DD')}
                </Title>
              </Info>
              <ReviewInfo data={data} />
            </Wrap>
            <TextArea>
              <Title size={17} color="#222" weight={600}>
                고객님 리뷰에 댓글을 달아주세요.
              </Title>
              <Input
                placeholder="신속한 답변으로 고객관리를 해주세요. (10글자 이상)"
                multiline={true}
                textAlignVertical="top"
                onChangeText={e => onChangeAnswer(e)}
              />
            </TextArea>
          </KeyboardAvoidingView>
        )}
      </ScrollView>
      <BtnWrap>
        <Btn width={50} bg={'#d7d7d7'} activeOpacity={1}>
          <Title weight={600}>취소</Title>
        </Btn>
        <Btn
          width={50}
          bg={answer?.length > 10 ? colors.mainColor : '#333'}
          activeOpacity={1}
          onPress={() => onPressAdd()}>
          <Title color="#fff" weight={600}>
            등록
          </Title>
        </Btn>
      </BtnWrap>
    </Container>
  );
};

const Wrap = styled(View)`
  padding: 0px 20px;
  margin-bottom: 20px;
`;

const Info = styled(Display)`
  border-top-width: 1px;
  border-color: #e9e9e9;
  padding: 10px 0px;
`;

const ImgWrap = styled(View)`
  border-top-width: 1px;
  border-color: #e9e9e9;

  padding: 20px 0px;

  flex-direction: row;
  align-items: center;
`;

const TextArea = styled(View)`
  border-top-width: 10px;
  border-color: #e9e9e9;

  padding: 10px 20px;
`;

const Input = styled(TextInput)`
  width: 100%;
  height: 150px;
  border-radius: 5px;
  border-width: 1px;
  border-color: #e9e9e9;
  margin-top: 10px;
  padding: 20px 10px;
`;

const BtnWrap = styled(View)`
  width: 100%;
  position: absolute;
  bottom: 0;

  display: flex;
  flex-direction: row;
`;

export default WriteReviewScreen;
