import { createSlice } from '@reduxjs/toolkit';
import { message } from 'antd';
import { loadOrder as loadOrderReq } from '../../../Request/order';

export const orderSlice = createSlice({
   name: 'order',
   initialState: {
      list:[],
   },
   reducers: {
      loadOrder: (state,action) => {

         state.list = action.payload.list;
      }

   },
});

export const { loadOrder } = orderSlice.actions;

/* select */
export const selectList = state => state.order.list;

export default orderSlice.reducer;

export function loadOrderByTime (data){

   return async (dispatch)=>{

      try {
         const result = await loadOrderReq(data);

         dispatch(loadOrder(result));
      } catch (error) {
         message.error(error.message);
      }

   };
}

