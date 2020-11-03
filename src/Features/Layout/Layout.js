import React,{ useState } from 'react';
import { Switch, useHistory,useLocation,useRouteMatch } from 'react-router-dom';
import { Layout as LayoutContainer , Menu } from 'antd';
import {
   DesktopOutlined,
   PieChartOutlined
} from '@ant-design/icons';
import _ from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';

import PrivateRoute from '../../Common/PrivateRoute';

import logoImage from '../../Assets/logo.png';
import './layout.scss';

/* components */
import Bread from './Component/Bread';

const { Header, Content, Footer, Sider } = LayoutContainer;

/* 布局 */
export default function Layout ({ routes }) {

   let [ collapsed,setCollapsed ] = useState(false);

   let history = useHistory();

   let { url } = useRouteMatch();

   let location = useLocation();

   function onCollapse (v){

      setCollapsed(v);
   }

   function renderAdminRoutes (){

      return _.map(routes,(item)=>{

         return (
            <PrivateRoute { ...item } path={ `${url}${item.path}` } key={ item.name }/>
         );
      });
   }

   /* 根据路由渲染左侧menu的激活状态 */
   function selectDefaultMenuItem (){
      let selected = _.last(location.pathname.split('/'));

      return [ `${selected}Option` ];
   }

   return (
      <LayoutContainer style={{ minHeight : '100vh' }} >

         {/* 侧边栏 */}
         <Sider collapsible collapsed={ collapsed } onCollapse={ onCollapse } >
            <div className="logo" >
               <img src={ logoImage } alt='logo' className='logo-image'/>
            </div>
            <Menu theme="dark" defaultSelectedKeys={ selectDefaultMenuItem() } mode="inline">
               <Menu.Item key="restaurantOption" icon={ <PieChartOutlined /> } onClick={ ()=>{

                  history.push(`${url}/restaurant`);
               } }>
                     餐馆
               </Menu.Item>
               <Menu.Item key="menuOption" icon={ <DesktopOutlined /> } onClick={ ()=>{

                  history.push(`${url}/menu`);
               } }>
                     菜单
               </Menu.Item>

               <Menu.Item key="orderOption" icon={ <DesktopOutlined /> } onClick={ ()=>{

                  history.push(`${url}/order`);
               } }>
                     订单
               </Menu.Item>
            </Menu>
         </Sider>

         {/* 内容栏 */}
         <LayoutContainer className="site-layout">

            {/* 内容头部 */}
            <Header className="site-layout-background" style={{ padding : 0 }} />

            {/* 右侧栏 */}
            <Content style={{ margin : '0 16px' }}>

               {/* 面包屑导航 */}
               <Bread/>
               {/* 主体内容 */}
               <div className="site-layout-background" style={{ padding : 24, minHeight : 360 }}>
                  <Switch>

                     {renderAdminRoutes()}
                  </Switch>
               </div>
            </Content>

            {/* 尾部 */}
            <Footer style={{ textAlign : 'center' }}>DELIVERY ADMIN ©{moment().year()} Created by ISEN</Footer>
         </LayoutContainer>
      </LayoutContainer>
   );
}

Layout.propTypes = {

   routes:PropTypes.array
};
