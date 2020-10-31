import 'moment/locale/zh-cn';
import React from 'react';
import { BrowserRouter as Router , Switch } from 'react-router-dom';
import _ from 'lodash';
import { useLocale } from './Common/utils';

/* router */
import routerConfig from './Router/index';
import PrivateRoute from './Common/PrivateRoute';

/* 初始化moment的翻译 */
useLocale('zh-cn');

function App () {

   function renderRoutes (){

      return _.map(routerConfig,(item)=>{

         return (
            <PrivateRoute { ...item } key={ item.name }/>
         );
      });
   }

   return (
      <Router>
         <Switch>
            {renderRoutes()}
         </Switch>
      </Router>
   );
}

export default App;
