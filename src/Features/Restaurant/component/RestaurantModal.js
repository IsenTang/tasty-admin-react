import React, { useEffect, useState  } from 'react';
import { Modal,Input,Form,Select,TimePicker } from 'antd';
import { useSelector,useDispatch } from 'react-redux';
import _ from 'lodash';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';

/* state */
import { isShow,selectedRestaurant,tagsSelect } from '../state';

/* actions */
import { hideModal,updateRestaurant } from '../state';

/* components */
import Clock from './Clock';
import RestaurantTags from './RestaurantTags';

/* style */
import './restaurantModal.scss';

function RestaurantModal () {

   const dispatch = useDispatch();

   let isVisible = useSelector(isShow);
   let restaurant = useSelector(selectedRestaurant);
   let tags = useSelector(tagsSelect);

   let [ language,setLanguage ] = useState('zh-CN');

   let [ modalData,setModalData ] = useState({});

   /* 注入本地modal状态 */
   useEffect(()=>{

      setModalData(restaurant);
   },[ restaurant ]);

   /* 保存 */
   function handleOk (){

      dispatch(updateRestaurant({ id:restaurant._id,data:_.omit(modalData,'_id') }));
   }

   /* 取消 */
   function handleCancel (){
      dispatch(hideModal());
   }

   /* 改名字 */
   function handleChangeName (e){

      let value = e.target.value;

      setModalData((v)=>{
         return {
            ...v,
            name:{
               ...modalData.name,
               [`${language}`]:value
            }
         };
      });
   }

   /* 添加tag */
   function addTag (v){

      let restaurantTags = _.cloneDeep(_.get(modalData,'tags',[]));

      /* 如果不存在，则加入tag，如果存在则无视 */
      if(!_.includes(restaurantTags,v)){
         restaurantTags.push(v);

         setModalData((v)=>{

            return {
               ...v,
               tags:restaurantTags
            };
         });
      }
   }

   function removeTag (v){

      /* 先大写首字母做对比 */
      const targetTag = v.toUpperCase();

      let restaurantTags = _.get(modalData,'tags',[]);

      /* 构建新的tag数组 */
      let newTags = _.filter(restaurantTags,(item)=>{

         return item.toUpperCase() !== targetTag;

      });

      setModalData((v)=>{

         return {
            ...v,
            tags:newTags
         };
      });
   }

   // const removeTag = useCallback(
   //    (v,restaurantTags) => {
   //       /* 先大写首字母做对比 */

   //       if(!isVisible){
   //          return;
   //       }
   //       const targetTag = v.toUpperCase();

   //       /* 构建新的tag数组 */
   //       let newTags = _.filter(restaurantTags,(item)=>{

   //          return !(item.toUpperCase() === targetTag);

   //       });

   //       setModalData((v)=>{

   //          return {
   //             ...v,
   //             tags:newTags
   //          };
   //       });
   //    },[ isVisible ]
   // );

   /*
    * 渲染所有tag
   */
   function renderAllTags (){

      return _.map(tags,(item)=>{

         return (
            <Select.Option value={ item } key={ uuidv4() }> {item}</Select.Option>
         );
      });
   }

   /*
    * 渲染开门时间
   */
   function renderHours (hours){

      if(hours){
         const week = [ '星期一','星期二','星期三','星期四','星期五','星期六','星期天' ];

         return _.map(week,(day,index)=>{

            return (
               <Input.Group compact key={ uuidv4() }>
                  <Input style={{ width : '20%' }} value={ day } disabled/>

                  <TimePicker.RangePicker style={{ width : '70%' }}
                     allowClear={ false }
                     onChange= { (time)=>{handleTime(index,time);} }

                     defaultValue={ [  moment().startOf('day').add(_.get(hours[index],'start',0), 'minutes'),
                        moment().startOf('day').add(_.get(hours[index],'end',0), 'minutes') ] }/>
               </Input.Group>
            );
         });
      }
   }

   /*
    * 控制时间
   */
   function handleTime (day,times){

      const start = getMinute(times[0]);

      const end = getMinute(times[1]);

      let hours = _.cloneDeep(modalData.hours);

      hours[day].start = start;
      hours[day].end = end;

      setModalData((v)=>{

         return {
            ...v,
            hours
         };
      });
   }

   /*
    * 获取分钟数
    */
   function getMinute (time){
      return moment(time).hours() * 60 + moment(time).minute();
   }

   return (

      <Modal title={ _.get(restaurant,`name[${language}]`,'') }
         visible={ isVisible }
         onOk={ handleOk }
         onCancel={ handleCancel }
         okText="保存"
         cancelText="取消"
      >
         <Form>

            {/* 餐馆名 */}

            <Form.Item
               label="餐馆名称"
               name="name"
            >
               <Input.Group compact>
                  <Select defaultValue={ language } onChange={ (v)=>{

                     setLanguage(v);
                  } }>
                     <Select.Option value="zh-CN">中文</Select.Option>
                     <Select.Option value="en-US">英文</Select.Option>
                  </Select>
                  <Input style={{ width : '50%' }} value={ _.get(modalData,`name[${language}]`) } onChange={ handleChangeName }/>
               </Input.Group>
            </Form.Item>

            <Form.Item
               label="餐馆标签"
            >

               <Input.Group compact>
                  <Select defaultValue={ tags[0] } onSelect={ addTag } >
                     { renderAllTags() }
                  </Select>
                  <div className='tag-container'>

                     <RestaurantTags tags={ _.get(modalData,'tags',[]) } removeTag={ removeTag }/>
                  </div>

               </Input.Group>

            </Form.Item>

            <Form.Item
               label="开门时间"
            >

               <div>
                  <Clock/>
                  {renderHours(modalData.hours)}
               </div>
            </Form.Item>

         </Form>
      </Modal>
   );
}

export default React.memo(RestaurantModal,(preProps,nextProps)=>{

   return true;
});