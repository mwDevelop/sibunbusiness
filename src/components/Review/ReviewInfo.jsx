import React from 'react';
import {View, Image} from 'react-native';
import {Display, Title} from '../../styles/styledComponent';
import {styled} from 'styled-components';

const ReviewInfo = ({data}) => {
  const tags = !data.review_tags ? null : data.review_tags.split(',');
  const tagsCount = tags;
  const reviewImgList = [data.review_img1, data.review_img2];
  const reviewImg = reviewImgList.filter(el => el !== '');

  return (
    <>
      <Display
        top={10}
        content={reviewImg?.length === 3 ? 'space-between' : 'flex-start'}>
        {reviewImg &&
          reviewImg?.map((i, k) => {
            return (
              <ReviewImg
                source={{uri: i}}
                width={32}
                radius={5}
                resizeMode="cover"
                key={k}
              />
            );
          })}
      </Display>

      {tags === null ? (
        <View />
      ) : (
        <TagList>
          {tagsCount.map((tag, k) => {
            return (
              <TagBg key={k}>
                <Title size={14} color="#444">
                  #{tag}
                </Title>
              </TagBg>
            );
          })}
        </TagList>
      )}

      <Title size={18} color="#222" top={15} bottom={20}>
        {data.review_content}
      </Title>
    </>
  );
};

const TagList = styled(View)`
  height: 35px;
  margin-top: 20px;
  margin-bottom: 10px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  flex-direction: row;
`;

const TagBg = styled(View)`
  background-color: #e9e9e9;
  height: 28px;
  justify-content: center;
  padding-right: 5px;
  padding-left: 5px;
`;

const ReviewImg = styled(Image)`
  width: ${props => props.width}%;
  height: 100px;
  border-radius: 5px;
  margin-right: 8px;
`;

export default ReviewInfo;
