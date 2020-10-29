import { configureStore } from '@reduxjs/toolkit';

/* pages */
import restaurant from '../Features/Restaurant/state';
import menu from '../Features/Menu/state';

export default configureStore({
   reducer: {
      restaurant,
      menu
   },
});
