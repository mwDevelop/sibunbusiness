import React, {useState, useEffect} from 'react';
import {Container, Display, Title} from '../styles/styledComponent';
import {styled} from 'styled-components';
import {ScrollView, TouchableOpacity} from 'react-native';

import {useRecoilValue} from 'recoil';
import {storeIdState} from '../recoil/atom';

import apis from '../api/apis';
import ReviewCard from '../components/Review/ReviewCard';
import NavBar from '../components/NavBar/NavBar';

const ReviewScreen = ({navigation, route}) => {
  const storeId = useRecoilValue(storeIdState);
  const [navValue, setNavValue] = useState(0);
  const [lists, setList] = useState();
  const [imgList, setImgList] = useState();
  const [answerList, setAnswerList] = useState();
  const [data, setData] = useState();
  const navData = [{title: '전체'}, {title: '포토리뷰'}, {title: '댓글쓰기'}];
  const reviewId = route?.params?.state;

  useEffect(() => {
    storeId &&
      apis.getReviewList(storeId).then(res => {
        if (res.data.result === '000') {
          const data = res.data.list;
          const img = data?.filter(el => el.review_img1 !== '');
          const answer = data?.filter(el => el.review_answer == '');
          setImgList(img);
          setAnswerList(answer);
          setList(data);
          setData(data);
        }
      });
  }, [reviewId, storeId]);

  useEffect(() => {
    navValue === 1
      ? setData(imgList)
      : navValue === 2
      ? setData(answerList)
      : setData(lists);
  }, [navValue]);

  const onPressNav = k => {
    setNavValue(k);
  };

  function arrLength(index) {
    switch (index) {
      case 0:
        return lists?.length;
      case 1:
        return imgList?.length;
      case 2:
        return answerList?.length;
    }
  }

  return (
    <Container>
      <NavBar
        navData={navData}
        onPressNav={onPressNav}
        navValue={navValue}
        arrLength={arrLength}
      />

      <ScrollView style={{marginBottom: 50}}>
        {data &&
          data.map((i, k) => {
            return (
              <Display content="center" key={k}>
                <ReviewCard data={i} id={storeId} navigation={navigation} />
              </Display>
            );
          })}
      </ScrollView>
    </Container>
  );
};

export default ReviewScreen;
