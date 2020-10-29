import React from 'react';
import { BrowserRouter as Router , Switch } from 'react-router-dom';
import _ from 'lodash';
// import { v4 as uuidv4 } from 'uuid';

/* router */
import routerConfig from './Router/index';
import PrivateRoute from './Common/PrivateRoute';

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
