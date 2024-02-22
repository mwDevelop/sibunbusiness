import apis from '../api/apis';

export function EditMainImg(mainData) {
  if (mainData?.uuid !== 'main') {
    return !!mainData?.store_img_idx
      ? mainData?.store_img_data
      : `data:${mainData?.mime};base64,${mainData?.data}`;
  } else {
    return mainData?.store_img_data;
  }
}

export async function EditDetailImg(detail, storeId) {
  const newList = [];
  detail.forEach((el, k) => {
    newList.push({
      store_img_data: !!el.store_img_data
        ? el?.store_img_data
        : `data:${el?.mime};base64,${el?.data}`,
      store_img_orderby: k,
    });
  });

  const imgList = {store_img_li: newList};

  apis.postImgBulk(storeId, imgList).then(res => {
    if (res.data.result === '000') {
    } else {
      console.log('상세이미지', res);
    }
  });
}
