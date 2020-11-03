import React, { useEffect,useState } from 'react';
import _ from 'lodash';
import moment from 'moment';
import { DatePicker } from 'antd';
import echarts from 'echarts';
import ReactEcharts from 'echarts-for-react';
import { useDispatch,useSelector } from 'react-redux';

/* state */
import { selectList } from './state';

/* actions */
import { loadOrderByTime } from './state';

/* theme */

import vintageTheme from '../../Common/theme/vintage';
echarts.registerTheme('vintage',vintageTheme);

export default function Order () {

   const dispatch = useDispatch();

   const list = useSelector(selectList);

   const [ time, setTime ] = useState([]);

   const [ option , setOption ] = useState({
      title:{
         text: '线框图'
      },
      xAxis: {
         type: 'category',
         data: [  ]
      },
      yAxis: {
         type: 'value'
      },
   });

   useEffect(()=>{

      if(!_.isEmpty(list)){

         updateOptions();
      }

   },[ list ]);
   /*
    * 修改时间发送请求
   */
   function handleTime (v){

      setTime(v);
      dispatch(loadOrderByTime({
         start:v[0].toISOString(),
         end:v[1].toISOString()
      }));
   }

   /*
    * 更新线框图的数据
   */
   function updateOptions (){

      const formatStr = 'YYYY-MM-DD';
      let data = _(list).groupBy((item)=>{
         return moment(item.createdAt).format(formatStr);
      }).value();

      // x轴时间坐标
      const [ start , end ] = time;

      const range = moment.range(start, end).snapTo('day').by('days');

      const date = Array.from(range).map(m => m.format(formatStr));

      // 每天订单量
      const count = _.map(date,(d)=>{

         return data[d] ? data[d].length : 0;
      });

      setOption((v)=>{

         return {
            ...v,
            xAxis: {
               type: 'category',
               data: date
            },
            yAxis: {
               type: 'value'
            },
            series: [ {
               data: count,
               type: 'line',
               label: {
                  normal: {
                     show: true,
                     position: 'top',
                     textStyle: {
                        color: 'white'
                     }
                  }
               }
            } ]
         };
      });
   }

   return (
      <div>
         <DatePicker.RangePicker style={{ width : '70%' }}
            allowClear={ false }
            onChange= { handleTime }/>
         <ReactEcharts option={ option } theme='vintage'/>
      </div>
   );
}
