import {api, instance} from './api';

const secretkey = 'mjsuntalk';
const apis = {
  postSendsms: data =>
    api.post(`/auth/login/sms/send?secret_key=${secretkey}`, data),
  postAuthCheck: data =>
    api.post(`/auth/login/sms/check?secret_key=${secretkey}`, data),
  postLogin: data => api.post(`/auth/loginv2?secret_key=${secretkey}`, data),

  getStore: () => instance.get('/store'),
  getUser: () => instance.get('user/me'),
  getRefreshToken: () => instance.get('/auth/refresh'),
  getStoreDetail: storeId => instance.get(`/store/${storeId}`),
  getStoreImg: storeId => instance.get(`/store/${storeId}/image`),
  postUser: data => instance.post('/user', data),
  putUser: data => api.put(`user?secret_key=${secretkey}`, data),

  //예약 관련 API
  getReservation: storeId => instance.get(`/store/${storeId}/reservation`),
  getReservationSttList: (storeId, stt) =>
    instance.get(
      `/store/${storeId}/reservation?reservation_stt_in=${stt}&type=reservation_date`,
    ),
  getReservationMonth: (storeId, month) =>
    instance.get(
      `/store/${storeId}/reservation?reservation_month=${month}&type=reservation_date`,
    ),
  getReservationDay: (storeId, date) =>
    instance.get(`/store/${storeId}/reservation?reservation_date=${date}`),
  getReservationStt: (idx, stt) =>
    instance.get(`/reservation/${idx}/state/${stt}`),
  getStoreRomm: storeId =>
    instance.get(`/store/${storeId}/room?secret_key=${secretkey}`),
  getReservationaDetail: (storeId, idx) =>
    instance.get(`/store/${storeId}/reservation/${idx}`),

  // 할인권
  getVoucherList: storeId => instance.get(`/store/${storeId}/voucher`),
  putVoucher: (storeId, data) =>
    instance.put(`/store/${storeId}/voucher`, data),
  postVoucher: (storeId, voucherIdx, data) =>
    instance.post(`/store/${storeId}/voucher/${voucherIdx}`, data),
  deleteVoucher: (storeId, voucherIdx) =>
    instance.delete(`/store/${storeId}/voucher/${voucherIdx}`),

  //매장 등록
  putStore: data => instance.put('/store', data),
  putStoreImg: (storeId, data) => instance.put(`/store/${storeId}/image`, data),
  postStoreImg: (storeId, idx, data) =>
    instance.post(`/store/${storeId}/image/${idx}`, data),
  putStorePricing: (storeId, data) =>
    instance.put(`/store/${storeId}/pricing`, data),
  deleteStore: storeId => instance.delete(`/store/${storeId}`),
  deleteStoreImg: (storeId, idx) =>
    instance.delete(`/store/${storeId}/image/${idx}`),
  postStore: (storeId, data) => instance.post(`/store/${storeId}`, data),
  postBulkImg: (storeId, data) =>
    instance.post(`/store/${storeId}/bulk/image`, data),

  //리뷰
  getReviewList: storeId => instance.get(`/store/${storeId}/review`),
  getReviewImg: storeId =>
    instance.get(`/store/${storeId}/review?review_photo_yn=y`),
  getReview: (storeId, reviewIdx) =>
    instance.get(`/store/${storeId}/review/${reviewIdx}`),
  postReivew: (storeId, reviewIdx, data) =>
    instance.post(`/store/${storeId}/review/${reviewIdx}`, data),
  deleteMember: () => instance.delete('/user'),

  // room
  getRooms: storeId => instance.get(`/store/${storeId}/room`),
  putRooms: (storeId, data) => instance.put(`/store/${storeId}/room`, data),
  postRooms: (storeId, roomidx, data) =>
    instance.post(`/store/${storeId}/room/${roomidx}`, data),
  deleteRoom: (storeId, roomidx) =>
    instance.delete(`/store/${storeId}/room/${roomidx}`),
  getPricing: storeId => instance.get(`/store/${storeId}/pricing`),
  putPricing: (storeId, data) =>
    instance.put(`/store/${storeId}/pricing`, data),
  deletePricing: (storeId, pricingidx) =>
    instance.delete(`/store/${storeId}/pricing/${pricingidx}`),
  postPricing: (storeId, data) =>
    instance.post(`/store/${storeId}/bulk/pricing`, data),

  postImgBulk: (storeId, data) =>
    instance.post(`/store/${storeId}/bulk/image`, data),
};

export default apis;
