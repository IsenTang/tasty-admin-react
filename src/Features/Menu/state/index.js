import { createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';
import { message } from 'antd';

import { getRestaurant } from '../../../Request/restaurant';
import {  loadFoodsByPage as loadFoodsByPageReq , updateFood as updateFoodReq } from '../../../Request/menu';

export const menuSlice = createSlice({
   name: 'menu',
   initialState: {
      list:[],
      count:0,
      restaurantNames:[],
      isLoading:false
   },
   reducers: {
      showLoading:(state)=>{

         state.isLoading = true;
      },
      hideLoading:(state)=>{

         state.isLoading = false;
      },
      loadFoods: (state,action) => {

         state.list = action.payload.list;
         state.count = action.payload.count;
      },
      loadRestaurantName:(state,action)=>{
         state.restaurantNames = action.payload.list;
      }
   },
});

export const { showLoading,hideLoading,loadFoods,loadRestaurantName } = menuSlice.actions;

/* select */
export const selectRestaurantNames = state => state.menu.restaurantNames;
export const selectFoods = state => state.menu.list;
export const selectCount = state => state.menu.count;
export const selectLoading = state=>state.menu.isLoading;

export default menuSlice.reducer;

/*
 * 初始化，加载餐馆名字
*/
export function initMenu (){

   return async (dispatch)=>{

      try {

         dispatch(showLoading());
         /* 获取餐馆 */
         const result = await getRestaurant();

         /* 仅获取餐馆中文名，和id */
         const restaurantNames = _.map(result.list,(item)=>{

            return {
               id:item._id,
               name:item.name['zh-CN']
            };
         });

         /* 记录restaurant的名字 */
         dispatch(loadRestaurantName({ list:restaurantNames }));

      } catch (error) {
         message.error(error.message);
      }finally{
         dispatch(hideLoading());
      }

   };
}

/*
 * 分页加载食物
*/
export function loadFoodsByPage ({ id,page,limit,keyword }){

   return async (dispatch)=>{

      try {

         dispatch(showLoading());

         /* 加载食物 */
         const result = await loadFoodsByPageReq({ id,page,limit,keyword });

         dispatch(loadFoods({
            list:result.list,
            count:result.count
         }));

      } catch (error) {
         message.error(error.message);
      }finally{
         dispatch(hideLoading());
      }
   };
}

/*
 * 离开页面，清空数据
*/
export function leaveMenu (){

   return (dispatch)=>{
      dispatch(loadFoods({
         list:[],
         count:0
      }));
   };
}

/*
 * 更新
*/
export function updateFood (id,data,searchData){

   return async (dispatch)=>{

      try {
         dispatch(showLoading());

         await updateFoodReq({
            id,
            ...data
         });

         dispatch(loadFoodsByPage({ ...searchData }));

      } catch (error) {
         message.error(error.message);
      }finally{
         dispatch(hideLoading());
      }

   };
}

