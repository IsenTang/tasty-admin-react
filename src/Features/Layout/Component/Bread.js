import React from 'react';
import { Breadcrumb } from 'antd';
import { useLocation } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';

export default function Bread () {

   let location = useLocation();

   /* 根据路径名称动态调整 */
   function renderBreadLocation (){

      return _.map(location.pathname.split('/'),(item)=>{

         if(item !== ''){

            return (
               <Breadcrumb.Item key={ uuidv4() } >
                  {/* 首字母大写 */}
                  {_.upperFirst(item)}
               </Breadcrumb.Item>
            );
         }else{
            return null;
         }
      });
   }

   return (
      <div>
         <Breadcrumb style={{ margin : '16px 0' }}>
            {renderBreadLocation()}
         </Breadcrumb>
      </div>
   );
}
