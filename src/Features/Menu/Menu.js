import React,{ useState , useEffect } from 'react';
import _ from 'lodash';
import py from 'pinyin';
import { useDispatch,useSelector } from 'react-redux';
import { Select,Table,Switch,Input,Button } from 'antd';
import { useMount, useUnmount } from 'react-use';

/* style */
import './menu.scss';

/* utils */
import { formatPrice } from '../../Common/utils';

/* state */
import { selectRestaurantNames,selectFoods,selectLoading,selectCount } from './state';

/* actions */
import { initMenu,loadFoodsByPage,leaveMenu,updateFood } from './state';

export default function Menu () {

   const dispatch = useDispatch();

   const restaurantNames = useSelector(selectRestaurantNames);

   const list = useSelector(selectFoods);

   const count = useSelector(selectCount);

   const loading = useSelector(selectLoading);

   const [ pagination,setPagination ] =  useState({
      current: 1,
      pageSize: 10
   });

   let [ restId,setRestId ] = useState('');

   let [ searchValue , setSearchValue ] = useState('');

   useMount(()=>{

      dispatch(initMenu());
   });

   useUnmount(()=>{

      dispatch(leaveMenu());
   });

   /*
    * 初始化分页，总页数
   */
   useEffect(() => {

      setPagination((p)=>{
         return {
            ...p,
            total:count
         };
      });
   }, [ count ]);

   /*
    * 搜索restaurant的name
    * 可以是中文搜索，也可以是拼音搜索
   */
   function filterName (input, option){

      const name = option.children;

      /* 中文 */
      if(name.indexOf(input) !== - 1){
         return true;
      }

      /* 拼音 */
      const pyArr = py(name, {
         style: py.STYLE_NORMAL // 设置拼音风格设置为普通风格（不带声调），
      }).flat();

      const pyStr = pyArr.join('');

      if(pyStr.indexOf(input) !== - 1){
         return true;
      }

      return false;
   }

   /*
    * 渲染餐馆名字的select
   */
   function renderRestaurantSelect (){

      return _.map(restaurantNames,(item)=>{

         return (
            <Select.Option value={ item.id } key={ item.id }>{item.name}</Select.Option>
         );
      });
   }

   /*
    * 选择餐馆
   */
   function handleChange (id){

      setRestId(id);

      /* 初始化 */
      setPagination((p)=>{
         return {
            ...p,
            current:1
         };
      });

      setSearchValue('');

      dispatch(loadFoodsByPage({ id,page:pagination.current,limit:pagination.pageSize }));
   }

   /*
    * food table控制
   */
   function configColumns (){

      return [
         {
            title: '菜品',
            dataIndex: 'name',
            key: 'name',
            filterDropdown: function ({ confirm }) {

               return <div>
                  <Input onChange={ (e)=>{ setSearchValue(e.target.value);} } value={ searchValue } onPressEnter={ ()=> {search(); confirm();} }/>
                  <Button onClick={ ()=> {search(); confirm();} }>
                       搜索
                  </Button>
               </div>;
            },
            render: name => <div>{`${name['zh-CN']}`}</div>,
         },
         {
            title:'价格',
            dataIndex:'price',
            key:'price',
            render: price => <div> { formatPrice(price)}</div>
         },
         {
            title: '状态',
            key: 'available',
            render:   (text,item) => {

               return (
                  <Switch checked={ item.available } onChange={ (v)=>{ update(item._id,v);} }/>
               );
            },
         }
      ];
   }

   /*
    * 分页请求
   */
   function handlePageChange (v){

      setPagination(v);

      dispatch(loadFoodsByPage({ id:restId ,page:v.current,limit:v.pageSize,keyword:searchValue }));
   }

   /*
    * 发送搜索请求
   */
   function search (){

      setPagination((p)=>{

         return {
            ...p,
            current:1
         };
      });
      dispatch(loadFoodsByPage({ id:restId ,page:1,limit:pagination.pageSize,keyword:searchValue }));
   }

   /*
    * 更新状态
   */
   function update (id,available){

      dispatch(updateFood(id,{ data:{ available } },{
         id:restId ,page:pagination.current,limit:pagination.pageSize,keyword:searchValue
      }));
   }

   return (
      <div>
         <Select
            showSearch
            style={{ width : 200 }}
            optionFilterProp="children"
            filterOption={ filterName }
            placeholder={ '请选择餐馆' }
            onChange={ handleChange }
            value={ restId }
         >
            {renderRestaurantSelect()}
         </Select>

         <div className='menu-table'>
            <Table columns={ configColumns() }
               dataSource={ list }
               rowKey={ '_id' }
               loading={ loading }
               pagination={
                  pagination
               }
               onChange = { handlePageChange }
            />
         </div>
      </div>
   );
}
