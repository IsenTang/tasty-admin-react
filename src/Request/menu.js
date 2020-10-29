import request from '../Common/request';
import config from '../Common/config';

/*
 * 分页加载食物
*/
export async function loadFoodsByPage ({ id,page,limit,keyword = '' }){

   const result = await request({
      url:     `${config.host}/food?restaurantId=${id}&page=${page}&limit=${limit}&keyword=${keyword}`,
      method:  'get'
   });

   return result;
}

/*
 * 改变状态
*/
export async function updateFood (data){

   const result = await request({
      url:     `${config.host}/food`,
      method:  'post',
      data
   });

   return result;
}