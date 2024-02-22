import React, {useState} from 'react';
import {styled} from 'styled-components';
import {View, Switch, Platform, TouchableOpacity, Image} from 'react-native';
import {Title, Img, Display, Margin} from '../../styles/styledComponent';
import {useTheme} from '@react-navigation/native';
import IconProfile from '../../assets/image/profile.png';

import StarRating from '../StarRating/StarRating';
import dayjs from 'dayjs';
import apis from '../../api/apis';
import ReviewInfo from './ReviewInfo';

const ReviewCard = ({data, id, navigation}) => {
  const {colors} = useTheme();
  const block = data?.review_block_yn === 'n';
  const [isOn, setIson] = useState(block);

  const toggleSwitch = (e, idx) => {
    const eidtData = {review_block_yn: e ? 'y' : 'n'};

    apis.postReivew(id, idx, eidtData).then(res => {
      if (res.data.result === '000') {
        setIson(!isOn);
      }
    });
  };
  const platform = Platform.OS === 'ios';
  const size = platform ? 0.7 : 1;
  const answerReg = dayjs().format('YY.MM.DD');

  return (
    <Card>
      <Block>
        <Title size={15} color="#444">
          {isOn ? '공개' : '비공개'}
        </Title>
        <Switch
          trackColor={{false: '#7d7d7d', true: colors.mainColor}}
          thumbColor={'#fff'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={() => toggleSwitch(isOn, data?.review_idx)}
          value={isOn}
          style={{transform: [{scaleX: size}, {scaleY: size}]}}
        />
      </Block>
      <Info>
        <Display>
          <Img
            source={
              !!data?.mb_profile_img ? {uri: data?.mb_profile_img} : IconProfile
            }
            width={70}
            radius={100}
            resizeMode="cover"
          />
          <Margin left={10}>
            <Title size={17} color="#444" bottom={5}>
              {data?.mb_name}
            </Title>
            <StarRating starData={data.review_rating} />
          </Margin>
        </Display>

        <ReviewInfo data={data} />

        {!data.review_answer ? (
          <Btn
            color={colors.mainColor}
            onPress={() =>
              navigation.navigate('WriteReviewScreen', {
                state: {storeid: id, reviewid: data?.review_idx},
              })
            }>
            <Title color={colors.mainColor}>답변달기</Title>
          </Btn>
        ) : (
          <Answer>
            <Display>
              <AnswerTitle>
                <Title color="#fff" size={15}>
                  답변
                </Title>
              </AnswerTitle>
              <Title color="#444" size={15} left={5}>
                {answerReg}
              </Title>
            </Display>
            <Title color="#444" size={15} top={10}>
              {data.review_answer}
            </Title>
          </Answer>
        )}
        <Absolute>
          <Title size={14} color="#7d7d7d">
            {dayjs(data.review_reg_dt).format('YY.MM.DD')}
          </Title>
        </Absolute>
      </Info>
    </Card>
  );
};

const Card = styled(View)`
  width: 90%;
  border: 1px solid #e3e2e2;
  border-radius: 8px;
  margin-top: 30px;

  padding-bottom: 10px;
`;

const Block = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: 40px;
  background-color: #e9e9e9;
  padding: 0 10px;
  border-top-right-radius: 5px;
  border-top-left-radius: 5px;
`;

const Info = styled(View)`
  padding: 10px 15px;
`;

const Absolute = styled(View)`
  position: absolute;
  right: 15px;
  top: 20px;
`;

const Tag = styled(View)`
  /* width: 50%; */
  height: 35px;
  background-color: #e9e9e9;
  padding: 0 30px;
  margin-top: 20px;
  margin-bottom: 10px;
  align-items: center;
  flex-direction: row;
`;

const Btn = styled(TouchableOpacity)`
  width: 100%;
  height: 40px;
  border-width: 1px;
  border-radius: 5px;
  border-color: ${props => props.color};
  align-items: center;
  justify-content: center;

  margin-top: 20px;
`;

const Answer = styled(View)`
  background-color: #e9e9e9;
  padding: 20px 15px 40px 15px;
  margin-top: 20px;
`;

const AnswerTitle = styled(View)`
  background-color: #575757;
  border-radius: 7px;
  width: 50px;
  height: 30px;

  align-items: center;
  justify-content: center;
`;

const ImgWrap = styled(View)`
  width: ${props => props.width};
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const ReviewImg = styled(Image)`
  width: ${props => props.width}%;
  height: 90px;
  border-radius: 5px;
  margin-right: 8px;
`;
export default ReviewCard;
