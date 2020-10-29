import _ from 'lodash';

/**
 * custom error
 */
export default function CustomError (err) {

   /* First save the extra info */
   this.details = _.get(err, 'response.data.details');

   /* Get default code from err object */
   this.code = _.get(err, 'response.data.code');

   /* request timeout */
   if (/timeout of/.test(err.message)) { this.code = 'timeout'; }

   /* Net work error for google api */
   if (/Network Error/.test(err.message)) { this.code = 'network'; }

   this.message = _.get(err, 'response.data.message') || err.message;

   /* Decide error message to show */
   /* First find translation */

   /* If no translation, get the message from error or use universal message */
   this.message =
         _.get(err, 'response.data.message') ||
         err.message;

}

