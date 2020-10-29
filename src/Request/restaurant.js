import request from '../Common/request';
import config from '../Common/config';

/* 分页获取restaurant信息 */
export async function getRestaurant (){

   const result = await request({
      url:     `${config.host}/restaurant/location/-74.0059413,40.7127837`,
      method:  'get'
   });

   return result;
}

/* 分页获取restaurant信息 */
export async function getTags (){

   const result = await request({
      url:     `${config.host}/tags`,
      method:  'get'
   });

   return result;
}

/* 修改restaurant信息 */
export async function updateRestaurantInfo (data){

   const result = await request({
      url:     `${config.host}/restaurant`,
      method:  'post',
      data
   });

   return result;
}