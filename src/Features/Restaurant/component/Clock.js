import React,{ useState } from 'react';
import moment from 'moment-timezone';
import { useInterval } from 'react-use';
import { Statistic } from 'antd';

export default function Clock () {

   let [ localTime, setLocationTime ] = useState(moment().tz('America/New_York').format('YYYY-MM-DD HH:mm:ss ddd'));
   /* 时间更新 */
   useInterval(()=>{

      setLocationTime(moment().tz('America/New_York').format('YYYY-MM-DD HH:mm:ss ddd'));

   },1000);

   return (
      <Statistic title="纽约当地时间" value={ localTime }/>
   );
}
