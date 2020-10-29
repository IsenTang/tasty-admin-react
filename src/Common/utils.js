import _ from 'lodash';

export function setStorage (key, data) {
   if(!key) return;
   localStorage.setItem(key, JSON.stringify(data));
}

export function getStorage (key) {
   if(!key) return;
   let res = localStorage.getItem(key);
   try {
      return JSON.parse(res);
   } catch (err) {
      return res;
   }
}

/* 格式化价格 */
export function formatPrice (num,toFixed){

   /* Default Fixed to 2, toFixed can be 0 or null */
   if (_.isEmpty(toFixed) && toFixed !== 0 && toFixed !== null) {
      toFixed = 2;
   }

   /* Get the number string */
   num = Number(num) || 0;

   /* Get average number */
   let n = Math.abs(num) / 100;

   /* check if finite number */
   if (_.isFinite(toFixed)) {
      n = n.toFixed(toFixed);
   }

   /* Get currency */
   const p = `$${n}`;

   // /* Add () for negative */
   // if (num < 0) {
   //    return `(${p})`;
   // }

   return p;
}