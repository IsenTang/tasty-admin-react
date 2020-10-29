import React, { useState } from 'react';
import { useMount } from 'react-use';
import { useDispatch,useSelector } from 'react-redux';
import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { Table, Tag, Space,Button,Switch } from 'antd';

/* components */
import RestaurantModal from './component/RestaurantModal';

/* state */
import { selectList,isLoading } from './state';
/* actions */
import {  getRestaurantByPage,showModal,controlClose  } from './state';

export default function Restaurant () {

   /* page */
   let [ page,setPage ] = useState({
      current: 1,
      pageSize: 10,
   });

   const dispatch = useDispatch();

   const restaurants = useSelector(selectList);
   const loading = useSelector(isLoading);

   useMount(()=>{
      /* 发送请求获取restaurant,默认page为1 */
      dispatch(getRestaurantByPage());
   });

   /*
    * 渲染标签
   */
   function renderTags (tags ){

      const colors = [ 'magenta','orange','lime','cyan','purple','geekblue' ];

      return _.map(tags, (tag) => {

         return (
            <Tag key={ uuidv4() } color={ colors[_.random(colors.length)] }>{tag.toUpperCase()}</Tag>
         );
      });

   }

   /*
    * 手动控制餐馆开关
   */
   function handleClose (checked,item){

      let closed = checked ? { closed:true } : null;

      dispatch(controlClose({ id:item._id,data:{ closed } }));
   }

   /* table的配置 */
   function configColumns (){

      return [
         {
            title: '餐馆',
            dataIndex: 'name',
            key: 'name',
            render: name => <div>{`${name['zh-CN']}`}</div>,
         },
         {
            title: '地址',
            dataIndex: 'address',
            key: 'address',
            render: address => <div>{`${address.formatted}`}</div>,
         },
         {
            title: '标签',
            dataIndex: 'tags',
            key: 'tags',
            render: tags => {
               return renderTags(tags);
            },
         },
         {
            title: '操作',
            key: 'action',
            render: (text, item) => {
               return (
                  <Space size="middle">
                     <Button type="primary" onClick={ ()=>{

                        dispatch(showModal({ restaurant:item }));
                     } }>操作</Button>
                  </Space>);
            },
         },
         {
            title: '手动关闭',
            key: 'close',
            render: (text,item) => {

               return (
                  <Switch checked={ !_.isEmpty(item.closed ) } onChange={ (checked)=>{ handleClose(checked,item);} }/>
               );
            },
         }
      ];
   }

   return (
      <div>
         <Table columns={ configColumns() }
            dataSource={ restaurants }
            rowKey={ '_id' }
            loading={ loading }
            pagination={{ ...page,onChange:(current,pageSize)=>{

               /* 前端分页 */
               setPage({
                  current,
                  pageSize
               });
            } }}
         />

         <RestaurantModal/>
      </div>
   );
}
