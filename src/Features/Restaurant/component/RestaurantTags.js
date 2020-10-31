import React,{ useMemo } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { v4 as uuidv4 }  from 'uuid';
import { Tag } from 'antd';

export default function RestaurantTags ({ tags,removeTag }) {

   const renderRestaurantTags = useMemo(
      () => {

         const colors = [ 'magenta','orange','lime','cyan','purple','geekblue' ];
         return _.map(tags, (tag) => {

            return (
               <Tag key={ uuidv4() } color={ colors[_.random(colors.length)] } closable  onClose={ ()=>{ removeTag(tag); } } >{tag.toUpperCase()}</Tag>
            );
         });
      },
      [ tags ],
   );

   return (
      <div> {renderRestaurantTags}</div>

   );
}

RestaurantTags.propTypes = {

   tags:PropTypes.array,
   removeTag:PropTypes.func
};

