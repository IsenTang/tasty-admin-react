import React from 'react';
import { Redirect } from 'react-router-dom';
/* login */
import Login from '../Features/Login/Login';

/* admin */
import Layout from '../Features/Layout/Layout';
import Restaurant from '../Features/Restaurant/Restaurant';
import Menu from '../Features/Menu/Menu';
import Order from '../Features/Order/Order';

/* 404 */
import NotFound from '../Features/404/NotFound';

export default [
   {
      path:'/login',
      name:'login',
      component:Login
   },
   {
      path:'/admin',
      name:'admin',
      component:Layout,
      routes:[
         {
            path:'/restaurant',
            name:'restaurant',
            component:Restaurant
         },
         {
            path:'/menu',
            name:'menu',
            component:Menu
         },
         {
            path:'/order',
            name:'order',
            component:Order
         },
         {
            path:'/',
            name:'adminDefault',
            exact:true,
            component:()=>{
               return (
                  <Redirect to='/admin/restaurant'/>
               );
            }
         },
         {
            path:'/*',
            name:'adminLast',
            component:NotFound
         }
      ]
   },
   {
      path:'/*',
      name:'last',
      component:()=>{
         return (
            <Redirect to='/admin/restaurant'/>
         );
      }
   }
];