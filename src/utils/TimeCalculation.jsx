import dayjs from 'dayjs';

export function Hour(time) {
  const hour = Math.floor((time * 30) / 60);
  return Number(hour);
}

export function Minute(time) {
  const minute = (time * 30) % 60;
  return minute === 0 ? '00' : minute;
}

export function Time(time) {
  const hour = Math.floor((time * 30) / 60);
  const minute = (time * 30) % 60;
  return `${hour}:${minute === 0 ? '00' : minute}`;
}

export function ChangeTimeData(time) {
  const hour = dayjs(time).format('HH') * 60;
  const minute =
    dayjs(time).format('mm') === '00' ? 0 : dayjs(time).format('mm');

  return Math.floor((Number(hour) + Number(minute)) / 30);
}

export function TimeSetting(hour, minute, period) {
  const timesetting = dayjs().set('hour', hour).set('minute', minute);
  return dayjs(timesetting).add(period, 'm').format('HH:mm');
}

export function Period(periodData) {
  return periodData === 1 ? 30 : periodData === 2 ? 60 : 90;
}
