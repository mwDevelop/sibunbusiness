import React, {useState} from 'react';
import {styled} from 'styled-components';
import {Platform, Text, TouchableOpacity, View} from 'react-native';
import {
  Title,
  Img,
  Display,
  Margin,
  Zindex,
} from '../../styles/styledComponent';
import IconMore from '../../assets/image/more.png';
import {Hour, Minute} from '../../utils/TimeCalculation';
import dayjs from 'dayjs';
import CheckBox from '../CheckBox/CheckBox';
import {useTheme} from '@react-navigation/native';

const VoucherCard = ({
  data,
  deleteBtn,
  onPressCheck,
  checkValue,
  navigation,
}) => {
  const {colors} = useTheme();
  const [open, setOpen] = useState(false);

  const use = data?.store_voucher_use_yn === 'y';
  const begtime = data.store_voucher_beg_time;
  const endtime = data.store_voucher_end_time;

  function timeSetting(time) {
    const hour = Hour(time);
    const minute = Minute(time);

    if (hour < 12) {
      return minute === '00' ? `오전${hour}시` : `오전${hour}시${minute}분`;
    } else {
      return minute === '00' ? `오후${hour}시` : `오후${hour}시${minute}분`;
    }
  }
  function dayjsFormat(data) {
    return dayjs(data).format('YY.MM.DD');
  }

  function dayValue(day) {
    switch (Number(day)) {
      case 1:
        return '월';
      case 2:
        return '화';
      case 3:
        return '수';
      case 4:
        return '목';
      case 5:
        return '금';
      case 6:
        return '토';
      case 7:
        return '일';
    }
  }

  const makeweek = () => {
    const days = data?.store_voucher_available_days.split(',');
    const newArr = days.map(Number);
    const sort = newArr.sort();

    const arr = [];
    sort.map((day, k) => {
      arr.push(`${dayValue(day)}${k + 1 === days.length ? '' : ' / '}`);
    });

    return arr;
  };

  const onPressEdit = data => {
    navigation.navigate('AddVoucherScreen', {state: data, status: 'edit'});
    setOpen(false);
  };

  return (
    <Card>
      {deleteBtn ? (
        <Position>
          <CheckBox
            isCheck={checkValue}
            onPressCheck={onPressCheck}
            id={data?.store_voucher_idx}
          />
        </Position>
      ) : (
        ''
      )}
      <Display content="space-between">
        <Use bg={use ? '#EBF3FF' : '#efefef'}>
          <Title color={use ? '#4E95FF' : '#7d7d7d'} size={15}>
            {use ? '노출중' : '비노출'}
          </Title>
        </Use>
        <TouchableOpacity activeOpacity={0.8} onPress={() => setOpen(!open)}>
          <Img source={IconMore} width={20} resizeMode="contain" />
        </TouchableOpacity>
        {open ? (
          <EditBtn onPress={() => onPressEdit(data)}>
            <Title size={14} color="#333">
              수정
            </Title>
          </EditBtn>
        ) : (
          ''
        )}
      </Display>
      <Zindex>
        <Title size={27} color={colors.mainColor} weight={600} top={3}>
          {data.store_voucher_discount_rate}%{' '}
          <Title color={colors.mainColor}>할인</Title>
        </Title>
        <Title top={15} bottom={10} color="#333" weight={700}>
          {data.store_voucher_title}
        </Title>
        <Margin top={15}>
          <Info>
            적용기간 : {dayjsFormat(data.store_voucher_beg_date)} -{' '}
            {dayjsFormat(data.store_voucher_end_date)}
          </Info>
          <Info>
            사용시간 : {timeSetting(begtime)}부터 ~ {timeSetting(endtime)}까지
          </Info>
          <Info>하루 발행 수 : {data.store_voucher_daily_total_cnt}장</Info>
          <Info>이용 가능 요일 : {makeweek()}</Info>
        </Margin>
      </Zindex>
    </Card>
  );
};

const Card = styled(View)`
  width: 100%;
  border-width: 1px;
  border-color: #e9e9e9;
  border-radius: 5px;
  margin-bottom: 15px;

  padding: 18px 15px;
`;

const Use = styled(View)`
  width: 58px;
  padding: 5px 6px;
  border-radius: 4px;
  background-color: ${props => props.bg};

  align-items: center;
  justify-content: center;
`;

const Info = styled(Text)`
  font-size: 12px;
  color: #7d7d7d;
  margin-bottom: 7px;
`;

const EditBtn = styled(TouchableOpacity)`
  width: 50px;
  height: 30px;
  border-color: #e9e9e9;
  border-radius: 5px;
  border-width: 1px;
  align-items: center;
  justify-content: center;

  position: absolute;
  right: 0px;
  top: 30px;
  z-index: 1000;
`;

const Position = styled(View)`
  position: absolute;
  left: -10px;
  top: -8px;
  z-index: 1000;
`;

export default VoucherCard;
