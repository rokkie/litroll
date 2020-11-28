import { configureStore } from '@reduxjs/toolkit';
import { name as mySliceName, reducer as mySliceReducer } from './my-slice';

export default configureStore({
  reducer: {
    [mySliceName]: mySliceReducer,
  },
});
