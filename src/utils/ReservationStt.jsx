export function ReservationStt(stt) {
  switch (Number(stt)) {
    case 1:
      return '대기';
    case 2:
      return '확정';
    case 3:
      return '취소';
    case 4:
      return '노쇼';
    case 5:
      return '입장';
  }
}
