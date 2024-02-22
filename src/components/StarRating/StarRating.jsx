import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Display, Title, Margin} from '../../styles/styledComponent';
import {useTheme} from '@react-navigation/native';

const StarRating = ({starData}) => {
  const {colors} = useTheme();
  const rating = Number(starData);
  const size = 17;
  return (
    <Display>
      <Display>
        {Array(parseInt(rating))
          ?.fill(2)
          ?.map((el, i) => (
            <Margin right={2} key={i}>
              <Icon name="star" size={size} color={colors.mainColor} />
            </Margin>
          ))}
        {!Number.isInteger(rating) && (
          <Margin right={2}>
            <Icon name="star-half-empty" size={size} color="red" />
          </Margin>
        )}
        {Array(Math?.floor(5 - rating))
          ?.fill(2)
          ?.map((el, i) => (
            <Margin right={2} key={i}>
              <Icon name="star" size={size} color="#fed0d8" />
            </Margin>
          ))}
      </Display>
      <Title color={colors.mainColor} left={5}>
        {rating ? `${rating}.0` : rating}
      </Title>
    </Display>
  );
};

export default StarRating;
