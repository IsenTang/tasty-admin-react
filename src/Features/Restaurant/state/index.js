import { createSlice } from '@reduxjs/toolkit';
import { message } from 'antd';
import { getRestaurant,getTags ,updateRestaurantInfo } from '../../../Request/restaurant';

export const restaurantSlice = createSlice({
   name: 'restaurant',
   initialState: {
      list:[],
      tags:[],
      isShow:false,
      isLoading:true,
      selectedRestaurant:{}
   },
   reducers: {
      loadRestaurant: (state,action) => {

         state.list = action.payload.list;
      },
      loadTags:(state,action)=>{
         state.tags = action.payload.tags;
      },
      showLoading:(state)=>{

         state.isLoading = true;
      },
      hideLoading:(state)=>{

         state.isLoading = false;
      },
      showModal:(state,action)=>{

         state.isShow = true;
         state.selectedRestaurant = action.payload.restaurant;
      },
      hideModal:(state)=>{

         state.isShow = false;
         state.selectedRestaurant = {};
      }
   },
});

export const { loadRestaurant,loadTags,showLoading,hideLoading,showModal,hideModal } = restaurantSlice.actions;

/* select */
export const selectList = state => state.restaurant.list;
export const tagsSelect = state => state.restaurant.tags;
export const isLoading = state => state.restaurant.isLoading;
export const isShow = state => state.restaurant.isShow;
export const selectedRestaurant = state => state.restaurant.selectedRestaurant;

export default restaurantSlice.reducer;

/*
 * 分页获取餐馆
*/
export function getRestaurantByPage (){

   return async (dispatch)=>{
      const result = await getRestaurant();

      dispatch(showLoading());

      dispatch(loadRestaurant({
         list:result.list
      }));

      // 获取所有tags
      const tags = await getTags();

      dispatch(loadTags({
         tags:tags.list
      }));

      dispatch(hideLoading());
   };
}

/*
 * 更新餐馆
*/
export function updateRestaurant (data){

   return async (dispatch)=>{

      try {
         // 先修改餐馆信息
         await updateRestaurantInfo(data);

         //再关闭modal
         dispatch(hideModal());

         const result = await getRestaurant();

         dispatch(showLoading());

         dispatch(loadRestaurant({
            list:result.list
         }));

      } catch (error) {
         message.error(error.message);
      }finally{
         dispatch(hideLoading());
      }

   };
}

/*
 * 手动关闭餐馆
*/
export function controlClose (data){

   return async (dispatch)=>{

      try {

         dispatch(showLoading());

         // 先修改餐馆信息
         await updateRestaurantInfo(data);

         const result = await getRestaurant();

         dispatch(loadRestaurant({
            list:result.list
         }));

      } catch (error) {
         message.error(error.message);
      }finally{
         dispatch(hideLoading());
      }

   };
}
