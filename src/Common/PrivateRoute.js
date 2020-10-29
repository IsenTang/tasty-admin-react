import React from 'react';
import { Route,Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

export default function PrivateRoute ({ component:Component, ...rest }) {

   let redirectAddress = '/login';

   let isAuth = true;

   return (
      <Route { ...rest } render={ ()=>{

         return (
            isAuth ? <Component routes={ rest.routes }/> : <Redirect to={ redirectAddress }/>
         );
      } }/>
   );
}

PrivateRoute.propTypes = {

   component:PropTypes.func
};
