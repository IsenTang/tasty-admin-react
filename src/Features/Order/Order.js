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

   const [ lineOption , setLineOption ] = useState({
      title:{
         text: '订单量'
      },
      xAxis: {
         type: 'category',
         data: []
      },
      yAxis: {
         type: 'value'
      },
   });

   const [ pieOption , setpieOption ] = useState({
      title:{
         text: '订单人群'
      }
   });

   useEffect(()=>{

      if(!_.isEmpty(list)){

         updateLineOptions();
         updatePieOptions();
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
   function updateLineOptions (){

      const formatStr = 'YYYY-MM-DD';
      let data = _(list).groupBy((item)=>{
         return moment(item.createdAt).format(formatStr);
      }).value();

      // x轴时间坐标
      const [ start , end ] = time;

      const range = moment.range(start, end).snapTo('day').by('days');

      const date = Array.from(range).map(m => m.format(formatStr));

      // 每天订单量 线框图
      const count = _.map(date,(d)=>{

         return data[d] ? data[d].length : 0;
      });

      // 每天订单量 饼图
      const dayCount = _.map(date,(d)=>{

         return {
            name:d,
            value :data[d] ? data[d].length : 0
         };
      });

      setLineOption((v)=>{

         return {
            ...v,
            xAxis: {
               type: 'category',
               data: date,
            },
            yAxis: {
               type: 'value'
            },
            grid:{ right:'50%' },
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
            } ,{
               data:dayCount,
               type:'pie',
               radius:'50%',
               center:[ '75%','50%' ],
               label:{
                  show:true,
                  formatter:'{b} : {c} ({d}%)'
               }
            } ]
         };
      });
   }

   // 更新饼图
   function updatePieOptions (){

      let data = _(list).groupBy((item)=>{

         if(item.user){
            return item.user.username;
         }
      }).value();

      const userCount = _.map(data,(v,k)=>{

         return {
            name:k,
            value :v.length
         };
      });

      setpieOption((v)=>{
         return {
            ...v,
            series: [  {
               data:userCount,
               type:'pie',
               radius:'50%',
               label:{
                  show:true,
                  formatter:'{b} : {c} ({d}%)'
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

         <div style={{ 'marginTop' :'50px' }}>
            <ReactEcharts option={ lineOption } theme='vintage'/>
         </div>

         <div style={{ 'marginTop' :'50px' }}>
            <ReactEcharts option={ pieOption } theme='vintage'/>
         </div>
      </div>
   );
}
